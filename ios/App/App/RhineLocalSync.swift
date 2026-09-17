import Capacitor
import CryptoKit
import Darwin
import Foundation
import Security

class RhineBridgeViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(RhineLocalSyncPlugin())
    }
}

@objc(RhineLocalSyncPlugin)
public class RhineLocalSyncPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "RhineLocalSyncPlugin"
    public let jsName = "RhineLocalSync"
    public let pluginMethods = [CAPPluginMethod(name: "exchange", returnType: CAPPluginReturnPromise)]
    private let queue = DispatchQueue(label: "com.halleylab.rhinelab.local-sync")
    private let protocolName = "rhine-lab-local-sync-v1"

    @objc func exchange(_ call: CAPPluginCall) {
        guard let authKey = call.getString("authKey"), authKey.range(of: "^[a-f0-9]{64}$", options: .regularExpression) != nil,
              let snapshot = call.getObject("snapshot"), let host = call.getString("host"), Self.isPrivateIPv4(host) else {
            call.reject("同步配置或电脑地址无效")
            return
        }
        queue.async {
            do {
                let key = SymmetricKey(data: Self.hexData(authKey))
                let peer = try self.discover(host: host, key: key)
                let body = try JSONSerialization.data(withJSONObject: ["protocol": self.protocolName, "snapshot": snapshot])
                guard body.count <= 32 * 1024 * 1024 else { throw Self.failure("数据量过大，请使用同步文件") }
                let timestamp = String(Int64(Date().timeIntervalSince1970 * 1000))
                let nonce = try Self.nonce()
                let digest = Self.hex(SHA256.hash(data: body))
                var request = URLRequest(url: URL(string: "https://\(host):\(peer.port)/exchange")!)
                request.httpMethod = "POST"
                request.httpBody = body
                request.timeoutInterval = 120
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
                request.setValue(timestamp, forHTTPHeaderField: "X-Rhine-Timestamp")
                request.setValue(nonce, forHTTPHeaderField: "X-Rhine-Nonce")
                request.setValue(Self.signature(key, "\(timestamp)\n\(nonce)\n\(digest)"), forHTTPHeaderField: "X-Rhine-Auth")
                let delegate = PinnedLocalSyncSession(host: host, fingerprint: peer.fingerprint) { result in
                    switch result {
                    case .success(let response):
                        guard response["protocol"] as? String == self.protocolName else { call.reject("本地同步验证失败"); return }
                        call.resolve(response)
                    case .failure(let error): call.reject(error.localizedDescription)
                    }
                }
                let configuration = URLSessionConfiguration.ephemeral
                configuration.timeoutIntervalForResource = 300
                configuration.urlCache = nil
                configuration.httpShouldSetCookies = false
                URLSession(configuration: configuration, delegate: delegate, delegateQueue: nil).dataTask(with: request).resume()
            } catch { call.reject(error.localizedDescription) }
        }
    }

    // Unicast works over system Bluetooth PAN without the restricted multicast entitlement.
    private func discover(host: String, key: SymmetricKey) throws -> (port: Int, fingerprint: String) {
        let timestamp = String(Int64(Date().timeIntervalSince1970 * 1000))
        let nonce = try Self.nonce()
        let body = try JSONSerialization.data(withJSONObject: [
            "protocol": protocolName, "timestamp": timestamp, "nonce": nonce,
            "signature": Self.signature(key, "DISCOVER\n\(timestamp)\n\(nonce)")
        ])
        let descriptor = Darwin.socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP)
        guard descriptor >= 0 else { throw Self.failure("无法连接电脑端") }
        defer { Darwin.close(descriptor) }
        var timeout = timeval(tv_sec: 3, tv_usec: 0)
        guard setsockopt(descriptor, SOL_SOCKET, SO_RCVTIMEO, &timeout, socklen_t(MemoryLayout<timeval>.size)) == 0 else { throw Self.failure("无法连接电脑端") }
        var address = sockaddr_in()
        address.sin_len = UInt8(MemoryLayout<sockaddr_in>.size)
        address.sin_family = sa_family_t(AF_INET)
        address.sin_port = UInt16(32124).bigEndian
        guard inet_pton(AF_INET, host, &address.sin_addr) == 1 else { throw Self.failure("电脑地址无效") }
        let connected = withUnsafePointer(to: &address) {
            $0.withMemoryRebound(to: sockaddr.self, capacity: 1) { Darwin.connect(descriptor, $0, socklen_t(MemoryLayout<sockaddr_in>.size)) }
        }
        guard connected == 0 else { throw Self.failure("未发现已连接的 Rhine Lab 电脑端") }
        let sent = body.withUnsafeBytes { Darwin.send(descriptor, $0.baseAddress, $0.count, 0) }
        guard sent == body.count else { throw Self.failure("未发现已连接的 Rhine Lab 电脑端") }
        var buffer = [UInt8](repeating: 0, count: 1024)
        let received = buffer.withUnsafeMutableBytes { Darwin.recv(descriptor, $0.baseAddress, $0.count, 0) }
        guard received > 0, received < buffer.count else { throw Self.failure("未发现已连接的 Rhine Lab 电脑端") }
        guard let response = try JSONSerialization.jsonObject(with: Data(buffer.prefix(received))) as? [String: Any],
              response["protocol"] as? String == protocolName, response["timestamp"] as? String == timestamp,
              response["nonce"] as? String == nonce, let port = response["port"] as? Int, (1024...65535).contains(port),
              let fingerprint = response["fingerprint"] as? String, fingerprint.range(of: "^[a-f0-9]{64}$", options: .regularExpression) != nil,
              let signature = response["signature"] as? String, signature.range(of: "^[a-f0-9]{64}$", options: .regularExpression) != nil,
              HMAC<SHA256>.isValidAuthenticationCode(Self.hexData(signature), authenticating: Data("REPLY\n\(timestamp)\n\(nonce)\n\(port)\n\(fingerprint)".utf8), using: key) else {
            throw Self.failure("传输密码不一致或本地同步验证失败")
        }
        return (port, fingerprint)
    }

    private static func isPrivateIPv4(_ host: String) -> Bool {
        let parts = host.split(separator: ".", omittingEmptySubsequences: false)
        guard parts.count == 4, parts.allSatisfy({ $0.range(of: "^(0|[1-9][0-9]{0,2})$", options: .regularExpression) != nil }),
              parts.allSatisfy({ Int($0)! <= 255 }) else { return false }
        let numbers = parts.map { Int($0)! }
        return numbers[0] == 10 || numbers[0] == 192 && numbers[1] == 168
            || numbers[0] == 169 && numbers[1] == 254 || numbers[0] == 172 && (16...31).contains(numbers[1])
    }

    private static func nonce() throws -> String {
        var bytes = [UInt8](repeating: 0, count: 16)
        guard SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes) == errSecSuccess else { throw failure("无法生成安全连接") }
        return hex(bytes)
    }

    private static func hexData(_ value: String) -> Data {
        var output = Data()
        var index = value.startIndex
        while index < value.endIndex {
            let next = value.index(index, offsetBy: 2)
            output.append(UInt8(value[index..<next], radix: 16)!)
            index = next
        }
        return output
    }

    private static func hex<S: Sequence>(_ bytes: S) -> String where S.Element == UInt8 { bytes.map { String(format: "%02x", $0) }.joined() }
    private static func signature(_ key: SymmetricKey, _ value: String) -> String { hex(HMAC<SHA256>.authenticationCode(for: Data(value.utf8), using: key)) }
    fileprivate static func failure(_ message: String) -> NSError { NSError(domain: "RhineLocalSync", code: 1, userInfo: [NSLocalizedDescriptionKey: message]) }
}

private final class PinnedLocalSyncSession: NSObject, URLSessionDataDelegate {
    private let host: String
    private let fingerprint: String
    private let completion: (Result<[String: Any], Error>) -> Void
    private var body = Data()
    private var failure: Error?
    private let limit = 32 * 1024 * 1024

    init(host: String, fingerprint: String, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        self.host = host; self.fingerprint = fingerprint; self.completion = completion
    }

    func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        guard challenge.protectionSpace.authenticationMethod == NSURLAuthenticationMethodServerTrust,
              challenge.protectionSpace.host == host, let trust = challenge.protectionSpace.serverTrust,
              let certificate = SecTrustGetCertificateAtIndex(trust, 0) else { completionHandler(.cancelAuthenticationChallenge, nil); return }
        let hash = SHA256.hash(data: SecCertificateCopyData(certificate) as Data).map { String(format: "%02x", $0) }.joined()
        guard hash == fingerprint else { completionHandler(.cancelAuthenticationChallenge, nil); return }
        SecTrustSetAnchorCertificates(trust, [certificate] as CFArray)
        SecTrustSetAnchorCertificatesOnly(trust, true)
        SecTrustSetPolicies(trust, SecPolicyCreateBasicX509())
        guard SecTrustEvaluateWithError(trust, nil) else { completionHandler(.cancelAuthenticationChallenge, nil); return }
        completionHandler(.useCredential, URLCredential(trust: trust))
    }

    func urlSession(_ session: URLSession, task: URLSessionTask, willPerformHTTPRedirection response: HTTPURLResponse, newRequest request: URLRequest, completionHandler: @escaping (URLRequest?) -> Void) { completionHandler(nil) }

    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive response: URLResponse, completionHandler: @escaping (URLSession.ResponseDisposition) -> Void) {
        guard (response as? HTTPURLResponse)?.statusCode == 200, response.expectedContentLength <= Int64(limit) else {
            failure = RhineLocalSyncPlugin.failure((response as? HTTPURLResponse)?.statusCode == 401 ? "传输密码不一致" : "本地同步响应无效")
            completionHandler(.cancel); return
        }
        completionHandler(.allow)
    }

    func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        guard body.count + data.count <= limit else { failure = RhineLocalSyncPlugin.failure("数据量过大，请使用同步文件"); dataTask.cancel(); return }
        body.append(data)
    }

    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        defer { session.finishTasksAndInvalidate() }
        if let error = failure ?? error { completion(.failure(error)); return }
        do {
            guard let response = try JSONSerialization.jsonObject(with: body) as? [String: Any] else { throw RhineLocalSyncPlugin.failure("本地同步响应无效") }
            completion(.success(response))
        } catch { completion(.failure(error)) }
    }
}

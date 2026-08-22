import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
    private let latestReleaseURL = URL(string: "https://api.github.com/repos/HalleyLab/Rhine_Lab/releases/latest")!
    private let updateCheckInterval: TimeInterval = 12 * 60 * 60
    private var updateCheckRunning = false

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = CAPBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        checkForUpdatesIfNeeded()
    }

    private func checkForUpdatesIfNeeded() {
        guard !updateCheckRunning else { return }
        let defaults = UserDefaults.standard
        let lastCheck = defaults.double(forKey: "rhineLabLastUpdateCheck")
        guard Date().timeIntervalSince1970 - lastCheck >= updateCheckInterval else { return }
        updateCheckRunning = true

        var request = URLRequest(url: latestReleaseURL)
        request.timeoutInterval = 9
        request.setValue("application/vnd.github+json", forHTTPHeaderField: "Accept")
        request.setValue("2022-11-28", forHTTPHeaderField: "X-GitHub-Api-Version")
        request.setValue("Rhine-Lab-iOS", forHTTPHeaderField: "User-Agent")

        URLSession.shared.dataTask(with: request) { [weak self] data, response, _ in
            guard let self else { return }
            defer { self.updateCheckRunning = false }
            guard let httpResponse = response as? HTTPURLResponse,
                  httpResponse.statusCode == 200,
                  let data,
                  let payload = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  payload["draft"] as? Bool != true,
                  payload["prerelease"] as? Bool != true,
                  let tag = payload["tag_name"] as? String,
                  let releasePage = payload["html_url"] as? String,
                  let releaseURL = URL(string: releasePage) else { return }

            defaults.set(Date().timeIntervalSince1970, forKey: "rhineLabLastUpdateCheck")
            let latestVersion = self.normalizedVersion(tag)
            let currentVersion = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "0"
            guard self.compareVersions(latestVersion, currentVersion) == .orderedDescending else { return }
            DispatchQueue.main.async {
                self.presentUpdatePrompt(version: latestVersion, releaseURL: releaseURL)
            }
        }.resume()
    }

    private func presentUpdatePrompt(version: String, releaseURL: URL) {
        guard let presenter = topViewController(), presenter.presentedViewController == nil else { return }
        let alert = UIAlertController(
            title: "Rhine Lab 更新",
            message: "发现新版本 \(version)。iOS 将通过系统发布页面或 TestFlight 完成安装。",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "稍后", style: .cancel))
        alert.addAction(UIAlertAction(title: "查看更新", style: .default) { _ in
            UIApplication.shared.open(releaseURL)
        })
        presenter.present(alert, animated: true)
    }

    private func topViewController() -> UIViewController? {
        var controller = window?.rootViewController
        while let presented = controller?.presentedViewController { controller = presented }
        if let navigation = controller as? UINavigationController { return navigation.visibleViewController }
        if let tabs = controller as? UITabBarController { return tabs.selectedViewController }
        return controller
    }

    private func normalizedVersion(_ value: String) -> String {
        let withoutPrefix = value.trimmingCharacters(in: .whitespacesAndNewlines)
            .replacingOccurrences(of: "^[vV]", with: "", options: .regularExpression)
        return withoutPrefix.split(separator: "-", maxSplits: 1).first.map(String.init) ?? withoutPrefix
    }

    private func compareVersions(_ left: String, _ right: String) -> ComparisonResult {
        let leftParts = normalizedVersion(left).split(separator: ".").map { Int($0) ?? 0 }
        let rightParts = normalizedVersion(right).split(separator: ".").map { Int($0) ?? 0 }
        for index in 0..<max(leftParts.count, rightParts.count) {
            let leftValue = index < leftParts.count ? leftParts[index] : 0
            let rightValue = index < rightParts.count ? rightParts[index] : 0
            if leftValue < rightValue { return .orderedAscending }
            if leftValue > rightValue { return .orderedDescending }
        }
        return .orderedSame
    }
}

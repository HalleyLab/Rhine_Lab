package com.halleylab.rhinelab;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

@CapacitorPlugin(name = "RhineUsbSync")
public class RhineUsbSyncPlugin extends Plugin {
    private static final String PROTOCOL = "rhine-lab-local-sync-v1";
    private static final int DISCOVERY_PORT = 32124;
    private static final int MAX_RESPONSE_CHARS = 32 * 1024 * 1024;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();
    private final SecureRandom random = new SecureRandom();

    @PluginMethod
    public void exchange(PluginCall call) {
        String authKey = call.getString("authKey", "");
        JSObject snapshot = call.getObject("snapshot");
        if (!authKey.matches("^[a-f0-9]{64}$") || snapshot == null) {
            call.reject("同步配置无效");
            return;
        }
        executor.execute(() -> {
            try {
                Peer peer = discoverDesktop(authKey);
                call.resolve(exchangeWithDesktop(peer, authKey, snapshot));
            } catch (Exception error) {
                call.reject("未发现已连接的 Rhine Lab 电脑端");
            }
        });
    }

    private Peer discoverDesktop(String authKey) throws Exception {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String nonce = randomHex(16);
        JSObject request = new JSObject();
        request.put("protocol", PROTOCOL);
        request.put("timestamp", timestamp);
        request.put("nonce", nonce);
        request.put("signature", messageSignature(authKey, "DISCOVER\n" + timestamp + "\n" + nonce));
        byte[] body = request.toString().getBytes(StandardCharsets.UTF_8);
        byte[] buffer = new byte[1024];
        try (DatagramSocket socket = new DatagramSocket()) {
            socket.setBroadcast(true);
            socket.setSoTimeout(1800);
            socket.send(new DatagramPacket(body, body.length, InetAddress.getByName("255.255.255.255"), DISCOVERY_PORT));
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
            socket.receive(packet);
            String address = packet.getAddress().getHostAddress();
            JSONObject response = new JSONObject(new String(packet.getData(), 0, packet.getLength(), StandardCharsets.UTF_8));
            int port = response.optInt("port");
            String fingerprint = response.optString("fingerprint");
            String signed = "REPLY\n" + timestamp + "\n" + nonce + "\n" + port + "\n" + fingerprint;
            if (!isPrivateAddress(address)
                || !PROTOCOL.equals(response.optString("protocol"))
                || !timestamp.equals(response.optString("timestamp"))
                || !nonce.equals(response.optString("nonce"))
                || port < 1024 || port > 65535
                || !fingerprint.matches("^[a-f0-9]{64}$")
                || !messageSignature(authKey, signed).equals(response.optString("signature"))) {
                throw new IllegalStateException("Invalid discovery response");
            }
            return new Peer(address, port, fingerprint);
        }
    }

    private JSObject exchangeWithDesktop(Peer peer, String authKey, JSObject snapshot) throws Exception {
        JSObject request = new JSObject();
        request.put("protocol", PROTOCOL);
        request.put("snapshot", snapshot);
        byte[] body = request.toString().getBytes(StandardCharsets.UTF_8);
        String timestamp = String.valueOf(System.currentTimeMillis());
        String nonce = randomHex(16);

        HttpsURLConnection connection = (HttpsURLConnection) new URL("https://" + peer.address + ":" + peer.port + "/exchange").openConnection();
        connection.setSSLSocketFactory(pinnedSslContext(peer.fingerprint).getSocketFactory());
        connection.setHostnameVerifier((hostname, session) -> peer.address.equals(hostname));
        try {
            connection.setConnectTimeout(3500);
            connection.setReadTimeout(12000);
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("X-Rhine-Timestamp", timestamp);
            connection.setRequestProperty("X-Rhine-Nonce", nonce);
            connection.setRequestProperty("X-Rhine-Auth", requestSignature(authKey, timestamp, nonce, body));
            connection.setFixedLengthStreamingMode(body.length);
            try (OutputStream output = connection.getOutputStream()) { output.write(body); }
            if (connection.getResponseCode() != HttpsURLConnection.HTTP_OK) throw new IllegalStateException("Exchange rejected");
            JSONObject response = new JSONObject(readUtf8(connection.getInputStream()));
            if (!PROTOCOL.equals(response.optString("protocol"))) throw new IllegalStateException("Invalid exchange response");
            JSObject result = new JSObject();
            JSONObject remote = response.optJSONObject("snapshot");
            if (remote != null) result.put("snapshot", new JSObject(remote.toString()));
            return result;
        } finally {
            connection.disconnect();
        }
    }

    private SSLContext pinnedSslContext(String fingerprint) throws Exception {
        TrustManager[] trustManagers = new TrustManager[] { new X509TrustManager() {
            @Override public void checkClientTrusted(X509Certificate[] chain, String authType) { throw new SecurityException("Client certificates are not accepted"); }
            @Override public void checkServerTrusted(X509Certificate[] chain, String authType) {
                try {
                    if (chain == null || chain.length == 0) throw new SecurityException("Missing server certificate");
                    chain[0].checkValidity();
                    if (!fingerprint.equals(hex(MessageDigest.getInstance("SHA-256").digest(chain[0].getEncoded())))) throw new SecurityException("Server certificate mismatch");
                } catch (Exception error) { throw new SecurityException(error); }
            }
            @Override public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
        } };
        SSLContext context = SSLContext.getInstance("TLS");
        context.init(null, trustManagers, random);
        return context;
    }

    private String readUtf8(InputStream stream) throws Exception {
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
                if (output.length() > MAX_RESPONSE_CHARS) throw new IllegalStateException("Response too large");
            }
        }
        return output.toString();
    }

    private String requestSignature(String authKey, String timestamp, String nonce, byte[] body) throws Exception {
        String digest = hex(MessageDigest.getInstance("SHA-256").digest(body));
        return messageSignature(authKey, timestamp + "\n" + nonce + "\n" + digest);
    }

    private String messageSignature(String authKey, String value) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(fromHex(authKey), "HmacSHA256"));
        return hex(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
    }

    private String randomHex(int bytes) {
        byte[] value = new byte[bytes];
        random.nextBytes(value);
        return hex(value);
    }

    private static boolean isPrivateAddress(String address) {
        if (address.startsWith("10.") || address.startsWith("192.168.") || address.startsWith("169.254.")) return true;
        if (!address.startsWith("172.")) return false;
        String[] parts = address.split("\\.");
        if (parts.length < 2) return false;
        int second = Integer.parseInt(parts[1]);
        return second >= 16 && second <= 31;
    }

    private static byte[] fromHex(String value) {
        byte[] output = new byte[value.length() / 2];
        for (int index = 0; index < output.length; index += 1) output[index] = (byte) Integer.parseInt(value.substring(index * 2, index * 2 + 2), 16);
        return output;
    }

    private static String hex(byte[] value) {
        StringBuilder output = new StringBuilder(value.length * 2);
        for (byte item : value) output.append(String.format("%02x", item & 0xff));
        return output.toString();
    }

    @Override
    protected void handleOnDestroy() {
        executor.shutdownNow();
        super.handleOnDestroy();
    }

    private static final class Peer {
        final String address;
        final int port;
        final String fingerprint;

        Peer(String address, int port, String fingerprint) {
            this.address = address;
            this.port = port;
            this.fingerprint = fingerprint;
        }
    }
}

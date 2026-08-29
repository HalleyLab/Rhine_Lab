package com.halleylab.rhinelab;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.view.Display;
import android.view.WindowManager;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.core.content.FileProvider;

import com.getcapacitor.BridgeActivity;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends BridgeActivity {
    private static final String LATEST_RELEASE_API = "https://api.github.com/repos/HalleyLab/Rhine_Lab/releases/latest";
    private static final long UPDATE_CHECK_INTERVAL_MS = 12L * 60L * 60L * 1000L;
    private static final String UPDATE_PREFERENCES = "rhine_lab_updates";
    private static final String LAST_UPDATE_CHECK = "last_update_check";

    private final ExecutorService updateExecutor = Executors.newSingleThreadExecutor();
    private DownloadManager downloadManager;
    private long updateDownloadId = -1L;
    private File pendingUpdateFile;
    private boolean updateCheckStarted = false;
    private boolean awaitingUnknownSourcesPermission = false;

    private final BroadcastReceiver updateDownloadReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (!DownloadManager.ACTION_DOWNLOAD_COMPLETE.equals(intent.getAction())) return;
            long completedId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1L);
            if (completedId == updateDownloadId) handleCompletedUpdateDownload();
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(RhineUsbSyncPlugin.class);
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
        preferHighestRefreshRate();
        downloadManager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
        registerUpdateDownloadReceiver();
        checkForUpdatesIfNeeded();
    }

    @Override
    public void onResume() {
        super.onResume();
        if (awaitingUnknownSourcesPermission
            && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
            && getPackageManager().canRequestPackageInstalls()) {
            awaitingUnknownSourcesPermission = false;
            launchPackageInstaller();
        }
    }

    @Override
    public void onDestroy() {
        try {
            unregisterReceiver(updateDownloadReceiver);
        } catch (IllegalArgumentException ignored) {
            // The receiver may already be unregistered during process shutdown.
        }
        updateExecutor.shutdownNow();
        super.onDestroy();
    }

    private void registerUpdateDownloadReceiver() {
        IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(updateDownloadReceiver, filter, Context.RECEIVER_EXPORTED);
        } else {
            registerReceiver(updateDownloadReceiver, filter);
        }
    }

    private void checkForUpdatesIfNeeded() {
        if (updateCheckStarted) return;
        updateCheckStarted = true;
        long lastCheck = getSharedPreferences(UPDATE_PREFERENCES, MODE_PRIVATE).getLong(LAST_UPDATE_CHECK, 0L);
        if (System.currentTimeMillis() - lastCheck < UPDATE_CHECK_INTERVAL_MS) return;

        updateExecutor.execute(() -> {
            ReleaseInfo release = fetchLatestRelease();
            if (release == null) return;
            boolean updateAvailable = compareVersions(release.version, currentVersion()) > 0;
            if (updateAvailable && release.apkUrl.isEmpty()) return;
            getSharedPreferences(UPDATE_PREFERENCES, MODE_PRIVATE)
                .edit()
                .putLong(LAST_UPDATE_CHECK, System.currentTimeMillis())
                .apply();
            if (updateAvailable) {
                runOnUiThread(() -> promptForUpdate(release));
            }
        });
    }

    private ReleaseInfo fetchLatestRelease() {
        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(LATEST_RELEASE_API).openConnection();
            connection.setConnectTimeout(9000);
            connection.setReadTimeout(9000);
            connection.setRequestProperty("Accept", "application/vnd.github+json");
            connection.setRequestProperty("X-GitHub-Api-Version", "2022-11-28");
            connection.setRequestProperty("User-Agent", "Rhine-Lab-Android/" + currentVersion());
            if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) return null;

            String payload = readUtf8(connection.getInputStream());
            JSONObject release = new JSONObject(payload);
            if (release.optBoolean("draft") || release.optBoolean("prerelease")) return null;
            String version = normalizeVersion(release.optString("tag_name"));
            String apkUrl = "";
            JSONArray assets = release.optJSONArray("assets");
            if (assets != null) {
                for (int index = 0; index < assets.length(); index += 1) {
                    JSONObject asset = assets.optJSONObject(index);
                    if (asset == null) continue;
                    String name = asset.optString("name").toLowerCase();
                    if (name.endsWith(".apk")) {
                        apkUrl = asset.optString("browser_download_url");
                        break;
                    }
                }
            }
            return new ReleaseInfo(version, apkUrl);
        } catch (Exception error) {
            return null;
        } finally {
            if (connection != null) connection.disconnect();
        }
    }

    private String readUtf8(InputStream stream) throws Exception {
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) output.append(line);
        }
        return output.toString();
    }

    private void promptForUpdate(ReleaseInfo release) {
        if (isFinishing() || isDestroyed()) return;
        new AlertDialog.Builder(this)
            .setTitle("Rhine Lab 更新")
            .setMessage("发现新版本 " + release.version + "。是否现在下载并安装？")
            .setNegativeButton("稍后", null)
            .setPositiveButton("更新", (dialog, which) -> downloadUpdate(release))
            .show();
    }

    private void downloadUpdate(ReleaseInfo release) {
        try {
            File downloadDirectory = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
            if (downloadDirectory == null) throw new IllegalStateException("Update directory unavailable");
            pendingUpdateFile = new File(downloadDirectory, "Rhine-Lab-" + release.version + "-Android.apk");
            if (pendingUpdateFile.exists() && !pendingUpdateFile.delete()) {
                throw new IllegalStateException("Unable to replace previous update file");
            }

            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(release.apkUrl));
            request.setTitle("Rhine Lab " + release.version);
            request.setDescription("正在下载应用更新");
            request.setMimeType("application/vnd.android.package-archive");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setAllowedOverMetered(true);
            request.setAllowedOverRoaming(false);
            request.setDestinationInExternalFilesDir(this, Environment.DIRECTORY_DOWNLOADS, pendingUpdateFile.getName());
            updateDownloadId = downloadManager.enqueue(request);
            Toast.makeText(this, "正在下载更新…", Toast.LENGTH_SHORT).show();
        } catch (Exception error) {
            pendingUpdateFile = null;
            Toast.makeText(this, "无法开始下载更新", Toast.LENGTH_LONG).show();
        }
    }

    private void handleCompletedUpdateDownload() {
        DownloadManager.Query query = new DownloadManager.Query().setFilterById(updateDownloadId);
        try (Cursor cursor = downloadManager.query(query)) {
            if (cursor == null || !cursor.moveToFirst()) return;
            int status = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
            if (status == DownloadManager.STATUS_SUCCESSFUL && pendingUpdateFile != null && pendingUpdateFile.exists()) {
                openInstallerOrSettings();
            } else {
                pendingUpdateFile = null;
                Toast.makeText(this, "更新下载失败，请稍后重试", Toast.LENGTH_LONG).show();
            }
        }
    }

    private void openInstallerOrSettings() {
        if (pendingUpdateFile == null || !pendingUpdateFile.exists()) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !getPackageManager().canRequestPackageInstalls()) {
            awaitingUnknownSourcesPermission = true;
            Intent settingsIntent = new Intent(
                Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                Uri.parse("package:" + getPackageName())
            );
            startActivity(settingsIntent);
            Toast.makeText(this, "请允许 Rhine Lab 安装此更新", Toast.LENGTH_LONG).show();
            return;
        }
        launchPackageInstaller();
    }

    private void launchPackageInstaller() {
        if (pendingUpdateFile == null || !pendingUpdateFile.exists()) return;
        try {
            Uri apkUri = FileProvider.getUriForFile(
                this,
                getPackageName() + ".fileprovider",
                pendingUpdateFile
            );
            Intent installIntent = new Intent(Intent.ACTION_VIEW);
            installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(installIntent);
            pendingUpdateFile = null;
        } catch (Exception error) {
            Toast.makeText(this, "无法打开系统安装程序", Toast.LENGTH_LONG).show();
        }
    }

    private String currentVersion() {
        try {
            return getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
        } catch (Exception error) {
            return "0";
        }
    }

    private static String normalizeVersion(String value) {
        String normalized = value == null ? "" : value.trim().replaceFirst("^[vV]", "");
        int suffix = normalized.indexOf('-');
        return suffix >= 0 ? normalized.substring(0, suffix) : normalized;
    }

    private static int compareVersions(String left, String right) {
        String[] leftParts = normalizeVersion(left).split("\\.");
        String[] rightParts = normalizeVersion(right).split("\\.");
        int length = Math.max(leftParts.length, rightParts.length);
        for (int index = 0; index < length; index += 1) {
            int leftValue = index < leftParts.length ? parseVersionPart(leftParts[index]) : 0;
            int rightValue = index < rightParts.length ? parseVersionPart(rightParts[index]) : 0;
            if (leftValue != rightValue) return Integer.compare(leftValue, rightValue);
        }
        return 0;
    }

    private static int parseVersionPart(String value) {
        try {
            return Integer.parseInt(value.replaceAll("[^0-9].*$", ""));
        } catch (Exception error) {
            return 0;
        }
    }

    private static final class ReleaseInfo {
        final String version;
        final String apkUrl;

        ReleaseInfo(String version, String apkUrl) {
            this.version = version;
            this.apkUrl = apkUrl;
        }
    }

    @SuppressWarnings("deprecation")
    private void preferHighestRefreshRate() {
        Display display = getWindowManager().getDefaultDisplay();
        Display.Mode currentMode = display.getMode();
        Display.Mode preferredMode = currentMode;

        for (Display.Mode mode : display.getSupportedModes()) {
            boolean sameResolution = mode.getPhysicalWidth() == currentMode.getPhysicalWidth()
                && mode.getPhysicalHeight() == currentMode.getPhysicalHeight();
            if (sameResolution && mode.getRefreshRate() > preferredMode.getRefreshRate()) {
                preferredMode = mode;
            }
        }

        WindowManager.LayoutParams attributes = getWindow().getAttributes();
        attributes.preferredDisplayModeId = preferredMode.getModeId();
        attributes.preferredRefreshRate = preferredMode.getRefreshRate();
        getWindow().setAttributes(attributes);
    }
}

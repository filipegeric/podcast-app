package io.filipegeric.podcast;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.io.File;

@NativePlugin()
public class Downloader extends Plugin {
    DownloadManager downloadManager;
    long downloadId;

    BroadcastReceiver onDownloadComplete = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
            if (id == downloadId) {
                getSavedCall().success();
            }
        }
    };

    @Override
    protected void handleOnStart() {
        super.handleOnStart();
        getContext().registerReceiver(onDownloadComplete, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
        this.log("START");
    }

    @PluginMethod()
    public void download(PluginCall call) {
        saveCall(call);
        String url = call.getString("url");
        String title = call.getString("title", "Downloading podcast");
        String description = call.getString("description", "This might take a while");
        downloadManager = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
        Uri uri = Uri.parse(url);
        DownloadManager.Request request = new DownloadManager.Request(uri);
        request.setTitle(title);
        request.setDescription(description);

        request.setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI | DownloadManager.Request.NETWORK_MOBILE);
        request.setDestinationInExternalFilesDir(getContext(), Environment.DIRECTORY_DOWNLOADS, uri.getLastPathSegment());
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);


        downloadId = downloadManager.enqueue(request);
    }

    // Should return { url: string; value: any }
    @PluginMethod()
    public void get(PluginCall call) {
        String url = call.getString("url");
        Uri uri = Uri.parse(url);
        String fileName = uri.getLastPathSegment();
        String path = getContext().getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath();
        File file = new File(path + "/" + fileName);
        boolean exists = file.exists();
        if(!exists) {
            call.error("File not found in downloads");
            return;
        }
        JSObject result = new JSObject();
        result.put("url", url);
        result.put("value", file.getAbsolutePath());
        call.success(result);
    }

    @Override
    protected void handleOnDestroy() {
        getContext().unregisterReceiver(onDownloadComplete);
        super.handleOnDestroy();
    }

    private void log(String message) {
        Log.d("DEBUG", message);
    }
}

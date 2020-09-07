package io.filipegeric.podcast;

import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.util.concurrent.atomic.AtomicBoolean;

@NativePlugin()
public class MusicPlayer extends Plugin {
    MediaPlayer player;
    int activeId;
    ProgressObserver progressObserver;

    @PluginMethod()
    public void start(PluginCall call) {
        try {
            String url = call.getString("url");
            int id = call.getInt("id");

            if(player != null && !player.isPlaying() && activeId == id) {
                player.start();
                startProgressObserver();
                call.success();
                return;
            }

            if(player != null) {
                player.reset();
            } else {
                createMediaPlayer();
            }

            player.setDataSource(url);
            player.prepareAsync();

            player.setOnPreparedListener(mp -> {
                this.log("prepared " + url + " " + id);
                mp.start();
                startProgressObserver();
                activeId = id;
                call.success();
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PluginMethod()
    public void pause(PluginCall call) {
        if(this.player != null && this.player.isPlaying()) {
            this.player.pause();
            stopProgressObserver();
        }
        call.success();
    }

    @PluginMethod()
    public void seek(PluginCall call) {
        if(player == null) {
            call.success();
            return;
        }
        // value should be between 0 and 100
        double value = call.getDouble("value");
        int duration = player.getDuration();
        int msec = (int)(duration * (value/100));
        player.seekTo(msec);
        call.success();
    }

    public void updateProgress(double progress) {
        JSObject data = new JSObject();
        data.put("value", progress);
        notifyListeners("progress", data);
    }

    private void stopProgressObserver() {
        if(progressObserver != null) {
            progressObserver.stop();
            progressObserver = null;
        }
    }

    private void startProgressObserver() {
        stopProgressObserver();
        progressObserver = new ProgressObserver(this);
        new Thread(progressObserver).start();
    }

    private void createMediaPlayer() {
        player = new MediaPlayer();
        player.setAudioAttributes(
                new AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .build()
        );
    }

    private void log(String message) {
        Log.d("DEBUG", message);
    }

}

class ProgressObserver implements Runnable {
    private AtomicBoolean stop = new AtomicBoolean(false);
    private MusicPlayer musicPlayer;

    public ProgressObserver(MusicPlayer musicPlayer) {
        this.musicPlayer = musicPlayer;
    }

    public void stop() {
        stop.set(true);
    }

    @Override
    public void run() {
        while(!stop.get()) {
            if(musicPlayer.player == null) {
                continue;
            }
            double progress = (double) musicPlayer.player.getCurrentPosition() / musicPlayer.player.getDuration()*100;
            musicPlayer.updateProgress(progress);
            try {
                Thread.sleep(1000);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

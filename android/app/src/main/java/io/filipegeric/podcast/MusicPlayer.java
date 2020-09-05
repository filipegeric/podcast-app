package io.filipegeric.podcast;

import android.media.AudioAttributes;
import android.media.MediaPlayer;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

@NativePlugin()
public class MusicPlayer extends Plugin {
    MediaPlayer mediaPlayer;
//    String currentUrl;


    @PluginMethod()
    public void start(PluginCall call) {
        try {
            String url = call.getString("url");
            if(url == null || url.isEmpty()) {
                return;
            }

            if(mediaPlayer == null) {
                createMediaPlayer();
            }

            mediaPlayer.setDataSource(url);
            mediaPlayer.prepareAsync();

            mediaPlayer.setOnPreparedListener(mp -> {
                mp.start();
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void createMediaPlayer() {
        mediaPlayer = new MediaPlayer();
        mediaPlayer.setAudioAttributes(
                new AudioAttributes.Builder()
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .build()
        );
    }
}

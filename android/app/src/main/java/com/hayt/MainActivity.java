package com.hayt;

import android.content.Intent;

import com.facebook.react.ReactActivity;
import com.cboy.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "HAYT";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        SplashScreen.show(this);
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

}

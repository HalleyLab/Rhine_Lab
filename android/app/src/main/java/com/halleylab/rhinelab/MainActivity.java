package com.halleylab.rhinelab;

import android.os.Bundle;
import android.view.Display;
import android.view.WindowManager;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
        preferHighestRefreshRate();
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

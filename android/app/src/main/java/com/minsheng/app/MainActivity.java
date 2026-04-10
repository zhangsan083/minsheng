package com.minsheng.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 设置状态栏
        Window window = getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(Color.parseColor("#0944fc"));

        // 获取状态栏实际高度并注入到 WebView
        int statusBarHeight = 0;
        int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            statusBarHeight = getResources().getDimensionPixelSize(resourceId);
        }
        // 转换为 dp
        float density = getResources().getDisplayMetrics().density;
        final int heightDp = Math.round(statusBarHeight / density);

        // 等 WebView 加载完后注入 CSS
        getBridge().getWebView().post(() -> {
            String js = "javascript:(function(){" +
                "var s=document.createElement('style');" +
                "s.textContent='html{padding-top:" + heightDp + "px!important;}';" +
                "document.head.appendChild(s);" +
                "})()";
            getBridge().getWebView().evaluateJavascript(js, null);
        });

        // 返回手势处理
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (!handleBack()) {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                }
            }
        });
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        if (!handleBack()) {
            super.onBackPressed();
        }
    }

    private boolean handleBack() {
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null && webView.canGoBack()) {
                webView.goBack();
                return true;
            }
        } catch (Exception e) {
            // ignore
        }
        return false;
    }
}

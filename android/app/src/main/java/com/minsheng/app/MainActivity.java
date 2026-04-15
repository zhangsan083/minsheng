package com.minsheng.app;

import android.graphics.Rect;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private int lastKeyboardHeight = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();

        // 开启 edge-to-edge：系统不自动留空间，安全距离全部由 CSS 控制
        WindowCompat.setDecorFitsSystemWindows(window, false);

        window.setSoftInputMode(
            WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING |
            WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN
        );

        // 状态栏和导航栏透明，内容延伸到系统栏下方
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
        window.setNavigationBarColor(android.graphics.Color.TRANSPARENT);

        // 状态栏图标深色，延后执行确保不被 Capacitor 的 StatusBar 插件覆盖
        View decorView = window.getDecorView();
        decorView.post(() -> {
            WindowCompat.getInsetsController(window, decorView)
                .setAppearanceLightStatusBars(true);
        });

        // 用 WindowInsets 获取实际的状态栏和导航栏高度，注入精确 CSS
        final WebView webView = getBridge().getWebView();
        final float density = getResources().getDisplayMetrics().density;

        ViewCompat.setOnApplyWindowInsetsListener(decorView, (v, insets) -> {
            int statusPx = insets.getInsets(WindowInsetsCompat.Type.statusBars()).top;
            int navPx = insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom;
            int statusDp = Math.round(statusPx / density);
            int navDp = Math.round(navPx / density);

            webView.post(() -> {
                webView.evaluateJavascript(
                    "(function(){var s=document.getElementById('status-bar-padding');" +
                    "if(s) s.textContent='html{padding-top:" + statusDp + "px!important;padding-bottom:" + navDp + "px!important;}';})()",
                    null
                );
            });

            return insets;
        });

        // 键盘监听
        setupKeyboardListener();

        // 返回手势
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

    private void setupKeyboardListener() {
        final View rootView = getWindow().getDecorView();
        final WebView webView = getBridge().getWebView();

        rootView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                Rect rect = new Rect();
                rootView.getWindowVisibleDisplayFrame(rect);
                int screenHeight = rootView.getHeight();
                int keyboardHeight = screenHeight - rect.bottom;

                if (keyboardHeight > 150) {
                    ViewGroup.LayoutParams params = webView.getLayoutParams();
                    params.height = rect.bottom - rect.top;
                    webView.setLayoutParams(params);

                    webView.postDelayed(() -> {
                        webView.evaluateJavascript(
                            "(function(){var el=document.activeElement;" +
                            "if(el&&(el.tagName==='INPUT'||el.tagName==='TEXTAREA')){" +
                            "el.scrollIntoView({behavior:'auto',block:'center'});}" +
                            "})()", null);
                    }, 50);
                } else if (lastKeyboardHeight > 150) {
                    ViewGroup.LayoutParams params = webView.getLayoutParams();
                    params.height = ViewGroup.LayoutParams.MATCH_PARENT;
                    webView.setLayoutParams(params);
                }
                lastKeyboardHeight = keyboardHeight;
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

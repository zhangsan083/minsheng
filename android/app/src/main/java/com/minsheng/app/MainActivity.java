package com.minsheng.app;

import android.graphics.Rect;
import android.os.Build;
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

        // 关闭 edge-to-edge
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

        getWindow().setSoftInputMode(
            WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING |
            WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN
        );

        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(android.graphics.Color.WHITE);
        window.setNavigationBarColor(android.graphics.Color.WHITE);

        // 强制状态栏图标为深色，确保在所有手机上可见
        WindowCompat.getInsetsController(window, window.getDecorView())
            .setAppearanceLightStatusBars(true);

        // 用 WindowInsets 监听实际的系统栏高度，给 WebView 父容器加 padding
        View contentView = findViewById(android.R.id.content);
        ViewCompat.setOnApplyWindowInsetsListener(contentView, (v, insets) -> {
            int navBarHeight = insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom;
            v.setPadding(0, 0, 0, navBarHeight);
            return insets;
        });

        // 状态栏和导航栏高度（用于 CSS 兜底注入）
        float density = getResources().getDisplayMetrics().density;
        int statusBarHeight = 0;
        int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            statusBarHeight = getResources().getDimensionPixelSize(resourceId);
        }
        final int statusDp = Math.round(statusBarHeight / density);

        int navBarHeight = 0;
        int navResourceId = getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        if (navResourceId > 0) {
            navBarHeight = getResources().getDimensionPixelSize(navResourceId);
        }
        final int navDp = Math.round(navBarHeight / density);

        // 注入精确的顶部和底部安全区域到 CSS
        final WebView webView = getBridge().getWebView();
        webView.post(() -> {
            webView.evaluateJavascript(
                "(function(){var s=document.getElementById('status-bar-padding');" +
                "if(s) s.textContent='html{padding-top:" + statusDp + "px!important;padding-bottom:" + navDp + "px!important;}';})()",
                null
            );
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

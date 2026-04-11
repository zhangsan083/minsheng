package com.minsheng.app;

import android.graphics.Rect;
import android.os.Bundle;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private int lastKeyboardHeight = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 强制设置键盘模式
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);

        // 设置状态栏透明
        Window window = getWindow();
        window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(android.graphics.Color.TRANSPARENT);

        // 获取状态栏实际高度并注入到 WebView（覆盖 JS 兜底的 28px）
        int statusBarHeight = 0;
        int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            statusBarHeight = getResources().getDimensionPixelSize(resourceId);
        }
        float density = getResources().getDisplayMetrics().density;
        final int heightDp = Math.round(statusBarHeight / density);

        // 获取导航栏高度并注入底部安全距离
        int navBarHeight = 0;
        int navResourceId = getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        if (navResourceId > 0) {
            navBarHeight = getResources().getDimensionPixelSize(navResourceId);
        }
        final int navHeightDp = Math.round(navBarHeight / density);

        // 用同一个 id='status-bar-padding'，覆盖 JS 兜底，同时加底部安全距离
        getBridge().getWebView().post(() -> {
            String js = "(function(){" +
                "var s=document.getElementById('status-bar-padding');" +
                "if(!s){s=document.createElement('style');s.id='status-bar-padding';document.head.appendChild(s);}" +
                "s.textContent='html{padding-top:" + heightDp + "px!important;}" +
                ".app-tabbar{padding-bottom:" + navHeightDp + "px!important;}';" +
                "})()";
            getBridge().getWebView().evaluateJavascript(js, null);
        });

        // 监听键盘弹出/收起，通知 WebView 滚动到输入框
        setupKeyboardListener();

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

    private void setupKeyboardListener() {
        final View rootView = getWindow().getDecorView().getRootView();
        rootView.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            @Override
            public void onGlobalLayout() {
                Rect rect = new Rect();
                rootView.getWindowVisibleDisplayFrame(rect);
                int screenHeight = rootView.getHeight();
                int keyboardHeight = screenHeight - rect.bottom;

                // 键盘高度变化超过 150px 认为是键盘弹出
                if (keyboardHeight > 150 && lastKeyboardHeight <= 150) {
                    // 键盘弹出，通知 WebView 滚动到当前输入框
                    WebView webView = getBridge().getWebView();
                    if (webView != null) {
                        webView.evaluateJavascript(
                            "(function(){" +
                            "var el=document.activeElement;" +
                            "if(el&&(el.tagName==='INPUT'||el.tagName==='TEXTAREA')){" +
                            "setTimeout(function(){el.scrollIntoView({behavior:'smooth',block:'start'});window.scrollBy(0,-80);},100);" +
                            "}" +
                            "})()",
                            null
                        );
                    }
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

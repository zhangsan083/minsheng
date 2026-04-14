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

        // 获取状态栏高度注入顶部 padding（因为状态栏透明，内容会延伸上去）
        float density = getResources().getDisplayMetrics().density;
        int statusBarHeight = 0;
        int resourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            statusBarHeight = getResources().getDimensionPixelSize(resourceId);
        }
        final int statusDp = Math.round(statusBarHeight / density);

        // 延迟检测：如果系统已为状态栏留了空间，清除 CSS 兜底
        final WebView webView = getBridge().getWebView();
        View contentView2 = findViewById(android.R.id.content);
        contentView2.post(() -> {
            int[] location = new int[2];
            webView.getLocationOnScreen(location);
            // 如果 WebView 顶部位置 > 状态栏高度的一半，说明系统留了空间
            if (location[1] > statusDp) {
                webView.evaluateJavascript(
                    "(function(){var s=document.getElementById('status-bar-padding');if(s)s.textContent='';})()",
                    null
                );
            }
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

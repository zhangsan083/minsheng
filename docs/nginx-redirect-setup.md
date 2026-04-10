# Nginx 主域名随机跳转备用域名配置方案

## 目标

访问主域名 `xjevn.cn` 时，随机 302 跳转到备用域名 `jocdd.cn` 或 `xswgk.cn`。
备用域名正常提供前端页面服务。

## 当前状态

- `redirect.conf` 已创建（内容正确，不需要动）
- `msasset-app.conf` 是接口 API 配置（不要动）
- `sites-enabled/default` 里的前端 server 块还没改（需要修改）

---

## 操作步骤

### 第一步：确认 redirect.conf 内容正确

```bash
cat /etc/nginx/conf.d/redirect.conf
```

应该显示：

```
split_clients $request_id $redirect_domain {
    50%  https://jocdd.cn;
    *    https://xswgk.cn;
}
```

如果内容不对，执行 `nano /etc/nginx/conf.d/redirect.conf` 修正。

### 第二步：编辑 sites-enabled/default

```bash
nano /etc/nginx/conf.d/msasset-web-app.conf
```

用方向键找到下面这个 server 块（包含 6 个前端域名的那个）：

```
server {
    listen 80;
    server_name www.xjevn.cn xjevn.cn www.jocdd.cn jocdd.cn www.xswgk.cn xswgk.cn;
    root /data/web/msasset-app;
    ...（中间很多内容）...
    error_log /var/log/nginx/msasset-web-admin-error.log;
}
```

删除方法：把光标移到这个 server 块的第一行（`server {`），反复按 `Ctrl+K` 逐行删除，直到整个 server 块（到对应的 `}` 为止）全部删完。

然后在同一位置，粘贴以下内容（复制后在终端右键粘贴或 `Ctrl+Shift+V`）：

```
# 主域名：随机跳转到备用域名（供EdgeOne回源）
server {
    listen 80;
    server_name www.xjevn.cn xjevn.cn;

    # 获取真实IP（配合EdgeOne）
    set_real_ip_from 0.0.0.0/0;
    real_ip_header X-Forwarded-For;
    real_ip_recursive on;

    location / {
        return 302 $redirect_domain$request_uri;
    }

    # 访问日志
    access_log /var/log/nginx/msasset-redirect-access.log;
    error_log /var/log/nginx/msasset-redirect-error.log;
}

# 前端静态资源服务（HTTP，供EdgeOne回源）
server {
    listen 80;
    server_name www.jocdd.cn jocdd.cn www.xswgk.cn xswgk.cn;

    # 根目录指向dist文件夹
    root /data/web/msasset-app;
    index index.html;

    # 获取真实IP（配合EdgeOne）
    set_real_ip_from 0.0.0.0/0;
    real_ip_header X-Forwarded-For;
    real_ip_recursive on;

    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json image/svg+xml;

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        # 启用CORS（如果需要）
        add_header Access-Control-Allow-Origin *;
        # 防止404错误时记录到access_log
        log_not_found off;
    }

    # Vue Router的history模式支持
    location / {
        try_files $uri $uri/ /index.html;
        # 禁止访问隐藏文件
        location ~ /\. {
            deny all;
            access_log off;
            log_not_found off;
        }
    }

    # 访问日志
    access_log /var/log/nginx/msasset-web-app-access.log;
    error_log /var/log/nginx/msasset-web-app-error.log;
}

```

保存：`Ctrl+O` 回车，退出：`Ctrl+X`

注意：文件里的其他 server 块（28001 端口后台、29001 端口管理前端、API 接口、default_server）都不要动。

### 第三步：测试配置

```bash
nginx -t
```

正确输出：

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

如果报错，不要执行下一步，把错误信息发给我。

### 第四步：重载 Nginx

```bash
nginx -s reload
```

---

## 验证

```bash
curl -I http://xjevn.cn
curl -I http://xjevn.cn
curl -I http://jocdd.cn
curl -I http://xswgk.cn
```

前两个应该返回 302 + Location 随机指向备用域名，后两个应该返回 200。

---

## 回滚方法

```bash
rm /etc/nginx/conf.d/redirect.conf
cp /etc/nginx/sites-enabled/default.bak /etc/nginx/sites-enabled/default
nginx -t
nginx -s reload
```

# 民生资产 (Minsheng Assets)

## 项目简介
本项目为“民生资产”移动端应用，旨在提供数据确权、资产管理、积分兑换等服务。

## 技术栈 (Tech Stack)

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 组件库**: Vant UI 4.x
- **状态管理**: Pinia
- **路由管理**: Vue Router 4.x
- **HTTP 请求**: Axios
- **CSS 预处理**: Sass / SCSS
- **代码规范**: ESLint + Prettier

## 目录结构 (Directory Structure)

```
src/
├── api/             # API 接口管理 (按模块划分)
│   └── user.js      # 示例: 用户相关接口
├── assets/          # 静态资源
│   ├── images/      # 图片资源
│   └── icons/       # 图标资源
├── components/      # 公共组件 (展示型组件)
├── composables/     # 组合式函数 (Hooks)
├── layouts/         # 布局组件 (如: 基础布局、登录布局)
├── router/          # 路由配置
├── stores/          # Pinia 状态管理
├── styles/          # 全局样式
├── types/           # TypeScript 类型定义 (如需)
├── utils/           # 工具函数 (HTTP 拦截器等)
├── views/           # 页面组件 (业务逻辑)
├── App.vue          # 根组件
└── main.js          # 入口文件
```

## 开发指南

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 构建生产环境
```bash
npm run build
```

### 3. 代码检查与格式化
```bash
npm run lint      # 检查代码
npm run format    # 格式化代码
```

## 模块职责划分

1.  **Views (src/views)**:
    -   承载页面级业务逻辑。
    -   调用 `stores` 获取状态，调用 `api` 获取数据。
    -   不包含复杂的通用 UI 逻辑，UI 逻辑下沉到 `components`。

2.  **Stores (src/stores)**:
    -   管理全局状态（如用户信息、Token、购物车）。
    -   包含业务动作（Actions），如“登录”、“注销”。

3.  **API (src/api)**:
    -   统一管理后端接口地址。
    -   禁止在 Views 中直接使用 `axios.get/post`，必须通过 API 模块调用。

4.  **Utils (src/utils)**:
    -   `http.js`: 封装 Axios 拦截器（Token 注入、错误处理）。
    -   其他纯函数工具。

5.  **Composables (src/composables)**:
    -   复用逻辑抽离（如：验证码倒计时、分页逻辑）。

## 移动端适配
本项目使用 Vant UI 的 `rem` 或 `viewport` 适配方案（当前配置依赖 Vite 插件处理）。

## 部署说明
- 构建产物位于 `dist/` 目录。
- 未来支持通过 Capacitor 打包为原生 App。

# xyt556 软件展示站

基于 GitHub Pages 的静态软件展示网站，支持通过 **Decap CMS** 在浏览器中后台编辑、随时更新内容，无需改代码。

## 本地预览

用任意静态服务器在项目根目录启动即可，例如：

```bash
# 若已安装 Node.js
npx serve .

# 或 Python
python -m http.server 8080
```

浏览器打开 `http://localhost:8080`（或对应端口）即可查看首页；后台地址为 `http://localhost:8080/admin/`。

## 部署到 GitHub Pages

1. 在 GitHub 上新建仓库，仓库名建议为 **`你的用户名.github.io`**（例如 `xyt556.github.io`），这样网站地址为 `https://你的用户名.github.io`。
2. 将本仓库内容推送到该仓库的 **main** 分支（或你使用的默认分支）。
3. 在仓库 **Settings → Pages** 中：
   - **Source** 选 **Deploy from a branch**
   - **Branch** 选 `main`（或你的默认分支），目录选 **/ (root)**
   - 保存后等待几分钟，即可访问 `https://你的用户名.github.io`。

若仓库名不是 `用户名.github.io`，则地址为 `https://你的用户名.github.io/仓库名/`。此时需要把 `index.html` 里引用资源改为带仓库名前缀（或使用 `CONTENT_BASE`），并在 `admin/config.yml` 中设置 `site_url` 和 `display_url` 为实际访问地址。

## 后台编辑（Decap CMS）

- 网站上线后，在浏览器打开：**`https://你的用户名.github.io/admin/`**
- 首次使用会要求用 **GitHub 账号登录**（需对该仓库有写权限）。
- 登录后可编辑：
  - **站点设置**：站点名称、主标题、描述、关于区块、页脚等（对应 `content/site.json`）。
  - **软件列表**：增删改软件条目，填写名称、版本、描述、下载链接等（对应 `content/software.json`）。
- 点击「保存」后，Decap CMS 会直接向该 GitHub 仓库提交修改，GitHub Pages 会自动重新部署，几分钟内网站内容即可更新。

### 使用 GitHub 后台的前提

Decap CMS 使用 GitHub 作为后端，需要满足：

1. **仓库为公开仓库**，或你已配置好 GitHub OAuth App（见下）。
2. 若网站是 **私有仓库**，或希望用「用 GitHub 登录」按钮登录后台，需要先申请一个 **GitHub OAuth App**，并在 Decap 中配置：
   - 在 GitHub：**Settings → Developer settings → OAuth Apps** 中 New OAuth App。
   - **Authorization callback URL** 填：`https://api.netlify.com/auth/dialog`（Decap 使用 Netlify 的认证代理）。
   - 将生成的 **Client ID** 和 **Client Secret** 按 [Decap 文档](https://decapcms.org/docs/github-backend/) 配置到 `admin/config.yml` 的 `backend` 下（或使用环境变量）。

若仓库是公开的，且你直接在该仓库的 Collaborators 里用 GitHub 登录，有时无需 OAuth 即可使用（视 Decap/Netlify 当前策略而定）。遇到登录问题可查阅 [Decap CMS - GitHub Backend](https://decapcms.org/docs/github-backend/)。

### 修改后台使用的仓库/分支

编辑 **`admin/config.yml`**：

- `backend.repo`：改为你的仓库，格式 `用户名/仓库名`。
- `backend.branch`：改为你要编辑的分支（如 `main`）。
- `site_url` / `display_url`：改为你实际的网站地址（若不用 `用户名.github.io` 根路径，要带子路径）。

## 目录结构

```
.
├── index.html          # 首页
├── css/
│   └── style.css      # 样式
├── js/
│   ├── config.js      # 前端配置（如内容根路径）
│   └── main.js        # 加载 content/*.json 并渲染
├── content/
│   ├── site.json      # 站点文案（后台「站点设置」编辑）
│   └── software.json  # 软件列表（后台「软件列表」编辑）
├── admin/
│   ├── index.html     # Decap CMS 入口
│   └── config.yml     # Decap CMS 配置（仓库、集合、字段）
└── README.md
```

## 技术说明

- 前端：纯 HTML + CSS + JS，无构建步骤，直接由 GitHub Pages 托管。
- 内容：`content/site.json`、`content/software.json` 由前端异步加载并渲染；后台通过 Decap CMS 编辑这两类内容并写回仓库。
- 后台：Decap CMS（原 Netlify CMS），通过 GitHub 后端实现「浏览器内编辑 → 提交到仓库 → Pages 自动更新」的流程。

按上述步骤部署并配置好仓库与（如需要）OAuth 后，即可在后台随时更新你的软件展示站。

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

### 后台「Login with GitHub」显示 Not Found 的说明

Decap CMS 的「用 GitHub 登录」会跳转到 **Netlify** 的认证接口（`api.netlify.com/auth`）。你的站若**只部署在 GitHub Pages**，Netlify 上没有对应站点，就会返回 **Not Found**。

**推荐做法：同一仓库再部署到 Netlify，用 Netlify 的地址进后台**

1. 打开 [Netlify](https://app.netlify.com)，用 GitHub 登录。
2. 点击 **Add new site → Import an existing project**，选 **GitHub**，授权后选择仓库 **xyt556/xyt556.github.io**。
3. **Build settings** 保持默认即可（或 Build command 留空、Publish directory 填 `./`），点 **Deploy**。
4. 部署完成后会得到一个地址，例如 `https://随机名.netlify.app`。
5. **以后进后台请用 Netlify 的地址**：`https://随机名.netlify.app/admin/`，再点 **Login with GitHub**，即可正常登录。编辑保存后仍会提交到同一 GitHub 仓库，GitHub Pages（`https://xyt556.github.io`）也会自动更新。

首页继续用 `https://xyt556.github.io` 访问即可；只有编辑时用 Netlify 的 `/admin/` 地址。

### 使用 GitHub 后台的前提

- 仓库需对该 GitHub 账号有**写权限**（本人或 Collaborator）。
- 若希望**只在 GitHub Pages 域名下**用「Login with GitHub」（不部署 Netlify），需自建或使用第三方 OAuth 代理，见 [Decap 外部 OAuth 客户端](https://decapcms.org/docs/external-oauth-clients/)。

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

# 鲸鱼娘 AI 每日废话

每天在 DeepSeek Harness 输入框下方显示一句由当前模型生成的废话。

主角是一只傲娇、蠢萌、爱吃白饭的小鲸鱼娘。插件会把当天生成的结果缓存在本地，同一天刷新不会变化；也可以手动点击“AI 换一句”重新生成。

## 功能

- 生成 1080×1350 PNG 分享卡，包含鲸鱼娘插画、日期和白饭指数

- 调用 Harness 当前已配置的模型生成今日废话
- 同一天自动复用缓存，避免重复消耗模型调用
- “AI 换一句”可手动重新生成
- 模型不可用时自动使用内置备用台词
- 一键复制
- 中英文界面
- 固定人设提示词，不读取聊天记录、不发送工作区文件
- 兼容 DeepSeek Harness `0.2.1-rc.1` / `0.2.1-rc.2`

## 模型行为

- 优先使用 `deepseek-account` 提供方和 `deepseek-flash` 模型
- 如果不可用，会自动选择当前已注册的第一个模型提供方
- 单次生成设置了 45 秒超时和 120 token 上限
- 生成内容只保存在浏览器本地缓存中

## 示例

> “鲸鱼为什么会飞？因为我脑子里全是饭，比较轻。”

> “哼，才没有等你。只是这碗白饭刚好多盛了一点。”

## 安装

发布到 npm 后：

```bash
dsh plugin --profile desktop add dsh-whale-daily-nonsense
```

本地开发时可以直接安装文件夹：

```powershell
& "D:\deepseek\deepseek\resources\runtime\cli\bin\dsh.cmd" plugin --profile desktop add "C:\Users\29747\Documents\Codex\2026-10-21\wo\outputs\dsh-whale-daily-nonsense"
```

安装后重新启动 DeepSeek Harness。

## 开发

- `index.js`：调用 `ctx.llm.stream()` 并注册受控 RPC 生成入口
- `client.js`：React UI、每日缓存、AI 重新生成和 `conversation.composer.dock` 插槽
- `cordis.patch.yml`：插件 bundle 行
- `locale/*.json`：插件市场显示信息
- `icon.svg`：原创插件图标

发布步骤见 [PUBLISHING.md](./PUBLISHING.md)。
## 自定义模型

默认路由写在 `cordis.patch.yml`：

```yaml
- insert:
    - id: whale-daily-nonsense
      name: 'dsh-whale-daily-nonsense'
      config:
        provider: deepseek-account
        model: deepseek-flash
```

修改 `provider` 和 `model` 即可切换到 Harness 中已注册的其他模型。如果指定路由不可用，插件会尝试当前第一个可用提供方。
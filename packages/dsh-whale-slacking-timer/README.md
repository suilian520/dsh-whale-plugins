# 鲸鱼娘随机摸鱼计时器

给 DeepSeek Harness 输入框下方加一个随机摸鱼计时器。它会随机选择 45–180 秒的休息时间，并用傲娇、蠢萌、爱吃白饭的小鲸鱼娘语气吐槽你。

## 功能

- 随机 45–180 秒摸鱼倒计时
- 暂停、继续、再来一次
- 记录当天完成的摸鱼次数，并在本地保存
- 中英文界面
- 无网络请求、无 shell 权限、无凭据访问
- 兼容 DeepSeek Harness `0.2.1-rc.1` / `0.2.1-rc.2`

## 台词风格

> “时间到。才不是心疼你，只是白饭快凉了。”

> “只准摸一会儿。我的白饭你别碰。”

## 安装

发布到 npm 后：

```bash
dsh plugin --profile desktop add dsh-whale-slacking-timer
```

本地开发时可以直接安装文件夹：

```powershell
& "D:\deepseek\deepseek\resources\runtime\cli\bin\dsh.cmd" plugin --profile desktop add "C:\Users\29747\Documents\Codex\2026-10-21\wo\outputs\dsh-whale-slacking-timer"
```

安装后重新启动 DeepSeek Harness。

## 开发

- `client.js`：React UI、倒计时逻辑、`conversation.composer.dock` 插槽
- `index.js`：宿主入口
- `cordis.patch.yml`：插件 bundle 行
- `locale/*.json`：插件市场显示信息
- `icon.svg`：原创插件图标

发布步骤见 [PUBLISHING.md](./PUBLISHING.md)。
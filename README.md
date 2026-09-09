# Panda Art Online 落地页

熊猫派艺术 Panda Art Online 中文课程介绍落地页（静态站点，无需构建）。

- `index.html` / `style.css` / `script.js`
- 课程表数据在 `script.js` 里的 `schedule` 对象，改课表直接编辑即可。
- 试课表单和评价表单目前用 `mailto:` 发送；后续可换成真实表单服务。

## 本地预览

```bash
python3 -m http.server 8080
```

然后打开 http://localhost:8080

## 部署

推送到 `main` 分支后，GitHub Pages 自动发布。

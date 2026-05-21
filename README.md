# 白无常 Studio 个人作品集

这是一个四屏设计师个人作品集静态网站，已根据当前文件夹内的 4 张参考图完成页面结构、视觉风格、交互和响应式适配。

## 文件说明

- `index.html`：网页主体结构
- `styles.css`：视觉样式与移动端适配
- `script.js`：屏幕进度、作品筛选、画廊与图片放大交互
- `cover.html`：蔡易展作品集封面
- `cover.css`、`cover.js`：封面样式与点线网络背景
- `portfolio-cover.png`：已导出的封面图
- `5.5AI`、`AI`、`AI洗护套组`、`建模精修`、`拍摄精修`、`杂图`：第三屏作品画廊图片文件夹

## 运行方式

直接双击 `index.html` 即可在浏览器打开。

如果想用本地服务预览，也可以在当前文件夹运行：

```powershell
python -m http.server 5500
```

然后访问：

```text
http://localhost:5500
```

封面页访问：

```text
http://localhost:5500/cover.html
```

## 修改内容

改名字、简介、作品标题、联系方式时，主要编辑 `index.html`。第三屏作品卡片在 `index.html` 中维护，点击卡片后的画廊标题、文案和图片列表在 `script.js` 的 `projects` 中维护。

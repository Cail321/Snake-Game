# Snake MVP

贪吃蛇小游戏的 V0.1 基础版本。

## 当前范围

- 基础 HTML/CSS/Canvas 结构
- 主菜单
- 开始按钮
- 基础菜单状态切换
- 20 × 13 网格棋盘
- 3 节蛇的初始状态
- 150ms 固定节奏移动
- 暂时采用边界环绕，便于观察移动效果
- 支持 WASD 和方向键改变移动方向
- 禁止直接反向移动
- 苹果随机生成在空闲网格中
- 吃到苹果后分数增加，蛇身增长

当前刻意不包含碰撞和游戏结束逻辑。

## 运行

直接打开 `index.html`，或在项目目录运行：

```powershell
python -m http.server 5173
```

然后打开 <http://localhost:5173>。

## 检查

```powershell
npm.cmd run check
```

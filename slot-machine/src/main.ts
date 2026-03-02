import { Container, Graphics, Text, Rectangle } from 'pixi.js';
import { Game } from './core/Game';
import { AssetsManager } from './managers/AssetsManager';
import { SlotModel } from './models/SlotModel';
import { ReelView } from './views/ReelView';

async function bootstrap() {
    const game = Game.getInstance();
    await game.init('game-container');
    await AssetsManager.getInstance().loadAssets();

    const slotModel = new SlotModel();
    const reelsLayer = new Container();
    const uiLayer = new Container();

    const totalWidth = 5 * 180;
    const startX = (game.app.screen.width - totalWidth) / 2;
    const startY = 100;
    const totalHeight = 160 * 3;

    const slotFrame = new Graphics()
        .roundRect(startX, startY, totalWidth, totalHeight, 15)
        .fill({ color: 0x111111 })
        .stroke({ color: 0xffffff, width: 2 });

    reelsLayer.x = startX + 90;
    reelsLayer.y = startY;

    game.app.stage.addChild(slotFrame, reelsLayer, uiLayer);

    const reels = slotModel.grid.map((col, i) => {
        const reel = new ReelView(col, i);
        reelsLayer.addChild(reel);
        return reel;
    });

    const balanceTxt = new Text({ text: `Credits: ${slotModel.balance}`, style: { fill: 0xffffff, fontSize: 24 } });
    balanceTxt.position.set(20, 20);

    const winTxt = new Text({ text: 'WIN!', style: { fill: 0xffff00, fontSize: 60, fontWeight: 'bold' } });
    winTxt.position.set(550, 250);
    winTxt.visible = false;
    uiLayer.addChild(balanceTxt, winTxt);

    const btn = new Container();
    const bg = new Graphics().roundRect(0, 0, 180, 70, 15).fill(0xffcc00);
    const btnText = new Text({ text: 'SPIN', style: { fill: 0x000000, fontSize: 30, fontWeight: 'bold' } });

    btnText.anchor.set(0.5); btnText.position.set(90, 35);
    btn.addChild(bg, btnText);
    btn.position.set(550, 600);
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    btn.hitArea = new Rectangle(0, 0, 180, 70);

    let isSpinning = false;

    btn.on('pointerdown', async () => {
        if (isSpinning) {
            reels.forEach(r => r.stop());
            return;
        }

        isSpinning = true;
        btnText.text = "STOP";
        winTxt.visible = false;
        slotModel.balance -= 10;
        balanceTxt.text = `Credits: ${slotModel.balance}`;

        const reelResults = await Promise.all(reels.map((r, i) => r.spin(i * 150)));

        slotModel.setFinalGrid(reelResults);

        const win = slotModel.calculateWin();
        if (win.isWin) {
            winTxt.text = `WIN: ${win.prize}`;
            winTxt.visible = true;
        }

        btnText.text = "SPIN";
        balanceTxt.text = `Credits: ${slotModel.balance}`;
        isSpinning = false;
    });

    uiLayer.addChild(btn);
}

bootstrap();
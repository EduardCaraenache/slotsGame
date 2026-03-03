import {Container, Text, Graphics} from 'pixi.js';
import {Game} from './core/Game';
import {SlotModel} from './models/SlotModel';
import {ReelView} from './views/ReelView';
import {AssetsManager} from './managers/AssetsManager';
import {SLOT_CONFIG} from './config/Constants';

async function bootstrap() {
    const game = Game.getInstance();
    await game.init('game-container');
    await AssetsManager.getInstance().loadAssets();

    const model = new SlotModel();
    const reelsLayer = new Container();
    const uiLayer = new Container();

    const totalWidth = SLOT_CONFIG.REEL_COUNT * SLOT_CONFIG.REEL_WIDTH;
    const startX = (game.app.screen.width - totalWidth) / 2;

    reelsLayer.position.set(startX + SLOT_CONFIG.GAME_X_OFFSET, SLOT_CONFIG.GAME_Y_START);

    const frame = new Graphics()
        .roundRect(startX, SLOT_CONFIG.GAME_Y_START, totalWidth, SLOT_CONFIG.SYMBOL_SIZE * 3, 15)
        .fill({color: SLOT_CONFIG.FRAME_COLOR, alpha: 0.9})
        .stroke({color: SLOT_CONFIG.FRAME_BORDER_COLOR, width: 5});

    const reels = model.grid.map((col, i) => new ReelView(col, i));
    reels.forEach(r => reelsLayer.addChild(r));

    const balanceTxt = new Text({
        text: `${SLOT_CONFIG.BALANCE_STRING}: ${model.balance}`,
        style: {fill: SLOT_CONFIG.BALANCE_COLOR}});
    const spinBtn = createButton(SLOT_CONFIG.SPIN_STRING, game.app.screen.width / 2 - 90, 600);
    uiLayer.addChild(balanceTxt, spinBtn);

    let spinning = false;

    spinBtn.on('pointerdown', async () => {
        if (spinning) {
            reels.forEach(r => r.stop());
            return;
        }

        spinning = true;
        (spinBtn.children[1] as Text).text = SLOT_CONFIG.STOP_STRING;
        model.balance -= 10;
        balanceTxt.text = `${SLOT_CONFIG.BALANCE_STRING}: ${model.balance}`;

        const results = await Promise.all(reels.map((r, i) => r.spin(i * SLOT_CONFIG.STOP_DELAY)));

        model.updateGridFromView(results);
        model.calculateResult();

        balanceTxt.text = `${SLOT_CONFIG.BALANCE_STRING}: ${model.balance}`;
        (spinBtn.children[1] as Text).text = SLOT_CONFIG.SPIN_STRING;
        spinning = false;
    });

    game.app.stage.addChild(frame, reelsLayer, uiLayer);
}

function createButton(label: string, x: number, y: number): Container {
    const btn = new Container();
    const bg = new Graphics().roundRect(0, 0, 180, 60, 10).fill(SLOT_CONFIG.BUTTON_COLOR);
    const txt = new Text({text: label, style: {fontWeight: 'bold'}});
    txt.anchor.set(0.5);
    txt.position.set(90, 30);
    btn.addChild(bg, txt);
    btn.position.set(x, y);
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    return btn;
}

bootstrap();
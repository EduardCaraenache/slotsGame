import {Container, Text, Graphics, type Application} from 'pixi.js';
import {Game} from './core/Game';
import {SlotModel} from './models/SlotModel';
import {ReelView} from './views/ReelView';
import {AssetsManager} from './managers/AssetsManager';
import {SLOT_CONFIG} from './utils/GlobalConstants.ts';
import {StyleFactory} from "./utils/StyleFactory.ts";

async function bootstrap() {
    const game = Game.getInstance();
    await game.init('game-container');
    await AssetsManager.getInstance().loadAssets();

    const model = new SlotModel();
    const reelsLayer = new Container();
    const uiLayer = new Container();

    const centerX = game.app.screen.width / 2;
    const btnWidth = SLOT_CONFIG.BUTTON_WIDTH;
    const spacing = SLOT_CONFIG.BUTTON_SPACING;

    const betBtnX = centerX - btnWidth - (spacing / 2);
    const spinBtnX = centerX + (spacing / 2);

    const totalWidth = SLOT_CONFIG.REEL_COUNT * SLOT_CONFIG.REEL_WIDTH;
    const startX = (game.app.screen.width - totalWidth) / 2;

    reelsLayer.position.set(startX + SLOT_CONFIG.GAME_X_OFFSET, SLOT_CONFIG.GAME_Y_START);

    const frame = new Graphics()
        .roundRect(startX, SLOT_CONFIG.GAME_Y_START, totalWidth, SLOT_CONFIG.SYMBOL_SIZE * 3, 15)
        .fill({color: SLOT_CONFIG.FRAME_COLOR, alpha: 0.9})
        .stroke({color: SLOT_CONFIG.FRAME_BORDER_COLOR, width: 5});

    const reels = model.grid.map((col, i) => new ReelView(col, i));
    reels.forEach(r => reelsLayer.addChild(r));

    const margin = 30;

    const balanceTxt = new Text({
        text: `${SLOT_CONFIG.BALANCE_STRING}: ${model.balance}`,
        style: StyleFactory.getBalanceStyle()
    });

    balanceTxt.anchor.set(0, 1);
    balanceTxt.x = margin;
    balanceTxt.y = game.app.screen.height - margin;

    const spinBtn = createButton(
        SLOT_CONFIG.SPIN_STRING,
        spinBtnX,
        SLOT_CONFIG.Y_POSITION,
        SLOT_CONFIG.SPIN_BUTTON_COLOR);
    uiLayer.addChild(balanceTxt, spinBtn);

    let spinning = false;

    const betBtn = createButton(
        `${SLOT_CONFIG.BET_STRING}: ${model.currentBet}`,
        betBtnX,
        SLOT_CONFIG.Y_POSITION,
        SLOT_CONFIG.BET_BUTTON_COLOR);
    uiLayer.addChild(betBtn);

    const betTxt = betBtn.children[1] as Text;

    betBtn.on('pointerdown', () => {
        if (spinning) return;

        model.changeBet();
        betTxt.text = `${SLOT_CONFIG.BET_STRING}: ${model.currentBet}`;
    });

    spinBtn.on('pointerdown', async () => {
        if (spinning) {
            reels.forEach(r => r.stop());
            return;
        }

        if (!model.canAffordSpin()) {
            console.log("Fonduri insuficiente pentru miza de:", model.currentBet);
            return;
        }

        spinning = true;
        (spinBtn.children[1] as Text).text = SLOT_CONFIG.STOP_STRING;

        //============== LOGURI DEBUG ===================
        console.log("--- START SPIN ---");
        console.log("Balanță inițială:", model.balance);
        console.log("Miza selectată (Bet):", model.currentBet);

        model.balance -= model.currentBet;

        console.log("Balanță după scădere miza:", model.balance);
        //============================

        balanceTxt.text = `${SLOT_CONFIG.BALANCE_STRING}: ${model.balance}`;

        const results =
            await Promise.all(reels
                .map((r, i) =>
                    r.spin(i * SLOT_CONFIG.STOP_DELAY)));

        model.updateGridFromView(results);
        const win = model.calculateResult();

        if (win.isWin) {
            showWinMessage(win.prize, game.app, uiLayer);
            reels.forEach(r => r.highlightWin());

            const startBalance = model.balance - win.prize;
            await animateBalance(balanceTxt, startBalance, model.balance);
        }

        balanceTxt.text = `${SLOT_CONFIG.BALANCE_STRING}: ${model.balance}`;
        (spinBtn.children[1] as Text).text = SLOT_CONFIG.SPIN_STRING;
        spinning = false;
    });

    game.app.stage.addChild(frame, reelsLayer, uiLayer);

}

function createButton(label: string, x: number, y: number, color: string): Container {
    const btn = new Container();
    const bg = new Graphics()
        .roundRect(0, 0, SLOT_CONFIG.BUTTON_WIDTH, SLOT_CONFIG.BUTTON_HEIGHT, 15)
        .fill(color);
    const txt = new Text({
        text: label,
        style: StyleFactory.getButtonStyle()
    });
    txt.anchor.set(0.5);
    txt.position.set(SLOT_CONFIG.BUTTON_WIDTH / 2, SLOT_CONFIG.BUTTON_HEIGHT / 2);
    btn.addChild(bg, txt);
    btn.position.set(x, y);
    btn.eventMode = 'static';
    btn.cursor = 'pointer';

    btn.on('pointerover', () => btn.alpha = 0.8);
    btn.on('pointerout', () => btn.alpha = 1);

    return btn;
}

async function animateBalance(textElement: Text, start: number, end: number) {
    const duration = 1000;
    const startTime = performance.now();

    const update = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.floor(start + (end - start) * progress);
        textElement.text = `Credits: ${current}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };

    requestAnimationFrame(update);
}

function showWinMessage(amount: number, app: Application, container: Container) {
    const winPopup = new Text({
        text: `YOU WIN\n${amount}`,
        style: StyleFactory.getWinMessageStyle()
    });

    winPopup.anchor.set(0.5);
    winPopup.position.set(app.screen.width / 2, app.screen.height / 2);

    container.addChild(winPopup);

    winPopup.scale.set(0);
    let scale = 0;
    const animateIn = () => {
        if (scale < 1) {
            scale += 0.1;
            winPopup.scale.set(scale);
            requestAnimationFrame(animateIn);
        }
    };
    animateIn();

    // Îl ștergem după 2.5 secunde
    setTimeout(() => {
        container.removeChild(winPopup);
    }, 2500);
}

bootstrap();
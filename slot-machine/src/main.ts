import { Container, Text, Graphics, type Application } from 'pixi.js';
import { Game } from './core/Game';
import { SlotModel } from './models/SlotModel';
import { ReelView } from './views/ReelView';
import { AssetsManager } from './managers/AssetsManager';
import { SLOT_CONFIG } from './utils/GlobalConstants.ts';
import { StyleFactory } from "./utils/StyleFactory.ts";

let isSpinning = false;

async function bootstrap() {
    const game = Game.getInstance();
    await game.init('game-container');
    await AssetsManager.getInstance().loadAssets();

    const model = new SlotModel();
    const reelsLayer = new Container();
    const uiLayer = new Container();

    const centerX = game.app.screen.width / 2;

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
    uiLayer.addChild(balanceTxt);

    const betButtons: Container[] = [];
    const betValues = SLOT_CONFIG.BET_OPTIONS;
    const betBtnWidth = 110;
    const betSpacing = 15;
    const totalBetAreaWidth = (betBtnWidth * betValues.length) + (betSpacing * (betValues.length - 1));
    const betStartX = centerX - (totalBetAreaWidth / 2);

    betValues.forEach((value, index) => {
        const bBtn = createBetButton(
            value.toString(),
            betStartX + index * (betBtnWidth + betSpacing),
            SLOT_CONFIG.Y_POSITION,
            betBtnWidth,
            model.currentBet === value
        );

        bBtn.on('pointerdown', () => {
            if (isSpinning) {
                reels.forEach(r => r.stop());
                return;
            }

            model.currentBet = value;

            if (!model.canAffordSpin()) {
                const bg = bBtn.children[0] as Graphics;
                bg.tint = SLOT_CONFIG.RED_COLOR;
                setTimeout(() => bg.tint = SLOT_CONFIG.WHITE_COLOR, 200);

                updateButtonsUI(betButtons, betValues, model.currentBet, betBtnWidth, "SPIN");
                return;
            }

            updateButtonsUI(betButtons, betValues, model.currentBet, betBtnWidth, "STOP");
            handleAction(model, reels, balanceTxt, betButtons, betValues, betBtnWidth, uiLayer, game.app);
        });

        uiLayer.addChild(bBtn);
        betButtons.push(bBtn);
    });

    window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.code === 'Space') {
            event.preventDefault();

            if (isSpinning) {
                reels.forEach(r => r.stop());
            } else {
                if (model.canAffordSpin()) {
                    updateButtonsUI(betButtons, betValues, model.currentBet, betBtnWidth, "STOP");
                    handleAction(model, reels, balanceTxt, betButtons, betValues, betBtnWidth, uiLayer, game.app);
                } else {
                    const currentIndex = betValues.indexOf(model.currentBet);
                    const activeBtn = betButtons[currentIndex];

                    if (activeBtn) {
                        const bg = activeBtn.children[0] as Graphics;

                        bg.tint = SLOT_CONFIG.RED_COLOR;
                        setTimeout(() => {
                            bg.tint = SLOT_CONFIG.WHITE_COLOR;
                        }, 200);
                    }

                    console.log("Space: Fonduri insuficiente pentru miza curentă.");
                }
            }
        }
    });

    game.app.stage.addChild(frame, reelsLayer, uiLayer);
}

/**
 * Gestionează ciclul de Spin
 */
async function handleAction(
    model: SlotModel,
    reels: ReelView[],
    balanceTxt: Text,
    betButtons: Container[],
    betValues: number[],
    btnWidth: number,
    uiLayer: Container,
    app: Application
) {
    if (isSpinning) return;

    isSpinning = true;

    model.balance -= model.currentBet;
    balanceTxt.text = `${SLOT_CONFIG.BALANCE_STRING}: ${model.balance}`;

    const results = await Promise.all(
        reels.map((r, i) => r.spin(i * SLOT_CONFIG.STOP_DELAY))
    );

    model.updateGridFromView(results);
    const win = model.calculateResult();

    if (win.isWin) {
        showWinMessage(win.prize, app, uiLayer);
        reels.forEach(r => r.highlightWin());
        const startVal = model.balance - win.prize;
        await animateBalance(balanceTxt, startVal, model.balance);
    }

    isSpinning = false;

    updateButtonsUI(betButtons, betValues, model.currentBet, btnWidth, "SPIN");
    balanceTxt.text = `${SLOT_CONFIG.BALANCE_STRING}: ${model.balance}`;
}

/**
 * Actualizează UI-ul butoanelor (Culoare + Text de stare)
 */
function updateButtonsUI(buttons: Container[], values: number[], currentBet: number, width: number, stateText: string) {
    buttons.forEach((btn, i) => {
        const bg = btn.children[0] as Graphics;
        const statusTxt = btn.children[2] as Text;
        const isSelected = values[i] === currentBet;

        bg.clear()
            .roundRect(0, 0, width, SLOT_CONFIG.BUTTON_HEIGHT, 15)
            .fill(isSelected ? 0xFFAA00 : SLOT_CONFIG.BET_BUTTON_COLOR);

        statusTxt.text = stateText;
        statusTxt.style.fill = stateText === "STOP" ? SLOT_CONFIG.BLACK_COLOR : SLOT_CONFIG.WHITE_COLOR;
    });
}

/**
 * Creare buton de BET cu text dublu
 */
function createBetButton(value: string, x: number, y: number, width: number, isSelected: boolean): Container {
    const btn = new Container();

    const bg = new Graphics()
        .roundRect(0, 0, width, SLOT_CONFIG.BUTTON_HEIGHT, 15)
        .fill(isSelected ? 0xFFAA00 : SLOT_CONFIG.BET_BUTTON_COLOR);

    const valTxt = new Text({
        text: value,
        style: { ...StyleFactory.getButtonStyle(), fontSize: 28, fontWeight: 'bold' }
    });
    valTxt.anchor.set(0.5);
    valTxt.position.set(width / 2, SLOT_CONFIG.BUTTON_HEIGHT / 2 - 10);

    const statusTxt = new Text({
        text: "SPIN",
        style: { ...StyleFactory.getButtonStyle(), fontSize: 14, fontWeight: 'normal' }
    });
    statusTxt.anchor.set(0.5);
    statusTxt.position.set(width / 2, SLOT_CONFIG.BUTTON_HEIGHT / 2 + 15);

    btn.addChild(bg, valTxt, statusTxt);
    btn.position.set(x, y);
    btn.eventMode = 'static';
    btn.cursor = 'pointer';

    btn.on('pointerover', () => btn.alpha = 0.8);
    btn.on('pointerout', () => btn.alpha = 1);

    return btn;
}

/**
 * Helper Animație balanță
 */
async function animateBalance(textElement: Text, start: number, end: number) {
    const duration = 1000;
    const startTime = performance.now();
    return new Promise<void>((resolve) => {
        const update = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            textElement.text = `Credits: ${current}`;
            if (progress < 1) requestAnimationFrame(update);
            else resolve();
        };
        requestAnimationFrame(update);
    });
}

/**
 * Helper Win Message
 */
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
    setTimeout(() => container.removeChild(winPopup), 2500);
}

bootstrap();
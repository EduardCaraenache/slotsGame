import {Container, Text, Graphics, type Application, type Ticker} from 'pixi.js';
import { Game } from './core/Game';
import { SlotModel } from './models/SlotModel';
import { ReelView } from './views/ReelView';
import { AssetsManager } from './managers/AssetsManager';
import { COMMON_CONSTANTS } from './utils/GlobalConstants.ts';
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

    const totalWidth = COMMON_CONSTANTS.REEL_COUNT * COMMON_CONSTANTS.REEL_WIDTH;
    const startX = (game.app.screen.width - totalWidth) / 2;
    reelsLayer.position.set(startX + COMMON_CONSTANTS.GAME_X_OFFSET, COMMON_CONSTANTS.GAME_Y_START);

    const frame = new Graphics()
        .roundRect(startX, COMMON_CONSTANTS.GAME_Y_START, totalWidth, COMMON_CONSTANTS.SYMBOL_SIZE * 3, 15)
        .fill({color: COMMON_CONSTANTS.FRAME_COLOR, alpha: 0.9})
        .stroke({color: COMMON_CONSTANTS.FRAME_BORDER_COLOR, width: 5});

    const reels = model.grid.map((col, i) => new ReelView(col, i));
    reels.forEach(r => reelsLayer.addChild(r));

    const margin = 30;
    const balanceTxt = new Text({
        text: `${COMMON_CONSTANTS.BALANCE_TEXT}: ${model.balance}`,
        style: StyleFactory.getBalanceStyle()
    });
    balanceTxt.anchor.set(0, 1);
    balanceTxt.x = margin;
    balanceTxt.y = game.app.screen.height - margin;
    uiLayer.addChild(balanceTxt);

    const betButtons: Container[] = [];
    const betValues = COMMON_CONSTANTS.BET_OPTIONS;
    const betButtonWidth = 110;
    const betSpacing = 15;
    const totalBetAreaWidth = (betButtonWidth * betValues.length) + (betSpacing * (betValues.length - 1));
    const betStartX = centerX - (totalBetAreaWidth / 2);

    betValues.forEach((value, index) => {
        const betButton = createBetButton(
            value.toString(),
            betStartX + index * (betButtonWidth + betSpacing),
            COMMON_CONSTANTS.Y_POSITION,
            betButtonWidth,
            model.currentBet === value
        );

        betButton.on('pointerdown', () => {
            if (isSpinning) {
                reels.forEach(r => r.stop());
                return;
            }

            model.currentBet = value;

            if (!model.canAffordSpin()) {
                const bg = betButton.children[0] as Graphics;
                bg.tint = COMMON_CONSTANTS.RED_COLOR;
                setTimeout(() => bg.tint = COMMON_CONSTANTS.WHITE_COLOR, 200);

                showInsufficientFunds(game.app, uiLayer);

                updateButtonsUI(betButtons, betValues, model.currentBet, betButtonWidth, COMMON_CONSTANTS.SPIN_TEXT);
                return;
            }

            updateButtonsUI(betButtons, betValues, model.currentBet, betButtonWidth, COMMON_CONSTANTS.STOP_TEXT);
            handleAction(model, reels, balanceTxt, betButtons, betValues, betButtonWidth, uiLayer, game.app);
        });

        uiLayer.addChild(betButton);
        betButtons.push(betButton);
    });

    window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.code === 'Space') {
            event.preventDefault();

            if (isSpinning) {
                reels.forEach(r => r.stop());
            } else {
                if (model.canAffordSpin()) {
                    updateButtonsUI(betButtons, betValues, model.currentBet, betButtonWidth, COMMON_CONSTANTS.STOP_TEXT);
                    handleAction(model, reels, balanceTxt, betButtons, betValues, betButtonWidth, uiLayer, game.app);
                } else {
                    const currentIndex = betValues.indexOf(model.currentBet);
                    const activeButton = betButtons[currentIndex];

                    if (activeButton) {
                        const bg = activeButton.children[0] as Graphics;

                        bg.tint = COMMON_CONSTANTS.RED_COLOR;
                        setTimeout(() => {
                            bg.tint = COMMON_CONSTANTS.WHITE_COLOR;
                        }, 200);
                    }

                    showInsufficientFunds(game.app, uiLayer);
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
    buttonWidth: number,
    uiLayer: Container,
    app: Application
) {
    if (isSpinning) return;

    isSpinning = true;

    model.balance -= model.currentBet;
    balanceTxt.text = `${COMMON_CONSTANTS.BALANCE_TEXT}: ${model.balance}`;

    const results = await Promise.all(
        reels.map((r, i) => r.spin(i * COMMON_CONSTANTS.STOP_DELAY))
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

    updateButtonsUI(betButtons, betValues, model.currentBet, buttonWidth, COMMON_CONSTANTS.SPIN_TEXT);
    balanceTxt.text = `${COMMON_CONSTANTS.BALANCE_TEXT}: ${model.balance}`;
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
            .roundRect(0, 0, width, COMMON_CONSTANTS.BUTTON_HEIGHT, 15)
            .fill(isSelected ?
                COMMON_CONSTANTS.SPIN_BUTTON_COLOR :
                COMMON_CONSTANTS.BET_BUTTON_COLOR);

        statusTxt.text = stateText;
        statusTxt.style.fill = stateText === COMMON_CONSTANTS.STOP_TEXT ? COMMON_CONSTANTS.BLACK_COLOR : COMMON_CONSTANTS.WHITE_COLOR;
    });
}

/**
 * Creare buton de BET cu text dublu
 */
function createBetButton(value: string, x: number, y: number, width: number, isSelected: boolean): Container {
    const button = new Container();

    const bg = new Graphics()
        .roundRect(0, 0, width, COMMON_CONSTANTS.BUTTON_HEIGHT, 15)
        .fill(isSelected ? COMMON_CONSTANTS.SPIN_BUTTON_COLOR : COMMON_CONSTANTS.BET_BUTTON_COLOR);

    const valTxt = new Text({
        text: value,
        style: { ...StyleFactory.getButtonStyle(), fontSize: 28, fontWeight: 'bold' }
    });
    valTxt.anchor.set(0.5);
    valTxt.position.set(width / 2, COMMON_CONSTANTS.BUTTON_HEIGHT / 2 - 10);

    const statusTxt = new Text({
        text: COMMON_CONSTANTS.SPIN_TEXT,
        style: { ...StyleFactory.getButtonStyle(), fontSize: 14, fontWeight: 'normal' }
    });
    statusTxt.anchor.set(0.5);
    statusTxt.position.set(width / 2, COMMON_CONSTANTS.BUTTON_HEIGHT / 2 + 15);

    button.addChild(bg, valTxt, statusTxt);
    button.position.set(x, y);
    button.eventMode = 'static';
    button.cursor = 'pointer';

    button.on('pointerover', () => button.alpha = 0.8);
    button.on('pointerout', () => button.alpha = 1);

    return button;
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
            textElement.text = `${COMMON_CONSTANTS.BALANCE_TEXT}: ${current}`;
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
        text: `${COMMON_CONSTANTS.WIN_TEXT}\n${amount}`,
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

function showInsufficientFunds(app: Application, container: Container) {
    const toast = new Container();

    const message = new Text({
        text: COMMON_CONSTANTS.INSUFFICIENT_FUNDS_TEXT,
        style: StyleFactory.getInsufficientFunds()
    });

    message.anchor.set(0.5);
    toast.addChild(message);

    toast.x = app.screen.width / 2;
    toast.y = app.screen.height / 2;
    toast.alpha = 0;
    toast.scale.set(0.5);

    container.addChild(toast);

    let lifeTime = 0;
    const maxLife = 100;

    const animationTicker = (ticker: Ticker) => {
        lifeTime += ticker.deltaTime;

        if (lifeTime < 15) {
            toast.alpha += 0.1 * ticker.deltaTime;
            toast.scale.set(toast.scale.x + 0.05 * ticker.deltaTime);
        }
        toast.y -= ticker.deltaTime;

        if (lifeTime > 80) {
            toast.alpha -= 0.1 * ticker.deltaTime;
        }

        if (lifeTime >= maxLife || toast.alpha <= 0) {
            app.ticker.remove(animationTicker);
            container.removeChild(toast);
            toast.destroy({ children: true });
        }
    };

    app.ticker.add(animationTicker);
}

bootstrap();
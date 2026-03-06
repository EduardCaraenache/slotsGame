import {Container, Graphics, Ticker} from 'pixi.js';
import {SymbolView} from './SymbolView';
import {COMMON_CONSTANTS} from '../utils/GlobalConstants.ts';

export class ReelView extends Container {
    private symbols: SymbolView[] = [];
    private isSpinning: boolean = false;
    private speed: number = 0;
    private currentFriction: number = COMMON_CONSTANTS.FRICTION;
    private resolveSpin: ((results: number[]) => void) | null = null;

    constructor(initialData: number[], index: number) {
        super();
        this.x = index * COMMON_CONSTANTS.REEL_WIDTH;
        this.initSymbols(initialData);
        this.initMask();
        Ticker.shared.add(this.update, this);
    }

    public async spin(delay: number): Promise<number[]> {
        return new Promise(resolve => {
            this.resolveSpin = resolve;

            setTimeout(() => {
                this.isSpinning = true;
                this.speed = COMMON_CONSTANTS.SPIN_SPEED;
                this.currentFriction = COMMON_CONSTANTS.FRICTION;

                setTimeout(() => {
                    if (this.isSpinning) this.stop();
                }, 2000);
            }, delay);
        });
    }

    public stop(): void {
        if (!this.isSpinning) return;

        this.isSpinning = false;
        this.currentFriction = COMMON_CONSTANTS.QUICK_STOP_FRICTION;
    }

    public highlightWin(row: number) {
        const sortedSymbols = [...this.symbols].sort((a, b) => a.y - b.y);

        const targetSymbol = sortedSymbols[row + 1];

        if (targetSymbol) {
            this.playHighlightAnimation(targetSymbol);
        }
    }

    private playHighlightAnimation(symbol: SymbolView) {
        let elapsed = 0;
        const originalScale = 1;
        const maxScale = 1.15;

        const pulse = (ticker: Ticker) => {
            elapsed += 0.1 * ticker.deltaTime;

            const scale = originalScale + Math.sin(elapsed * 2) * (maxScale - originalScale);
            symbol.scale.set(scale);

            if (elapsed > 10) {
                symbol.scale.set(originalScale);
                Ticker.shared.remove(pulse);
            }
        };

        Ticker.shared.add(pulse);
    }


    private getVisibleIds(): number[] {
        const sorted = [...this.symbols].sort((a, b) => a.y - b.y);
        return [sorted[1].symbolId, sorted[2].symbolId, sorted[3].symbolId];
    }

    private applySmoothSnap(dt: number) {
        let allInPlace = true;
        const sorted = [...this.symbols].sort((a, b) => a.y - b.y);

        sorted.forEach((symbol, index) => {
            const targetY = (index - 1) * COMMON_CONSTANTS.SYMBOL_SIZE;
            const distance = targetY - symbol.y;

            if (Math.abs(distance) > 0.1) {
                symbol.y += distance * 0.2 * dt;
                allInPlace = false;
            } else {
                symbol.y = targetY;
            }
        });

        if (allInPlace) {
            this.speed = 0;
            this.symbols.forEach(s => s.setBlur(0));

            if (this.resolveSpin) {
                this.resolveSpin(this.getVisibleIds());
                this.resolveSpin = null;
            }
        }
    }

    private initSymbols(data: number[]): void {
        for (let i = 0; i < 5; i++) {
            const symbol = new SymbolView(data[i % 3]);
            symbol.y = (i - 1) * COMMON_CONSTANTS.SYMBOL_SIZE;
            this.symbols.push(symbol);
            this.addChild(symbol);
        }
    }

    private initMask(): void {
        const mask = new Graphics()
            .rect(-COMMON_CONSTANTS.REEL_WIDTH / 2, 0, COMMON_CONSTANTS.REEL_WIDTH, COMMON_CONSTANTS.SYMBOL_SIZE * 3)
            .fill(COMMON_CONSTANTS.WHITE_COLOR);
        this.addChild(mask);
        this.mask = mask;
    }

    private update(ticker: Ticker) {
        if (!this.isSpinning && this.speed <= 0) return;

        this.symbols.forEach(symbol => {
            symbol.y += this.speed * ticker.deltaTime;
            symbol.setBlur(this.speed);

            if (symbol.y >= COMMON_CONSTANTS.SYMBOL_SIZE * 4) {
                symbol.y -= 5 * COMMON_CONSTANTS.SYMBOL_SIZE;
                symbol.render(Math.floor(Math.random() * COMMON_CONSTANTS.ASSET_KEYS.length));
            }
        });

        if (!this.isSpinning) {
            this.speed *= this.currentFriction;

            if (this.speed < 3) {
                this.applySmoothSnap(ticker.deltaTime);
            }
        }
    }

}
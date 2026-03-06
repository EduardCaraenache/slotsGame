import {Container, Graphics, Ticker} from 'pixi.js';
import {SymbolView} from './SymbolView';
import {SLOT_CONFIG} from '../utils/GlobalConstants.ts';

export class ReelView extends Container {
    private symbols: SymbolView[] = [];
    private isSpinning: boolean = false;
    private speed: number = 0;
    private currentFriction: number = SLOT_CONFIG.FRICTION;

    constructor(initialData: number[], index: number) {
        super();
        this.x = index * SLOT_CONFIG.REEL_WIDTH;
        this.initSymbols(initialData);
        this.initMask();
        Ticker.shared.add(this.update, this);
    }

    public async spin(delay: number): Promise<number[]> {
        this.currentFriction = SLOT_CONFIG.FRICTION;
        return new Promise(resolve => {
            setTimeout(() => {
                this.isSpinning = true;
                this.speed = SLOT_CONFIG.SPIN_SPEED;

                setTimeout(() => this.stop(), 2000);

                const checkInterval = setInterval(() => {
                    if (this.speed === 0 && !this.isSpinning) {
                        clearInterval(checkInterval);
                        resolve(this.getVisibleIds());
                    }
                }, 100);
            }, delay);
        });
    }

    public stop(): void {
        this.isSpinning = false;
        this.currentFriction = SLOT_CONFIG.QUICK_STOP_FRICTION;
    }

    public getMiddleSymbol(): SymbolView {
        const sorted = [...this.symbols].sort((a, b) => a.y - b.y);
        return sorted[2];
    }

    public highlightWin() {
        const target = this.getMiddleSymbol();
        target.scale.set(1.2);
        setTimeout(() => target.scale.set(1.0), 500);
    }

    private getVisibleIds(): number[] {
        const sorted = [...this.symbols].sort((a, b) => a.y - b.y);
        return [sorted[1].symbolId, sorted[2].symbolId, sorted[3].symbolId];
    }

    private applySmoothSnap(dt: number) {
        let allInPlace = true;

        const sorted = [...this.symbols].sort((a, b) => a.y - b.y);

        sorted.forEach((symbol, index) => {
            const targetY = (index - 1) * SLOT_CONFIG.SYMBOL_SIZE;
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
        }
    }

    private initSymbols(data: number[]): void {
        for (let i = 0; i < 5; i++) {
            const symbol = new SymbolView(data[i % 3]);
            symbol.y = (i - 1) * SLOT_CONFIG.SYMBOL_SIZE;
            this.symbols.push(symbol);
            this.addChild(symbol);
        }
    }

    private initMask(): void {
        const mask = new Graphics()
            .rect(-SLOT_CONFIG.REEL_WIDTH / 2, 0, SLOT_CONFIG.REEL_WIDTH, SLOT_CONFIG.SYMBOL_SIZE * 3)
            .fill(0xffffff);
        this.addChild(mask);
        this.mask = mask;
    }

    private update(ticker: Ticker) {
        if (!this.isSpinning && this.speed <= 0) return;

        this.symbols.forEach(symbol => {
            symbol.y += this.speed * ticker.deltaTime;

            symbol.setBlur(this.speed);

            if (symbol.y >= SLOT_CONFIG.SYMBOL_SIZE * 4) {
                symbol.y -= 5 * SLOT_CONFIG.SYMBOL_SIZE;
                symbol.render(Math.floor(Math.random() * SLOT_CONFIG.ASSET_KEYS.length));
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
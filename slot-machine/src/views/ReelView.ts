import { Container, Graphics, Ticker } from 'pixi.js';
import { SymbolView } from './SymbolView';
import { SLOT_CONFIG } from '../config/Constants';

export class ReelView extends Container {
    private symbols: SymbolView[] = [];
    private isSpinning: boolean = false;
    private speed: number = 0;
    private stopTimer: any;

    constructor(initialData: number[], index: number) {
        super();
        this.x = index * SLOT_CONFIG.REEL_WIDTH;
        this.initSymbols(initialData);
        this.initMask();
        Ticker.shared.add(this.update, this);
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

    private update(ticker: Ticker): void {
        if (!this.isSpinning && this.speed <= 0) return;

        this.symbols.forEach(symbol => {
            symbol.y += this.speed * ticker.deltaTime;
            if (symbol.y >= SLOT_CONFIG.SYMBOL_SIZE * 4) {
                symbol.y -= 5 * SLOT_CONFIG.SYMBOL_SIZE;
                symbol.render(Math.floor(Math.random() * SLOT_CONFIG.ASSET_KEYS.length));
            }
        });

        if (!this.isSpinning && this.speed > 0) {
            this.speed *= SLOT_CONFIG.FRICTION;
            if (this.speed < 1) {
                this.speed = 0;
                this.alignSymbols();
            }
        }
    }

    private alignSymbols(): void {
        this.symbols.sort((a, b) => a.y - b.y);
        this.symbols.forEach((s, i) => s.y = (i - 1) * SLOT_CONFIG.SYMBOL_SIZE);
    }

    public async spin(delay: number): Promise<number[]> {
        return new Promise(resolve => {
            setTimeout(() => {
                this.isSpinning = true;
                this.speed = SLOT_CONFIG.SPIN_SPEED;
                this.stopTimer = setTimeout(() => this.stop(), 2000);

                const checkInterval = setInterval(() => {
                    if (this.speed <= 0 && !this.isSpinning) {
                        clearInterval(checkInterval);
                        resolve(this.getVisibleIds());
                    }
                }, 100);
            }, delay);
        });
    }

    public stop(): void {
        this.isSpinning = false;
        if (this.stopTimer) clearTimeout(this.stopTimer);
    }

    private getVisibleIds(): number[] {
        const sorted = [...this.symbols].sort((a, b) => a.y - b.y);
        return [sorted[1].symbolId, sorted[2].symbolId, sorted[3].symbolId];
    }
}
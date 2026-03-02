import { Container, Graphics, Ticker } from 'pixi.js';
import { SymbolView } from './SymbolView';

export class ReelView extends Container {
    private symbols: SymbolView[] = [];
    private symbolHeight: number = 160;
    private spinning: boolean = false;
    private speed: number = 0;
    private stopTimeout: any;

    constructor(initialData: number[], index: number) {
        super();
        this.x = index * 180;
        this.y = 0;

        if (index > 0) {
            const divider = new Graphics()
                .moveTo(-92, 80)
                .lineTo(-92, 80 + (this.symbolHeight * 3))
                .stroke({ color: 0x444444, width: 2 });
            this.addChild(divider);
        }

        for (let i = 0; i < 5; i++) {
            const symbol = new SymbolView(initialData[i % 3] || 0);
            symbol.y = i * 160;
            this.addChild(symbol);
            this.symbols.push(symbol);
        }

        const maskGraphic = new Graphics()
            .rect(-90, 0, 180, 480)
            .fill(0xffffff);

        this.addChild(maskGraphic);
        this.mask = maskGraphic;

        Ticker.shared.add(this.update, this);
    }

    private update(ticker: Ticker): void {
        if (!this.spinning && this.speed <= 0) return;

        this.symbols.forEach(symbol => {
            symbol.y += this.speed * ticker.deltaTime;

            if (symbol.y >= 480) {
                symbol.y -= 5 * 160;
                symbol.render(Math.floor(Math.random() * 5));
            }
        });

        if (!this.spinning && this.speed > 0) {
            this.speed *= 0.94;
            if (this.speed < 1)
            {
                this.speed = 0;
                this.alignSymbols();
            }
        }
    }

    private alignSymbols(): void
    {
        this.symbols.sort((a, b) => a.y - b.y);

        this.symbols.forEach((symbol, i) =>
        {
            symbol.y = i * 160;
        });
    }

    public getVisibleSymbols(): number[]
    {
        const sorted = [...this.symbols].sort((a, b) => a.y - b.y);

        return [
            (sorted[1] as any).symbolId,
            (sorted[2] as any).symbolId,
            (sorted[3] as any).symbolId
        ];
    }

    public async spin(delay: number): Promise<number[]> {
        return new Promise(resolve =>
        {
            if (this.stopTimeout) clearTimeout(this.stopTimeout);

            setTimeout(() => {
                this.spinning = true;
                this.speed = 40;

                this.stopTimeout = setTimeout(() => {
                    this.stop();
                }, 2000 + Math.random() * 1000);

                const checkStop = setInterval(() => {
                    if (this.speed <= 0 && !this.spinning) {
                        clearInterval(checkStop);
                        resolve(this.getVisibleSymbols());
                    }
                }, 100);
            }, delay);
        });
    }

    public stop(): void {
        if (this.spinning) {
            this.spinning = false;
            if (this.stopTimeout) clearTimeout(this.stopTimeout);
        }
    }
}
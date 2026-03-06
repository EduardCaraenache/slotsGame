import {COMMON_CONSTANTS, PAYLINES} from '../utils/GlobalConstants.ts';

export class SlotModel {
    public grid: number[][] = [];
    public balance: number = 1000;
    public currentBet: number = COMMON_CONSTANTS.BET_OPTIONS[COMMON_CONSTANTS.DEFAULT_BET_INDEX];

    constructor() {
        this.resetGrid();
    }

    private resetGrid(): void {
        this.grid = Array.from({length: COMMON_CONSTANTS.REEL_COUNT}, () =>
            Array.from({length: COMMON_CONSTANTS.ROW_COUNT}, () =>
                Math.floor(Math.random() * COMMON_CONSTANTS.ASSET_KEYS.length))
        );
    }

    public updateGridFromView(newGrid: number[][]): void {
        this.grid = newGrid;
    }

    public calculateResult() {
        let totalPrize = 0;
        const winningLines: any[] = [];

        PAYLINES.forEach((line, lineIndex) => {
            const symbolsOnLine = [
                this.grid[0][line[0]],
                this.grid[1][line[1]],
                this.grid[2][line[2]],
                this.grid[3][line[3]],
                this.grid[4][line[4]]
            ];

            let matchCount = 1;
            const firstSymbol = symbolsOnLine[0];

            for (let i = 1; i < symbolsOnLine.length; i++) {
                if (symbolsOnLine[i] === firstSymbol) {
                    matchCount++;
                } else {
                    break;
                }
            }

            if (matchCount >= 3) {
                const prize = this.getPrizeValue(firstSymbol, matchCount);
                if (prize > 0) {
                    totalPrize += prize;
                    winningLines.push({
                        lineIndex: lineIndex,
                        symbolId: firstSymbol,
                        count: matchCount,
                        prize: prize
                    });
                }
            }
        });

        this.balance += totalPrize;

        return {
            isWin: totalPrize > 0,
            prize: totalPrize,
            winningLines: winningLines
        };
    }

    private getPrizeValue(symbolId: number, count: number): number {
        const multiplier = (symbolId + 1) * count;
        return (this.currentBet / 20) * multiplier;
    }

    public canAffordSpin(): boolean {
        return this.balance >= this.currentBet;
    }
}
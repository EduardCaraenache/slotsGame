import { SLOT_CONFIG } from '../config/Constants';

export class SlotModel {
    public grid: number[][] = [];
    public balance: number = 1000;

    constructor() {
        this.resetGrid();
    }

    private resetGrid(): void {
        this.grid = Array.from({ length: SLOT_CONFIG.REEL_COUNT }, () =>
            Array.from({ length: SLOT_CONFIG.ROW_COUNT }, () =>
                Math.floor(Math.random() * SLOT_CONFIG.ASSET_KEYS.length))
        );
    }

    public updateGridFromView(newGrid: number[][]): void {
        this.grid = newGrid;
    }

    public calculateResult(): { isWin: boolean; prize: number } {
        const middleRow = this.grid.map(column => column[1]);
        const isWin = middleRow.every(val => val === middleRow[0]);
        const prize = isWin ? 100 : 0;
        this.balance += prize;
        return { isWin, prize };
    }
}
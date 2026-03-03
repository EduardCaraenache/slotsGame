import {SLOT_CONFIG} from '../utils/GlobalConstants.ts';

export class SlotModel {
    public grid: number[][] = [];
    public balance: number = 1000;
    public currentBet: number = SLOT_CONFIG.BET_OPTIONS[SLOT_CONFIG.DEFAULT_BET_INDEX];
    private betIndex: number = SLOT_CONFIG.DEFAULT_BET_INDEX;

    constructor() {
        this.resetGrid();
    }

    private resetGrid(): void {
        this.grid = Array.from({length: SLOT_CONFIG.REEL_COUNT}, () =>
            Array.from({length: SLOT_CONFIG.ROW_COUNT}, () =>
                Math.floor(Math.random() * SLOT_CONFIG.ASSET_KEYS.length))
        );
    }

    public changeBet(): void {
        this.betIndex = (this.betIndex + 1) % SLOT_CONFIG.BET_OPTIONS.length;
        this.currentBet = SLOT_CONFIG.BET_OPTIONS[this.betIndex];
    }

    public updateGridFromView(newGrid: number[][]): void {
        this.grid = newGrid;
    }

    public calculateResult(): { isWin: boolean; prize: number } {
        const middleRow = this.grid.map(column => column[1]);
        const isWin = middleRow.every(val => val === middleRow[0]);

        const multiplier = middleRow[0] + 2;
        const prize = isWin ? this.currentBet * multiplier : 0;

        this.balance += prize;
        return {isWin, prize};
    }

    public canAffordSpin(): boolean {
        return this.balance >= this.currentBet;
    }
}
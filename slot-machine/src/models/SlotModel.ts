import {COMMON_CONSTANTS} from '../utils/GlobalConstants.ts';

export class SlotModel {
    public grid: number[][] = [];
    public balance: number = 1000;
    public currentBet: number = COMMON_CONSTANTS.BET_OPTIONS[COMMON_CONSTANTS.DEFAULT_BET_INDEX];
    private betIndex: number = COMMON_CONSTANTS.DEFAULT_BET_INDEX;

    constructor() {
        this.resetGrid();
    }

    private resetGrid(): void {
        this.grid = Array.from({length: COMMON_CONSTANTS.REEL_COUNT}, () =>
            Array.from({length: COMMON_CONSTANTS.ROW_COUNT}, () =>
                Math.floor(Math.random() * COMMON_CONSTANTS.ASSET_KEYS.length))
        );
    }

    public changeBet(): void {
        this.betIndex = (this.betIndex + 1) % COMMON_CONSTANTS.BET_OPTIONS.length;
        this.currentBet = COMMON_CONSTANTS.BET_OPTIONS[this.betIndex];
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
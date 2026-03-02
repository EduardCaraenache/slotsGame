export class SlotModel {
    public grid: number[][] = [];
    public balance: number = 1000;

    constructor() {
        this.roll();
    }

    public roll(): number[][] {
        this.grid = [];
        for (let i = 0; i < 5; i++) {
            const column = [];
            for (let j = 0; j < 3; j++) {
                column.push(Math.floor(Math.random() * 5));
            }
            this.grid.push(column);
        }
        this.balance -= 10;
        return this.grid;
    }

    public checkWin(): { isWin: boolean, prize: number } {
        const mid = [this.grid[0][1], this.grid[1][1], this.grid[2][1]];
        const isWin = mid[0] === mid[1] && mid[1] === mid[2];
        const prize = isWin ? (mid[0] + 1) * 100 : 0;
        if (isWin) this.balance += prize;
        return { isWin, prize };
    }

    public setFinalGrid(newGrid: number[][]): void {
        this.grid = newGrid;
    }

    public calculateWin(): { isWin: boolean, prize: number } {
        const mid = [this.grid[0][1], this.grid[1][1], this.grid[2][1], this.grid[3][1], this.grid[4][1]];

        const isWin = mid[0] === mid[1] && mid[1] === mid[2];
        const prize = isWin ? 100 : 0;
        this.balance += prize;

        return { isWin, prize };
    }

}
import { Application } from 'pixi.js';

export class Game {
    private static instance: Game;
    public app!: Application;

    private constructor() {}

    public static getInstance(): Game {
        if (!Game.instance) Game.instance = new Game();
        return Game.instance;
    }

    public async init(containerId: string): Promise<void> {
        this.app = new Application();
        await this.app.init({
            backgroundColor: 0x1a1a1a,
            width: 1280,
            height: 720,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        const container = document.getElementById(containerId);
        container?.appendChild(this.app.canvas);
    }
}
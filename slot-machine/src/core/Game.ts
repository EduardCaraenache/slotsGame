import { Application } from 'pixi.js';

export class Game {
    private static instance: Game;
    public app: Application;

    private constructor() {
        this.app = new Application();
    }

    public static getInstance(): Game {
        if (!Game.instance) Game.instance = new Game();
        return Game.instance;
    }

    public async init(containerId: string): Promise<void> {
        await this.app.init({
            backgroundColor: 0x1a1a1a,
            width: 1280,
            height: 720,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        const container = document.getElementById(containerId);
        if (container) container.appendChild(this.app.canvas);
    }
}
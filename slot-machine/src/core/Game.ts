import {Application} from 'pixi.js';
import {SLOT_CONFIG} from "../config/Constants.ts";

export class Game {
    private static instance: Game;
    public app!: Application;

    private constructor() {
    }

    public static getInstance(): Game {
        if (!Game.instance) Game.instance = new Game();
        return Game.instance;
    }

    public async init(containerId: string): Promise<void> {
        this.app = new Application();
        await this.app.init({
            backgroundColor: SLOT_CONFIG.BACKGROUND_COLOR,
            width: 1280,
            height: 720,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        const container = document.getElementById(containerId);
        container?.appendChild(this.app.canvas);
    }
}
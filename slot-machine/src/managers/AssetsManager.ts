import { Assets, Texture } from 'pixi.js';
import { SLOT_CONFIG } from '../config/Constants';

export class AssetsManager {
    private static instance: AssetsManager;
    private textures: Map<string, Texture> = new Map();

    private constructor() {}

    public static getInstance(): AssetsManager {
        if (!AssetsManager.instance) AssetsManager.instance = new AssetsManager();
        return AssetsManager.instance;
    }

    public async loadAssets(): Promise<void> {
        for (const name of SLOT_CONFIG.ASSET_KEYS) {
            const texture = await Assets.load(`assets/${name}.png`);
            this.textures.set(name, texture);
        }
    }

    public getTextureById(id: number): Texture | undefined {
        const key = SLOT_CONFIG.ASSET_KEYS[id];
        return this.textures.get(key);
    }
}
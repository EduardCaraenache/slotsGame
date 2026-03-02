import { Assets, Texture } from 'pixi.js';

export class AssetsManager {
    private static instance: AssetsManager;
    private textures: Map<string, Texture> = new Map();

    private constructor() {}

    public static getInstance(): AssetsManager {
        if (!AssetsManager.instance) {
            AssetsManager.instance = new AssetsManager();
        }
        return AssetsManager.instance;
    }

    public async loadAssets(): Promise<void> {
        const manifest = {
            alhamlawi: 'assets/alhamlawi.jpg',
            baiaram: 'assets/baiaram.jpg',
            baluta: 'assets/baluta.png',
            bancu: 'assets/bancu.png',
            nsimba: 'assets/nsimba.jpg',
        };

        for (const [key, url] of Object.entries(manifest)) {
            const texture = await Assets.load(url);
            this.textures.set(key, texture);
        }
    }

    public getTexture(name: string): Texture | undefined {
        return this.textures.get(name);
    }
}
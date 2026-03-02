import { Container, Sprite } from 'pixi.js';
import { AssetsManager } from '../managers/AssetsManager';

export class SymbolView extends Container {
    public symbolId: number = 0;

    constructor(symbolId: number) {
        super();
        this.render(symbolId);
    }

    public render(id: number): void {
        this.symbolId = id;
        this.removeChildren();
        const names = [
            'alhamlawi',
            'baiaram',
            'baluta',
            'bancu',
            'nsimba'];
        const texture = AssetsManager.getInstance().getTexture(names[id]);

        if (texture) {
            const sprite = new Sprite(texture);
            sprite.anchor.set(0.5);

            sprite.x = 0;
            sprite.y = 80;

            const targetSize = 140;
            const scale = Math.min(targetSize / texture.width, targetSize / texture.height);
            sprite.scale.set(scale);

            this.addChild(sprite);
        }
    }
}
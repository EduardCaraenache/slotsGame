import {BlurFilter, Container, Sprite} from 'pixi.js';
import {AssetsManager} from '../managers/AssetsManager';
import {SLOT_CONFIG} from '../config/Constants';

export class SymbolView extends Container {
    public symbolId: number = 0;
    private sprite: Sprite | null = null;
    private blurFilter: BlurFilter = new BlurFilter();

    constructor(id: number) {
        super();
        this.blurFilter.strengthX = 0;
        this.blurFilter.strengthY = 0;
        this.filters = [this.blurFilter];
        this.render(id);
    }

    public setBlur(speed: number): void
    {
        this.blurFilter.strengthY = speed * 0.15;
    }

    public render(id: number): void {
        this.symbolId = id;
        this.removeChildren();

        const texture = AssetsManager.getInstance().getTextureById(id);
        if (texture) {
            this.sprite = new Sprite(texture);
            this.sprite.anchor.set(0.5);
            this.sprite.position.set(0, SLOT_CONFIG.SYMBOL_SIZE / 2);

            const scale = SLOT_CONFIG.SYMBOL_VISIBLE_SIZE / Math.max(texture.width, texture.height);
            this.sprite.scale.set(scale);
            this.addChild(this.sprite);
        }
    }
}
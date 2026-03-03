import {TextStyle} from 'pixi.js';
import {SLOT_CONFIG} from './GlobalConstants.ts';

export class StyleFactory {
    public static getBalanceStyle(): TextStyle {
        return new TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            fontWeight: 'bold',
            fill: SLOT_CONFIG.BALANCE_COLOR,
            stroke: {color: '#000000', width: 4},
            dropShadow: {color: '#000000', blur: 4, distance: 2}
        });
    }

    public static getButtonStyle(): TextStyle {
        return new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#1a1a1a',
            stroke: {color: '#000000', width: 2}
        });
    }

    public static getWinMessageStyle(): TextStyle {
        return new TextStyle({
            fontFamily: 'Georgia',
            fontSize: 90,
            fontWeight: '900',
            fill: SLOT_CONFIG.TEXT_GOLD,
            align: 'center',
            stroke: {color: '#4a3200', width: 8},
            dropShadow: {
                alpha: 0.8,
                blur: 20,
                color: '#000000',
                distance: 12,
            }
        });
    }
}
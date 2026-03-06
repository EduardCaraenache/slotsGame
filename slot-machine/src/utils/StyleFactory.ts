import {TextStyle} from 'pixi.js';
import {COMMON_CONSTANTS} from './GlobalConstants.ts';

export class StyleFactory {
    public static getBalanceStyle(): TextStyle {
        return new TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            fontWeight: 'bold',
            fill: COMMON_CONSTANTS.BALANCE_COLOR,
            stroke: {color: COMMON_CONSTANTS.BLACK_COLOR, width: 4},
            dropShadow: {color: COMMON_CONSTANTS.BLACK_COLOR, blur: 4, distance: 2}
        });
    }

    public static getButtonStyle(): TextStyle {
        return new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: COMMON_CONSTANTS.BACKGROUND_COLOR,
            stroke: {color: COMMON_CONSTANTS.BLACK_COLOR, width: 2}
        });
    }

    public static getWinMessageStyle(): TextStyle {
        return new TextStyle({
            fontFamily: 'Georgia',
            fontSize: 90,
            fontWeight: '900',
            fill: COMMON_CONSTANTS.TEXT_GOLD,
            align: 'center',
            stroke: {color: COMMON_CONSTANTS.WIN_MESSAGE_COLOR, width: 8},
            dropShadow: {
                alpha: 0.8,
                blur: 20,
                color: COMMON_CONSTANTS.BLACK_COLOR,
                distance: 12,
            }
        });
    }

    public static getInsufficientFunds(): TextStyle {
        return new TextStyle({
            fontFamily: 'Arial Black',
            fontSize: 42,
            fill: COMMON_CONSTANTS.INSUFFICIENT_FUNDS_COLOR,
            stroke: { color: COMMON_CONSTANTS.BLACK_COLOR, width: 6 },
            dropShadow: { color: COMMON_CONSTANTS.BLACK_COLOR, alpha: 0.5, blur: 6, distance: 6 }
        });
    }
}
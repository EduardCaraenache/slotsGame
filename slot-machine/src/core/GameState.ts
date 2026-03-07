export const GameState = {
    IDLE: 'IDLE',
    SPINNING: 'SPINNING',
    STOPPING: 'STOPPING',
    WIN_CELEBRATION: 'WIN_CELEBRATION'
} as const;

export type GameState = typeof GameState[keyof typeof GameState];
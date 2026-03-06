export const COMMON_CONSTANTS = {
    // Dimensiuni slot machine
    REEL_COUNT: 5,
    ROW_COUNT: 3,

    // Înălțimea totală alocată unui simbol (slot)
    SYMBOL_SIZE: 160,
    // Dimensiunea imaginii în interiorul slotului
    SYMBOL_VISIBLE_SIZE: 140,
    // Lățimea unei coloane
    REEL_WIDTH: 180,

    // Viteza de rotație (pixeli pe frame)
    SPIN_SPEED: 40,
    // Coeficient de stop (0.96 = oprire lină)
    FRICTION: 0.96,
    // Coeficient de oprire rapida (0.85 = franarea agresiva)
    QUICK_STOP_FRICTION: 0.85,
    // Efectul de bounce
    BOUNCE_STRENGTH: 0.5,
    // Pauza între oprirea coloanelor (efectul de cascadă)
    STOP_DELAY: 150,

    // Asset-urile (Asset IDs)
    ASSET_KEYS: ['alhamlawi', 'baiaram', 'baluta', 'bancu', 'cicaldau', 'isenko', 'nsimba', 'rus', 'screciu'],

    // Ajustare pentru centrarea simbolurilor (anchor 0.5)
    GAME_X_OFFSET: 90,
    // Coordonata Y de unde începe zona de joc
    GAME_Y_START: 100,

    // Colors
    BACKGROUND_COLOR: '#1A1A1A',
    FRAME_COLOR: '#000000',
    FRAME_BORDER_COLOR: '#FFA500',
    RED_COLOR: '#FF0000',
    WHITE_COLOR: '#FFFFFF',
    BLACK_COLOR: '#000000',
    SPIN_BUTTON_COLOR: '#FFAA00',
    BET_BUTTON_COLOR: '#00FF00',
    BALANCE_COLOR: '#00FF00',
    BUTTON_TEXT_COLOR: '#000000',
    TEXT_GOLD: '#FFCC00',
    INSUFFICIENT_FUNDS_COLOR: '#FF3333',
    WIN_MESSAGE_COLOR: '#4A3200',

    //Text constants
    BALANCE_TEXT: 'Balance',
    SPIN_TEXT: 'SPIN',
    BET_TEXT: 'BET',
    STOP_TEXT: 'STOP',
    INSUFFICIENT_FUNDS_TEXT: 'INSUFFICIENT FUNDS!',
    WIN_TEXT: 'WIN',

    BET_OPTIONS: [80, 100, 120, 160, 200],
    DEFAULT_BET_INDEX: 0,

    BUTTON_WIDTH: 200,
    BUTTON_HEIGHT: 70,
    BUTTON_SPACING: 40,
    Y_POSITION: 620
};

export const PAYLINES = [
    [1, 1, 1, 1, 1], // 1. Orizontală mijloc
    [0, 0, 0, 0, 0], // 2. Orizontală sus
    [2, 2, 2, 2, 2], // 3. Orizontală jos
    [0, 1, 2, 1, 0], // 4. V (sus-jos-sus)
    [2, 1, 0, 1, 2], // 5. V inversat (jos-sus-jos)
    [0, 0, 1, 2, 2], // 6. Scară în jos
    [2, 2, 1, 0, 0], // 7. Scară în sus
    [1, 0, 0, 0, 1], // 8. Trapez sus
    [1, 2, 2, 2, 1], // 9. Trapez jos
    [1, 0, 1, 2, 1], // 10. Zig-zag rar
    [1, 2, 1, 0, 1], // 11. Zig-zag rar inversat
    [0, 1, 0, 1, 0], // 12. Zig-zag des sus
    [2, 1, 2, 1, 2], // 13. Zig-zag des jos
    [0, 1, 1, 1, 0], // 14. Boltă sus
    [2, 1, 1, 1, 2], // 15. Boltă jos
    [0, 0, 2, 0, 0], // 16. Salt jos (coloana 3)
    [2, 2, 0, 2, 2], // 17. Salt sus (coloana 3)
    [1, 1, 0, 1, 1], // 18. Salt mic sus
    [1, 1, 2, 1, 1], // 19. Salt mic jos
    [0, 2, 0, 2, 0]  // 20. Zig-zag extrem
];
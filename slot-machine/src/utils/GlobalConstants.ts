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
    BACKGROUND_COLOR: '#1a1a1a',
    FRAME_COLOR: '#000000',
    FRAME_BORDER_COLOR: '#FFA500',
    RED_COLOR: '#FF0000',
    WHITE_COLOR: '#FFFFFF',
    BLACK_COLOR: '#000000',
    SPIN_BUTTON_COLOR: '#FFAA00',
    BET_BUTTON_COLOR: '#00FF00',
    BALANCE_COLOR: '#00FF00',
    BUTTON_TEXT_COLOR: '#000000',
    TEXT_GOLD: '#ffcc00',
    INSUFFICIENT_FUNDS_COLOR: '#FF3333',
    WIN_MESSAGE_COLOR: '#4A3200',

    //Styles
    BOLD_FONT: 'bold',

    //Text constants
    BALANCE_TEXT: 'Balance',
    SPIN_TEXT: 'SPIN',
    BET_TEXT: 'BET',
    STOP_TEXT: 'STOP',
    INSUFFICIENT_FUNDS_TEXT: 'INSUFFICIENT FUNDS!',
    WIN_TEXT: 'WIN TEXT',

    BET_OPTIONS: [80, 100, 120, 160, 200],
    DEFAULT_BET_INDEX: 0,

    BUTTON_WIDTH: 200,
    BUTTON_HEIGHT: 70,
    BUTTON_SPACING: 40,
    Y_POSITION: 620
};
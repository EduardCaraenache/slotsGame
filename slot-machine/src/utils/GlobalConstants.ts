export const SLOT_CONFIG = {
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
    FRAME_COLOR: 'black',
    FRAME_BORDER_COLOR: 'orange',
    RED_COLOR: '#FF0000',
    WHITE_COLOR: '#FFFFFF',
    BLACK_COLOR: '#000000',
    SPIN_BUTTON_COLOR: 'orange',
    BET_BUTTON_COLOR: 'green',
    BALANCE_COLOR: 'green',
    BUTTON_TEXT_COLOR: 'black',
    TEXT_GOLD: '#ffcc00',

    //Styles
    BOLD_FONT: 'bold',

    //Text constants
    BALANCE_STRING: 'Balance',
    SPIN_STRING: 'SPIN',
    BET_STRING: 'BET',
    STOP_STRING: 'STOP',

    BET_OPTIONS: [80, 100, 120, 160, 200],
    DEFAULT_BET_INDEX: 0,

    BUTTON_WIDTH: 200,
    BUTTON_HEIGHT: 70,
    BUTTON_SPACING: 40,
    Y_POSITION: 620
};
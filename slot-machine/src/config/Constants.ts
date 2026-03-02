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
    // Coeficient de stop (0.94 = oprire lină)
    FRICTION: 0.94,
    // Pauza între oprirea coloanelor (efectul de cascadă)
    STOP_DELAY: 150,

    // Asset-urile (Asset IDs)
    ASSET_KEYS: ['alhamlawi', 'baiaram', 'baluta', 'bancu', 'nsimba'],

    // Ajustare pentru centrarea simbolurilor (anchor 0.5)
    GAME_X_OFFSET: 90,
    // Coordonata Y de unde începe zona de joc
    GAME_Y_START: 100,

    // Culori și Stiluri
    FRAME_COLOR: 0x111111,
    FRAME_BORDER_COLOR: 0x444444,
    BUTTON_COLOR: 'gold'
};
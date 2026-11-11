export const DEPARTMENT_CONFIG: Record<Department, DepartmentConfig> = {
    "FAST": { targetRate: 80, summaryPreventNums: true },
    "CRET": { targetRate: 47, summaryPreventNums: true },
    "UG":   { targetRate: 47, doubleCountMode: true, summaryPreventNums: true},
    "REFURB": { targetRate: 30, clickCount: true},
    "WHD": { targetRate: 25, clickCount: true, summaryPreventNums: true},
    "PS" : { targetRate: 22.5, clickCount: true },
    "PS(CD)" : { targetRate: 27, clickCount: true },
    "CD" : { targetRate: 114 }
};
// Local Storage 
export const STORAGE_KEY_DEP = 'sh_hub_dep';
export const STORAGE_KEY_COUNT = 'sh_item_counter_count';
export const STORAGE_KEY_COUNTER = 'sh_item_counter_settings';
export const STORAGE_KEY_TASK = 'sh_off_task_settings';
export const STORAGE_KEY_BINDS = 'sh_binds_config';
export const STORAGE_KEY_STATION = 'sh_work_station';
export const STORAGE_KEY_DBL_COUNT_ID = 'sh_double_count_pid';
export const STORAGE_KEY_DEBUG = 'sh_debug_config';
export const STORAGE_KEY_COUNT_MID_STATE = {
    mId: "sh_count_mid",
    state: "sh_count_state"
};  

export const STORAGE_SAVED = {
    previous: {
        lpn: "sh_previous_lpn",
        asin: "sh_previous_asin"
    },
    current: {
        lpn: "sh_current_lpn",
        asin: "sh_current_asin"
    } 
};

export const READY_STATE = {
    NOT_STARTED: "NOT_STARTED",
    IN_PROGRESS: "IN_PROGRESS",
    NOT_FOUND: "NOT_FOUND"
};

// BUTTON LABEL
export const CLR_BTN_LBL: string[] = ["Usuń sesję"];

// INPUT LABEL
export const LPN_INPT_LBL: string[] = ["Wprowadź LPN"];
export const WS_INPT_LBL: string[] = ["Wprowadź stację roboczą"];
export const PKG_INPT_LBL: string[] = ["Wprowadź numer rma"];
export const WD_ITM_SCN_INPT_LBL: string[] = ["Wprowadź lpn lub sku"];
export const TOTE_INPT_LBL: string[] = [
    'Wprowadź pojemnik',
    'Вкажіть транспортну тару',
    'Введите тару'
];
export const LPN_OLD_LPN_INPT_LBL: string[] = ["Введіть старий LPN", "Wprowadź stary LPN"];
export const ITM_SCN_INPT_LBL: string[] = ["Wprowadź kod kreskowy lub SKU"];

// INPUT TESTID
export const LPN_INPT_TSTID: string = "lpn-input-label";
export const WS_INPT_TSTID: string = "ws-input";
export const PKG_INPT_TSTID: string = "package-input";
export const WD_ITM_SCN_INPT_TSTID: string = "wd-item-scan-label";
export const TOTE_INPT_TSTID : string = "tote-input-label";
export const ITM_SCN_INPT_TSTID: string = "item-scan-input";
export const LPN_OLD_LPN_INPT_TSTID : string = "scan-old-lpn-input";

// BUTTON SPAN
export const CNT_BTN_SPN: string[] = ["Kontynuuj"];
export const LPN_RSGN_BTN_SPN: string[] = [
    'Перепризначте lpn', 
    'Przypisz ponownie lpn',
    'Назначить новый номер lp'
];
export const LPN_ASGN_NEW_BTN_SPN: string[] = ["Призначити новий LPN", "Przypisz nowy LPN"];    
export const CHS_ITM_LST_BTN_SPN: string[] = ["Brak dostępnych kodów kreskowych"]

// BUTTON TESTID
export const CNT_BTN_TSTID: string = "button-clear-session-continue-socrates";
export const LPN_RSGN_BTN_TSTID: string = "button-reassign-lpn-id";
export const CHS_ITM_LST_BTN_TSTID: string = "button-choose-item-from-the-list-socrates";
export const CLR_BTN_TSTID: string = "clear-session-icon";
export const LPN_ASGN_NEW_BTN_TSTID: string = "button-assign-new-lpn-link-socrates";
export const ITM_CMT_SCRTS_TSTID: string = "button-item-commit-complete-button-text-socrates";
export const CNFRM_SMR_TSTID: string = "button-complete-summary";

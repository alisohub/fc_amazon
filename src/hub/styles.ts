export const HUB_STYLES: string = `
    #sh-root { font-family: 'Roboto', -apple-system, sans-serif; z-index: 999999; }
    #sh-panel { position: fixed; top: 0; right: -340px; width: 320px; height: 100vh; z-index: 999998; background: #fafafa; box-shadow: -4px 0 24px rgba(0,0,0,0.12); transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; }
    #sh-panel.sh-open { right: 0; }
    .sh-header { background: #ffffff; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e0e0; }
    .sh-header-group { display: flex; gap: 8px; align-items: center; }
    .sh-dep-dropdown, .sh-url-btn { background: #f1f3f4; border: 1px solid transparent; border-radius: 6px; padding: 4px 8px; font-size: 12px; color: #444746; font-weight: 600; cursor: pointer; outline: none; transition: background 0.2s, border 0.2s, color 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; height: 24px; box-sizing: border-box; }
    .sh-dep-dropdown:hover, .sh-url-btn:hover { background: #e8eaed; color: #202124; text-decoration: none; }
    .sh-dep-dropdown:focus, .sh-url-btn:focus { border-color: #1a73e8; background: #ffffff; }
    .sh-close { background: none; border: none; color: #5f6368; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; padding: 0; line-height: 1; }
    .sh-close:hover { background: rgba(0,0,0,0.05); color: #202124; }
    .sh-body { padding: 16px; overflow-y: auto; flex: 1; }
    .sh-card { background: #ffffff; border: 1px solid #dadce0; border-radius: 10px; padding: 14px; margin-bottom: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
    .sh-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .sh-card-info { flex: 1; padding-right: 12px; }
    .sh-card-title { font-weight: 500; font-size: 14px; color: #202124; margin-bottom: 4px; }
    .sh-card-desc { font-size: 12px; color: #5f6368; line-height: 1.3; }
    .sh-card-settings { display: none; margin-top: 10px; }
    .sh-settings-divider { height: 1px; background: #f1f3f4; margin: 10px 0; }
    .sh-setting-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .sh-emoji { font-size: 16px; line-height: 1; opacity: 0.8; }
    .sh-adv-text { font-size: 11px; color: #9aa0a6; cursor: pointer; user-select: none; transition: color 0.2s; }
    .sh-adv-text:hover { color: #5f6368; }
    .sh-opt-group { display: flex; gap: 4px; flex: 1; }
    .sh-opt-btn { background: #ffffff; border: 1px solid #dadce0; border-radius: 6px; color: #5f6368; font-size: 12px; font-weight: 600; padding: 4px 0; flex: 1; text-align: center; cursor: pointer; transition: all 0.2s; }
    .sh-opt-btn:hover:not(.active) { background: #f1f3f4; }
    .sh-opt-btn.active { background: #1a73e8; border-color: #1a73e8; color: #ffffff; }
    
    .sh-time-btn { background: #ffffff; border: 1px solid #dadce0; border-radius: 6px; color: #5f6368; font-size: 11px; font-weight: 600; padding: 4px 8px; cursor: pointer; transition: all 0.2s; }
    .sh-time-btn:hover { background: #f1f3f4; color: #202124; }

    .sh-input { padding: 6px 10px; font-size: 13px; border: 1px solid #dadce0; border-radius: 6px; box-sizing: border-box; outline: none; transition: border 0.2s; }
    .sh-input:focus { border-color: #1a73e8; }
    .sh-input-small { width: 35%; flex: 0 0 35%; }
    
    /* HIDE ARROWS FOR NUMBER INPUTS */
    .sh-input[type=number]::-webkit-inner-spin-button, 
    .sh-input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }
    .sh-input[type=number] { 
        -moz-appearance: textfield; 
    }

    .sh-range { flex: 1; accent-color: #1a73e8; cursor: pointer; }
    .sh-switch { position: relative; width: 34px; height: 20px; flex-shrink: 0; margin-top: 2px;}
    .sh-switch input { opacity: 0; width: 0; height: 0; }
    .sh-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #dadce0; transition: .3s; border-radius: 20px; }
    .sh-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,0.2); }
    input:checked + .sh-slider { background-color: #1a73e8; }
    input:checked + .sh-slider:before { transform: translateX(14px); }

    /* Shared Advanced Container Logic & Utility Classes */
    .sh-adv-container { display: none; padding-top: 8px; margin-top: 8px; border-top: 1px dashed #e0e0e0; }
    .sh-adv-container.sh-expanded { display: block; }
    .sh-adv-toggle-wrap { display: flex; justify-content: flex-end; margin-top: 6px; }
    .sh-flex-1 { flex: 1; }
    .sh-mt-8 { margin-top: 8px; }
    .sh-space-between { justify-content: space-between; }
    .sh-flex-center-gap { display: flex; align-items: center; gap: 8px; }
    .sh-flex-gap { display: flex; gap: 6px; }
    .sh-time-input-small { width: 55px; text-align: center; padding: 6px 4px; }
    
    /* Auto Questionnaire Styles (Flex Rows for crisp separation) */
    .sh-bind-list { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
    .sh-bind-row { display: flex; align-items: stretch; background: #f8f9fa; border: 1px solid #e8eaed; border-radius: 6px; overflow: hidden; }
    .sh-bind-key { background: #e8f0fe; color: #1a73e8; font-weight: 600; font-size: 12px; padding: 6px 10px; display: flex; align-items: center; justify-content: center; min-width: 32px; border-right: 1px solid #e8eaed; }
    .sh-bind-action { padding: 6px 10px; font-size: 11px; color: #5f6368; line-height: 1.4; display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
    .sh-arrow { color: #bdc1c6; font-size: 10px; }

    .sh-bind-input { 
        background: #ffffff !important; 
        border: 2px solid #9aa0a6 !important; /* Tight grey border from your drawing */
        border-radius: 3px !important; 
        padding: 2px 4px !important; 
        margin: 0 !important;
        font-size: 11px !important; 
        color: #5f6368 !important; 
        outline: none !important; 
        text-align: center !important; 
        font-family: inherit !important;
        
        /* THE FIX: Force it to act like text and ignore Amazon's 100% width */
        display: inline-block !important; 
        width: auto !important; 
        flex: 0 1 auto !important; 
    }
    .sh-bind-input:focus { 
        border-color: #1a73e8 !important; 
    }
    .sh-bind-input::placeholder { color: #bdc1c6 !important; }
    
    .sh-bind-key-edit { cursor: pointer; transition: background 0.2s, color 0.2s; }
    .sh-bind-key-edit:hover { background: #d2e3fc; color: #174ea6; }
`;

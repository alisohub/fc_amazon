"use strict";(()=>{var $=`
    #sh-root { font-family: 'Roboto', -apple-system, sans-serif; z-index: 999999; }
    #sh-panel { position: fixed; top: 0; right: -340px; width: 320px; height: 100vh; z-index: 999998; background: #fafafa; box-shadow: -4px 0 24px rgba(0,0,0,0.12); transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; display: flex; flex-direction: column; }
    #sh-panel.sh-open { right: 0; }
    .sh-header { background: #ffffff; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e0e0e0; }
    .sh-header-group { display: flex; gap: 8px; align-items: center; }
    .sh-dep-dropdown, .sh-url-btn { background: #f1f3f4; border: 1px solid transparent; border-radius: 6px; padding: 4px 8px; font-size: 12px; color: #444746; font-weight: 600; cursor: pointer; outline: none; transition: background 0.2s, border 0.2s, color 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; height: 24px; box-sizing: border-box; }
    .sh-dep-dropdown:hover, .sh-url-btn:hover { background: #e8eaed; color: #202124; text-decoration: none; }
    .sh-dep-dropdown:focus, .sh-url-btn:focus { border-color: #1a73e8; background: #ffffff; }
    
    /* Settings button replacing the close button */
    .sh-settings-btn { background: none; border: none; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; padding: 0; line-height: 1; transition: background 0.2s, transform 0.2s; }
    .sh-settings-btn:hover { background: rgba(0,0,0,0.05); }
    .sh-settings-btn.active { background: #e8f0fe; transform: rotate(45deg); }

    /* Global panel settings box */
    .sh-global-settings { display: none; background: #f1f3f4; padding: 12px 16px; border-bottom: 1px solid #e0e0e0; }
    .sh-global-settings.sh-expanded { display: block; }
    .sh-global-settings-title { font-size: 12px; font-weight: 600; color: #3c4043; margin-bottom: 8px; }

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
    
    /* Binds List and Inputs */
    .sh-bind-list { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
    .sh-bind-row { display: flex; align-items: stretch; background: #f8f9fa; border: 1px solid #e8eaed; border-radius: 6px; overflow: hidden; }
    .sh-bind-key { background: #e8f0fe; color: #1a73e8; font-weight: 600; font-size: 12px; padding: 6px 10px; display: flex; align-items: center; justify-content: center; min-width: 32px; border-right: 1px solid #e8eaed; }
    .sh-bind-action { padding: 6px 10px; font-size: 11px; color: #5f6368; line-height: 1.4; display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
    .sh-arrow { color: #bdc1c6; font-size: 10px; }
    .sh-bind-input { 
        background: #ffffff !important; 
        border: 2px solid #9aa0a6 !important;
        border-radius: 3px !important; 
        padding: 2px 4px !important; 
        margin: 0 !important;
        font-size: 11px !important; 
        color: #5f6368 !important; 
        outline: none !important; 
        text-align: center !important; 
        font-family: inherit !important;
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
`;if(window.__scriptHubLoaded){let E=document.getElementById("sh-panel");E&&(E.classList.contains("sh-open")?(E.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(k=>k.classList.remove("sh-expanded"))):E.classList.add("sh-open"))}else{let M=function(i){return i==="CRET"||i==="FAST"||i==="UG"||i==="REFURB"},R=function(){let i="sh_panel_opacity",n=.4;try{let e=localStorage.getItem(i);if(e!==null){let a=parseFloat(e);!isNaN(a)&&a>=.1&&a<=1&&(n=a)}}catch{}let o=document.createElement("div");o.id="sh-root",o.innerHTML=`
            <style>
                ${$}
            </style>
            
            <div id="sh-panel" style="opacity: ${n};">
                <div class="sh-header">
                    <div class="sh-header-group">
                        <select id="sh-subdep-select" class="sh-dep-dropdown">
                            ${S.map(e=>`<option value="${e}" ${w===e?"selected":""}>${e}</option>`).join(`
                            `)}
                        </select>
                        <label class="sh-switch" title="Toggle all scripts" style="margin: 0;">
                            <input type="checkbox" id="sh-chk-all">
                            <span class="sh-slider"></span>
                        </label>
                        <a href="https://eu-cretfc-tools-dub.dub.proxy.amazon.com/gravis" target="_blank" rel="noopener noreferrer" class="sh-url-btn">GRAVIS</a>
                        <a href="https://w.amazon.com/bin/view/Wikipedia_LCJ4/" target="_blank" rel="noopener noreferrer" class="sh-url-btn">WIKI</a>
                    </div>
                    <button class="sh-settings-btn" id="sh-settings-toggle-btn" title="\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F">\u2699\uFE0F</button>
                </div>
                <div class="sh-global-settings" id="sh-global-settings">
                    <div class="sh-global-settings-title">\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043F\u0430\u043D\u0435\u043B\u0456</div>
                    <div class="sh-setting-row" title="\u041F\u0440\u043E\u0437\u043E\u0440\u0456\u0441\u0442\u044C \u043F\u0430\u043D\u0435\u043B\u0456">
                        <span class="sh-emoji">\u{1F441}\uFE0F</span>
                        <input type="range" id="sh-panel-opacity" class="sh-range" min="0.1" max="1" step="0.05" value="${n}" />
                    </div>
                </div>
                <div class="sh-body" id="sh-list"></div>
            </div>
        `,document.body.appendChild(o);let r=document.getElementById("sh-panel"),g=document.getElementById("sh-settings-toggle-btn"),f=document.getElementById("sh-global-settings"),m=document.getElementById("sh-panel-opacity");g&&f&&g.addEventListener("click",()=>{g.classList.toggle("active"),f.classList.toggle("sh-expanded")}),m&&m.addEventListener("input",e=>{let a=e.target,s=parseFloat(a.value);r.style.opacity=s.toString();try{localStorage.setItem(i,s.toString())}catch{}});function b(){r.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(e=>e.classList.remove("sh-expanded")),f&&f.classList.remove("sh-expanded"),g&&g.classList.remove("active"),window.dispatchEvent(new CustomEvent("sh-panel-closed"))}document.addEventListener("mousedown",e=>{let a=e.target;r.classList.contains("sh-open")&&!r.contains(a)&&b()});let h=document.getElementById("sh-subdep-select");h&&h.addEventListener("change",e=>{let a=e.target;if(M(a.value)){if(w=a.value,localStorage.setItem("sh_hub_dep",w),window.__itemCounter){let s=T[w];if(s){window.__itemCounter.updateSettings({targetRate:s.targetRate});let t=document.getElementById("sh-cfg-target");t&&(t.value=s.targetRate.toString())}}y.forEach(s=>{let t=document.getElementById(`sh-card-${s.id}`);if(t)if(s.excludeDeps?.includes(w)){t.style.display="none";let l=s.getHandler(),d=document.getElementById(`sh-chk-${s.id}`);l&&l.isActive()&&(l.disable(),d&&(d.checked=!1))}else t.style.display="block"})}});let y=_.filter(e=>!e.experimental||E==="development"||E==="ts-all-the-way"),v=()=>{let e=document.getElementById("sh-chk-all");if(!e)return;let s=y.filter(t=>!t.experimental).map(t=>document.getElementById(`sh-chk-${t.id}`));e.checked=s.length>0&&s.every(t=>t&&t.checked)},c=document.getElementById("sh-list");c&&y.forEach(e=>{let a=e.getHandler(),s=a?a.isActive():!1,t=document.createElement("div");t.id=`sh-card-${e.id}`,t.className="sh-card",e.excludeDeps?.includes(w)&&(t.style.display="none"),t.innerHTML=`
                    <div class="sh-card-top">
                        <div class="sh-card-info">
                            <div class="sh-card-title">${e.name}</div>
                            <div class="sh-card-desc">${e.description}</div>
                        </div>
                        <label class="sh-switch">
                            <input type="checkbox" id="sh-chk-${e.id}" ${s?"checked":""}>
                            <span class="sh-slider"></span>
                        </label>
                    </div>
                    <div class="sh-card-settings" id="sh-settings-${e.id}"></div>
                `,c.appendChild(t);let l=t.querySelector(`#sh-chk-${e.id}`),d=t.querySelector(`#sh-settings-${e.id}`);s&&e.renderSettings&&(d.style.display="block",e.renderSettings(d)),l&&(l.onchange=async()=>{await H(e,l,d),v()})});let p=document.getElementById("sh-chk-all");p&&p.addEventListener("change",async e=>{let s=e.target.checked,t=[];y.forEach(l=>{if(l.experimental)return;let d=document.getElementById(`sh-chk-${l.id}`),u=document.getElementById(`sh-settings-${l.id}`);d&&d.checked!==s&&!d.disabled&&(d.checked=s,t.push(H(l,d,u)))}),await Promise.all(t),v()}),v(),setTimeout(()=>{r.classList.add("sh-open")},100)};B=M,C=R,window.__scriptHubLoaded=!0;let E=window.__SH_BRANCH||"main",k=E==="local"?"http://localhost:3000/dist":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${E}/dist`,T={CRET:{targetRate:47},FAST:{targetRate:100},UG:{targetRate:47},REFURB:{targetRate:30}},I=new URLSearchParams(window.location.search).get("gradingMode"),S=[];I==="CRETURN_PRIMARY_GRADING"?S=["UG"]:I==="CRETURN"?S=["CRET","FAST"]:I==="CRETURN_REFURB"?S=["REFURB"]:S=["CRET","FAST","UG","REFURB"];let L=localStorage.getItem("sh_hub_dep"),w=M(L)&&S.includes(L)?L:S[0];if(L!==w)try{localStorage.setItem("sh_hub_dep",w)}catch{}let _=[{id:"auto-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn.js",description:'\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 "\u043F\u0435\u0440\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 LPN" \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456 LPN \u0430\u0431\u043E \u0431\u0443\u0434\u044C-\u0447\u043E\u0433\u043E \u0456\u043D\u0448\u043E\u0433\u043E, \u043E\u043A\u0440\u0456\u043C \u0442\u043E\u0442\u0430',excludeDeps:["REFURB"],getHandler:()=>window.__autoLpn},{id:"item-counter",name:"\u0420\u0430\u0445\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u043A",file:"counter.js",description:"\u0420\u0430\u0445\u0443\u0454 \u043F\u0430\u0447\u043A\u0438, \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0445\u043E\u0432\u0430\u0442\u0438 \u0437 \u0435\u043A\u0440\u0430\u043D\u0443 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E F10. \u0412\u0438\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u0435\u0440\u0435\u0440\u0432\u0443.",getHandler:()=>window.__itemCounter,renderSettings:i=>{let n=window.__itemCounter;if(!n)return;let o=n.getSettings(),r=n.getCount(),g=document.getElementById("sh-subdep-select").value,f=T[g]?T[g].targetRate:47,m=o.targetRate!==void 0?o.targetRate:f;n.updateSettings({targetRate:m}),i.innerHTML=`
                    <div class="sh-settings-divider"></div>
                    <div class="sh-setting-row" title="Options & Manual Edit">
                        <span class="sh-emoji">\u{1F374}</span>
                        <div class="sh-opt-group">
                            <div class="sh-opt-btn ${o.lunchBreak===1?"active":""}" data-val="1">1</div>
                            <div class="sh-opt-btn ${o.lunchBreak===2?"active":""}" data-val="2">2</div>
                            <div class="sh-opt-btn ${o.lunchBreak===3?"active":""}" data-val="3">3</div>
                            <div class="sh-opt-btn ${o.lunchBreak===4?"active":""}" data-val="4">4</div>
                        </div>
                        <span class="sh-emoji">\u270F\uFE0F</span>
                        <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${r===0?"":r}" placeholder="666" />
                    </div>
                    <div class="sh-setting-row" title="Overlay Opacity">
                        <span class="sh-emoji">\u{1F47B}</span>
                        <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${o.overlayOpacity}" />
                    </div>
                    
                    <div id="sh-adv-container-item-counter" class="sh-adv-container">
                        <div class="sh-setting-row" title="Target Rate">
                            <span class="sh-emoji">\u{1F3AF}</span>
                            <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${m}" placeholder="\u041D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u0430 \u043D\u043E\u0440\u043C\u0430" />
                        </div>
                        
                        <div class="sh-setting-row sh-mt-8 sh-space-between" title="\u0412\u043B\u0430\u0441\u043D\u0438\u0439 \u0447\u0430\u0441 \u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0437\u043C\u0456\u043D\u0438">
                            <div class="sh-flex-center-gap">
                                <span class="sh-emoji">\u23F1\uFE0F</span>
                                <input type="text" id="sh-cfg-start-time" class="sh-input sh-time-input-small" value="${o.customStartTime||""}" placeholder="14:30" maxlength="5" />
                            </div>
                            <div class="sh-flex-gap">
                                <button id="sh-btn-start-now" class="sh-time-btn">\u0417\u0430\u0440\u0430\u0437</button>
                                <button id="sh-btn-start-reset" class="sh-time-btn">\u0421\u043A\u0438\u043D\u0443\u0442\u0438</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sh-adv-toggle-wrap">
                        <span id="sh-adv-btn-item-counter" class="sh-adv-text">\u0420\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456</span>
                    </div>
                `,i.querySelectorAll(".sh-opt-btn").forEach(s=>{s.addEventListener("click",t=>{let l=t.target;i.querySelectorAll(".sh-opt-btn").forEach(u=>u.classList.remove("active")),l.classList.add("active");let d=parseInt(l.getAttribute("data-val")||"1",10);n.updateSettings({lunchBreak:d})})});let b=i.querySelector("#sh-cfg-count");b&&b.addEventListener("input",s=>{let t=s.target,l=parseInt(t.value,10);isNaN(l)&&(l=0),l<0&&(l=0,t.value="0"),n.setCount(l)});let h=i.querySelector("#sh-cfg-opacity");h&&h.addEventListener("input",s=>{let t=s.target,l=parseFloat(t.value);n.updateSettings({overlayOpacity:l})});let y=i.querySelector("#sh-cfg-target");y&&y.addEventListener("input",s=>{let t=s.target,l=parseFloat(t.value);(isNaN(l)||l<0)&&(l=0),n.updateSettings({targetRate:l})});let v=i.querySelector("#sh-cfg-start-time"),c=i.querySelector("#sh-btn-start-now"),p=i.querySelector("#sh-btn-start-reset");v&&c&&p&&(v.addEventListener("input",s=>{let t=s.target,l=s,d=t.value.replace(/\D/g,"").split(""),u="";if(d.length>0){let x=d.shift();x>="3"?u+="0"+x:u+=x}if(d.length>0&&u.length===1){let x=d.shift();u[0]==="2"&&x>="4"?(u="0"+u[0],d.unshift(x)):u+=x}if(u.length===2&&(d.length>0||l.inputType!=="deleteContentBackward"||t.value.endsWith(":"))&&(u+=":"),d.length>0){let x=d.shift();x>="6"?u+="0"+x:u+=x}if(d.length>0&&u.length===4){let x=d.shift();u+=x}t.value=u,u.length===5&&u.match(/^\d{2}:\d{2}$/)?n.updateSettings({customStartTime:u}):u===""&&n.updateSettings({customStartTime:null})}),c.addEventListener("click",()=>{let s=new Date,t=String(s.getHours()).padStart(2,"0"),l=String(s.getMinutes()).padStart(2,"0"),d=`${t}:${l}`;v.value=d,n.updateSettings({customStartTime:d})}),p.addEventListener("click",()=>{v.value="",n.updateSettings({customStartTime:null})}));let e=i.querySelector("#sh-adv-btn-item-counter"),a=i.querySelector("#sh-adv-container-item-counter");e&&a&&e.addEventListener("click",()=>{a.classList.toggle("sh-expanded")})}},{id:"off-task",name:"\u0410\u0432\u0442\u043E-\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044F (Off-Task)",file:"off_task.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u0438\u0431\u0438\u0432\u0430\u0454 \u0434\u043E \u0442\u043E\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441.",getHandler:()=>window.__offTask,renderSettings:i=>{let n=window.__offTask;if(!n)return;let o=document.getElementById("sh-subdep-select").value,r=o==="CRET"||o==="UG"?4:10,g=n.getSettings(),f=g.timeoutMins!==void 0?g.timeoutMins:r,m=g.toteBarcode||"";i.innerHTML=`
                    <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                        <span class="sh-emoji" title="\u0422\u0430\u0440\u0430">\u{1F4E6}</span>
                        <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${m}" placeholder="ts... (\u043F\u0443\u0441\u0442\u043E=\u0432\u0438\u043C\u043A)" autocomplete="off">
                        <span class="sh-emoji" title="\u0425\u0432\u0438\u043B\u0438\u043D\u0438">\u23F1\uFE0F</span>
                        <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${f}" title="\u0422\u0430\u0439\u043C\u0435\u0440">
                    </div>
                `;let b=i.querySelector("#sh-ot-tote"),h=i.querySelector("#sh-ot-mins");b.addEventListener("input",c=>{let p=c.target.value.trim();n.updateSettings({toteBarcode:p}),p||(h.value=n.getSettings().timeoutMins?.toString()||r.toString())}),h.addEventListener("change",c=>{let p=c.target.value.trim(),e=r;if(p.includes(":")){let a=p.split(":");e=parseInt(a[0]||"0",10)+parseInt(a[1]||"0",10)/60}else{let a=parseFloat(p);!isNaN(a)&&a>0&&(e=a)}n.updateSettings({timeoutMins:e})}),h.addEventListener("keydown",c=>{c.key==="Enter"&&h.blur()});let y=c=>{document.activeElement!==b&&(b.value=n.getSettings().toteBarcode||""),document.activeElement!==h&&(h.value=n.getSettings().timeoutMins?.toString()||r.toString(),h.style.color="")},v=c=>{if(document.activeElement===h||!n.getSettings().toteBarcode)return;let p=Math.ceil(c.detail.remainingMs/1e3),e=Math.floor(p/60),a=String(p%60).padStart(2,"0");h.value=`${e}:${a}`,h.style.color=p<=30?"#d93025":"#1a73e8",h.style.fontWeight="bold"};window.addEventListener("sh-offtask-update",y),window.addEventListener("sh-offtask-tick",v)}},{id:"binds",name:"\u0411\u0456\u043D\u0434\u0438",file:"binds.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u043E\u043A\u043B\u0456\u043A\u0443\u0454 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456.<br>\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435, \u0449\u043E\u0431 \u043F\u043E\u0431\u0430\u0447\u0438\u0442\u0438 \u0432\u0441\u0456 \u043A\u043E\u043C\u0430\u043D\u0434\u0438",excludeDeps:["REFURB"],getHandler:()=>window.__binds,renderSettings:i=>{let n=window.__binds;if(!n)return;let o=!1,r=JSON.parse(JSON.stringify(n.getShortcuts?n.getShortcuts():{})),g=n.getDictionary?n.getDictionary():[];window.addEventListener("sh-panel-closed",()=>{o&&(o=!1,f())});let f=()=>{let m=Object.keys(r),b="";m.length>0?b=m.map(c=>{if(o){let p=[...r[c],""],e=p.map((a,s)=>`
                                    <input type="text" class="sh-bind-input" value="${a}" data-key="${c}" data-idx="${s}" list="sh-binds-dict" size="${a.length>0?a.length+1:8}" placeholder="${s===p.length-1?"+ \u0434\u043E\u0434\u0430\u0442\u0438":""}">
                                `).join(' <span class="sh-arrow">\u2794</span> ');return`
                                    <div class="sh-bind-row">
                                        <div class="sh-bind-key sh-bind-key-edit" data-key="${c}" title="\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0432\u0441\u0456 \u043A\u043E\u043C\u0430\u043D\u0434\u0438 (Clear)">${c}</div>
                                        <div class="sh-bind-action">${e}</div>
                                    </div>
                                `}else{let p=r[c];return`
                                    <div class="sh-bind-row">
                                        <div class="sh-bind-key">${c}</div>
                                        <div class="sh-bind-action">${p.join(' <span class="sh-arrow">\u2794</span> ')}</div>
                                    </div>
                                `}}).join(""):b='<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">\u041D\u0430\u0440\u0430\u0437\u0456 \u043D\u0435\u043C\u0430\u0454 \u0436\u043E\u0434\u043D\u043E\u0433\u043E \u0431\u0456\u043D\u0434\u0430.</div>';let h=g.map(c=>`<option value="${c}">`).join("");i.innerHTML=`
                        <datalist id="sh-binds-dict">
                            ${h}
                        </datalist>
                        <div id="sh-adv-container-binds" class="sh-adv-container ${i.querySelector("#sh-adv-container-binds")?.classList.contains("sh-expanded")?"sh-expanded":""}">
                            <div class="sh-bind-list" style="cursor: ${o?"default":"pointer"};" title="${o?"":"\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u0434\u043B\u044F \u0440\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u043D\u043D\u044F"}">
                                ${b}
                            </div>
                        </div>
                        
                        <div class="sh-adv-toggle-wrap">
                            <span id="sh-adv-btn-binds" class="sh-adv-text" style="margin-left: auto;">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</span>
                        </div>
                    `;let y=i.querySelector("#sh-adv-btn-binds"),v=i.querySelector("#sh-adv-container-binds");y&&v&&y.addEventListener("click",()=>{v.classList.toggle("sh-expanded"),o=!1,f()}),v&&v.addEventListener("click",()=>{o||(o=!0,r=JSON.parse(JSON.stringify(n.getShortcuts())),f())}),i.querySelectorAll(".sh-bind-key-edit").forEach(c=>{c.addEventListener("click",p=>{if(!o)return;let a=p.target.getAttribute("data-key");a&&(r[a]=[],n.updateShortcuts(r),f())})}),i.querySelectorAll(".sh-bind-input").forEach(c=>{c.addEventListener("change",p=>{if(!o)return;let e=p.target,a=e.getAttribute("data-key"),s=parseInt(e.getAttribute("data-idx"),10),t=e.value.trim();s===r[a].length?t&&r[a].push(t):t?r[a][s]=t:r[a].splice(s,1),n.updateShortcuts(r),f()})})};f()}},{id:"dev-inspector",name:"Dev Inspector",file:"dev_inspector.js",description:"\u041A\u043B\u0456\u043A\u043D\u0456\u0442\u044C \u043D\u0430 \u0431\u0443\u0434\u044C-\u044F\u043A\u0438\u0439 \u0435\u043B\u0435\u043C\u0435\u043D\u0442, \u0449\u043E\u0431 \u043F\u043E\u0431\u0430\u0447\u0438\u0442\u0438 \u0439\u043E\u0433\u043E HTML (\u0422\u0456\u043B\u044C\u043A\u0438 \u0434\u043B\u044F \u0440\u043E\u0437\u0440\u043E\u0431\u043A\u0438).",getHandler:()=>window.__devInspector,experimental:!0}];async function H(i,n,o){let r=n.checked,g=i.getHandler();if(r&&!g){n.disabled=!0;let f=`${k}/${i.file}?cb=${Date.now()}`;try{let m=await fetch(f);if(!m.ok)throw new Error(`HTTP ${m.status}`);let b=await m.text(),h=document.createElement("script");h.textContent=b,document.head.appendChild(h),g=i.getHandler(),n.disabled=!1}catch(m){alert(`\u26A0\uFE0F Failed to load ${i.name}:
${m.message}`),n.checked=!1,n.disabled=!1;return}}g&&(r?(g.enable(),i.renderSettings&&o&&(o.style.display="block",i.renderSettings(o))):(g.disable(),o&&(o.style.display="none",o.innerHTML="")))}["keydown","keyup","keypress"].forEach(i=>{window.addEventListener(i,n=>{let o=n.target;o&&o.closest("#sh-root")&&n.stopPropagation()},!0)}),R()}var B,C;})();

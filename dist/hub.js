"use strict";(()=>{var R=`
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
    /* Click-to-delete styling */
    .sh-bind-del-word { cursor: pointer; transition: color 0.2s, text-decoration 0.2s; }
    .sh-bind-del-word:hover { color: #d93025; text-decoration: line-through; }
    /* F-Key Interactions */
    .sh-bind-key { cursor: pointer; transition: background 0.2s, color 0.2s, border-color 0.2s; }
    .sh-bind-key:hover { background: #d2e3fc; color: #174ea6; }
    .sh-bind-key.sh-recording { background: #fce8e6 !important; color: #d93025 !important; border-color: #d93025 !important; }
`;if(window.__scriptHubLoaded){let w=document.getElementById("sh-panel");w&&(w.classList.contains("sh-open")?(w.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(T=>T.classList.remove("sh-expanded")),window.dispatchEvent(new CustomEvent("sh-panel-closed"))):w.classList.add("sh-open"))}else{let I=function(s){return s==="CRET"||s==="FAST"||s==="UG"||s==="REFURB"},H=function(){let s="sh_panel_opacity",n=.4;try{let t=localStorage.getItem(s);if(t!==null){let l=parseFloat(t);!isNaN(l)&&l>=.1&&l<=1&&(n=l)}}catch{}let i=document.createElement("div");i.id="sh-root",i.innerHTML=`
            <style>
                ${R}
            </style>
            
            <div id="sh-panel" style="opacity: ${n};">
                <div class="sh-header">
                    <div class="sh-header-group">
                        <select id="sh-subdep-select" class="sh-dep-dropdown">
                            ${S.map(t=>`<option value="${t}" ${b===t?"selected":""}>${t}</option>`).join(`
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
        `,document.body.appendChild(i);let g=document.getElementById("sh-panel"),f=document.getElementById("sh-settings-toggle-btn"),v=document.getElementById("sh-global-settings"),m=document.getElementById("sh-panel-opacity");f&&v&&f.addEventListener("click",()=>{f.classList.toggle("active"),v.classList.toggle("sh-expanded")}),m&&m.addEventListener("input",t=>{let l=t.target,a=parseFloat(l.value);g.style.opacity=a.toString();try{localStorage.setItem(s,a.toString())}catch{}});function p(){g.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(t=>t.classList.remove("sh-expanded")),v&&v.classList.remove("sh-expanded"),f&&f.classList.remove("active"),window.dispatchEvent(new CustomEvent("sh-panel-closed"))}document.addEventListener("mousedown",t=>{let l=t.target;g.classList.contains("sh-open")&&!g.contains(l)&&p()});let x=document.getElementById("sh-subdep-select");x&&x.addEventListener("change",t=>{let l=t.target;if(I(l.value)){b=l.value,localStorage.setItem("sh_hub_dep",b);let a=k[b];if(a){if(window.__itemCounter){window.__itemCounter.updateSettings({targetRate:a.targetRate,doubleCountMode:a.doubleCountMode});let e=document.getElementById("sh-cfg-target");e&&(e.value=a.targetRate.toString())}else try{let e=JSON.parse(localStorage.getItem("sh_item_counter_settings")||"{}");e.targetRate=a.targetRate,e.doubleCountMode=a.doubleCountMode,localStorage.setItem("sh_item_counter_settings",JSON.stringify(e))}catch{}if(window.__offTask){window.__offTask.updateSettings({timeoutMins:a.offTaskMins});let e=document.getElementById("sh-ot-mins");e&&(e.value=a.offTaskMins.toString())}else try{let e=JSON.parse(localStorage.getItem("sh_off_task_settings")||"{}");e.timeoutMins=a.offTaskMins,localStorage.setItem("sh_off_task_settings",JSON.stringify(e))}catch{}}E.forEach(e=>{let o=document.getElementById(`sh-card-${e.id}`);if(o)if(e.excludeDeps?.includes(b)){o.style.display="none";let r=e.getHandler(),d=document.getElementById(`sh-chk-${e.id}`);r&&r.isActive()&&(r.disable(),d&&(d.checked=!1))}else o.style.display="block"})}});let E=C.filter(t=>!t.experimental||w==="development"),h=()=>{let t=document.getElementById("sh-chk-all");if(!t)return;let a=E.filter(e=>!e.experimental).map(e=>document.getElementById(`sh-chk-${e.id}`));t.checked=a.length>0&&a.every(e=>e&&e.checked)},u=document.getElementById("sh-list");u&&E.forEach(t=>{let l=t.getHandler(),a=l?l.isActive():!1,e=document.createElement("div");e.id=`sh-card-${t.id}`,e.className="sh-card",t.excludeDeps?.includes(b)&&(e.style.display="none"),e.innerHTML=`
                    <div class="sh-card-top">
                        <div class="sh-card-info">
                            <div class="sh-card-title">${t.name}</div>
                            <div class="sh-card-desc">${t.description}</div>
                        </div>
                        <label class="sh-switch">
                            <input type="checkbox" id="sh-chk-${t.id}" ${a?"checked":""}>
                            <span class="sh-slider"></span>
                        </label>
                    </div>
                    <div class="sh-card-settings" id="sh-settings-${t.id}"></div>
                `,u.appendChild(e);let o=e.querySelector(`#sh-chk-${t.id}`),r=e.querySelector(`#sh-settings-${t.id}`);a&&t.renderSettings&&(r.style.display="block",t.renderSettings(r)),o&&(o.onchange=async()=>{await _(t,o,r),h()})});let c=document.getElementById("sh-chk-all");c&&c.addEventListener("change",async t=>{let a=t.target.checked,e=[];E.forEach(o=>{if(o.experimental)return;let r=document.getElementById(`sh-chk-${o.id}`),d=document.getElementById(`sh-settings-${o.id}`);r&&r.checked!==a&&!r.disabled&&(r.checked=a,e.push(_(o,r,d)))}),await Promise.all(e),h()}),h(),setTimeout(()=>{g.classList.add("sh-open")},100)};$=I,B=H,window.__scriptHubLoaded=!0;let w=window.__SH_BRANCH||"main",T=w==="local"?"http://localhost:3000/dist":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${w}/dist`,k={CRET:{targetRate:47,offTaskMins:4,doubleCountMode:!1},FAST:{targetRate:100,offTaskMins:10,doubleCountMode:!1},UG:{targetRate:47,offTaskMins:4,doubleCountMode:!0},REFURB:{targetRate:30,offTaskMins:10,doubleCountMode:!1}},M=new URLSearchParams(window.location.search).get("gradingMode"),S=[];M==="CRETURN_PRIMARY_GRADING"?S=["UG"]:M==="CRETURN"?S=["CRET","FAST"]:M==="CRETURN_REFURB"?S=["REFURB"]:S=["CRET","FAST","UG","REFURB"];let L=localStorage.getItem("sh_hub_dep"),b=I(L)&&S.includes(L)?L:S[0];if(L!==b)try{localStorage.setItem("sh_hub_dep",b)}catch{}let C=[{id:"item-counter",name:"\u0420\u0430\u0445\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u043A",file:"counter.js",description:"\u0420\u0430\u0445\u0443\u0454 \u043F\u0430\u0447\u043A\u0438, \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0445\u043E\u0432\u0430\u0442\u0438 \u0437 \u0435\u043A\u0440\u0430\u043D\u0443 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E F10. \u0412\u0438\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u0435\u0440\u0435\u0440\u0432\u0443.",getHandler:()=>window.__itemCounter,renderSettings:s=>{let n=window.__itemCounter;if(!n)return;let i=n.getSettings(),g=n.getCount(),f=k[b]?k[b].targetRate:47,v=k[b]?k[b].doubleCountMode:!1,m=i.targetRate!==void 0?i.targetRate:f;n.updateSettings({targetRate:m,doubleCountMode:v}),s.innerHTML=`
                    <div class="sh-settings-divider"></div>
                    <div class="sh-setting-row" title="Options & Manual Edit">
                        <span class="sh-emoji">\u{1F374}</span>
                        <div class="sh-opt-group">
                            <div class="sh-opt-btn ${i.lunchBreak===1?"active":""}" data-val="1">1</div>
                            <div class="sh-opt-btn ${i.lunchBreak===2?"active":""}" data-val="2">2</div>
                            <div class="sh-opt-btn ${i.lunchBreak===3?"active":""}" data-val="3">3</div>
                            <div class="sh-opt-btn ${i.lunchBreak===4?"active":""}" data-val="4">4</div>
                        </div>
                        <span class="sh-emoji">\u270F\uFE0F</span>
                        <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${g===0?"":g}" placeholder="666" />
                    </div>
                    <div class="sh-setting-row" title="Overlay Opacity">
                        <span class="sh-emoji">\u{1F47B}</span>
                        <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${i.overlayOpacity}" />
                    </div>
                    
                    <div id="sh-adv-container-item-counter" class="sh-adv-container">
                        <div class="sh-setting-row" title="Target Rate">
                            <span class="sh-emoji">\u{1F3AF}</span>
                            <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${m}" placeholder="\u041D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u0430 \u043D\u043E\u0440\u043C\u0430" />
                        </div>
                        
                        <div class="sh-setting-row sh-mt-8 sh-space-between" title="\u0412\u043B\u0430\u0441\u043D\u0438\u0439 \u0447\u0430\u0441 \u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0437\u043C\u0456\u043D\u0438">
                            <div class="sh-flex-center-gap">
                                <span class="sh-emoji">\u23F1\uFE0F</span>
                                <input type="text" id="sh-cfg-start-time" class="sh-input sh-time-input-small" value="${i.customStartTime||""}" placeholder="14:30" maxlength="5" />
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
                `,s.querySelectorAll(".sh-opt-btn").forEach(a=>{a.addEventListener("click",e=>{let o=e.target;s.querySelectorAll(".sh-opt-btn").forEach(d=>d.classList.remove("active")),o.classList.add("active");let r=parseInt(o.getAttribute("data-val")||"1",10);n.updateSettings({lunchBreak:r})})});let p=s.querySelector("#sh-cfg-count");p&&p.addEventListener("input",a=>{let e=a.target,o=parseInt(e.value,10);isNaN(o)&&(o=0),o<0&&(o=0,e.value="0"),n.setCount(o)});let x=s.querySelector("#sh-cfg-opacity");x&&x.addEventListener("input",a=>{let e=a.target,o=parseFloat(e.value);n.updateSettings({overlayOpacity:o})});let E=s.querySelector("#sh-cfg-target");E&&E.addEventListener("input",a=>{let e=a.target,o=parseFloat(e.value);(isNaN(o)||o<0)&&(o=0),n.updateSettings({targetRate:o})});let h=s.querySelector("#sh-cfg-start-time"),u=s.querySelector("#sh-btn-start-now"),c=s.querySelector("#sh-btn-start-reset");h&&u&&c&&(h.addEventListener("input",a=>{let e=a.target,o=a,r=e.value.replace(/\D/g,"").split(""),d="";if(r.length>0){let y=r.shift();y>="3"?d+="0"+y:d+=y}if(r.length>0&&d.length===1){let y=r.shift();d[0]==="2"&&y>="4"?(d="0"+d[0],r.unshift(y)):d+=y}if(d.length===2&&(r.length>0||o.inputType!=="deleteContentBackward"||e.value.endsWith(":"))&&(d+=":"),r.length>0){let y=r.shift();y>="6"?d+="0"+y:d+=y}if(r.length>0&&d.length===4){let y=r.shift();d+=y}e.value=d,d.length===5&&d.match(/^\d{2}:\d{2}$/)?n.updateSettings({customStartTime:d}):d===""&&n.updateSettings({customStartTime:null})}),u.addEventListener("click",()=>{let a=new Date,e=String(a.getHours()).padStart(2,"0"),o=String(a.getMinutes()).padStart(2,"0"),r=`${e}:${o}`;h.value=r,n.updateSettings({customStartTime:r})}),c.addEventListener("click",()=>{h.value="",n.updateSettings({customStartTime:null})}));let t=s.querySelector("#sh-adv-btn-item-counter"),l=s.querySelector("#sh-adv-container-item-counter");t&&l&&t.addEventListener("click",()=>{l.classList.toggle("sh-expanded")})}},{id:"off-task",name:"\u0410\u0432\u0442\u043E-\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044F (Off-Task)",file:"off_task.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u0438\u0431\u0438\u0432\u0430\u0454 \u0434\u043E \u0442\u043E\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441.",getHandler:()=>window.__offTask,renderSettings:s=>{let n=window.__offTask;if(!n)return;let i=k[b].offTaskMins,g=n.getSettings(),f=g.timeoutMins!==void 0?g.timeoutMins:i,v=g.toteBarcode||"";g.timeoutMins===void 0&&n.updateSettings({timeoutMins:i}),s.innerHTML=`
                    <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                        <span class="sh-emoji" title="\u0422\u0430\u0440\u0430">\u{1F4E6}</span>
                        <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${v}" placeholder="ts... (\u043F\u0443\u0441\u0442\u043E=\u0432\u0438\u043C\u043A)" autocomplete="off">
                        <span class="sh-emoji" title="\u0425\u0432\u0438\u043B\u0438\u043D\u0438">\u23F1\uFE0F</span>
                        <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${f}" title="\u0422\u0430\u0439\u043C\u0435\u0440">
                    </div>
                `;let m=s.querySelector("#sh-ot-tote"),p=s.querySelector("#sh-ot-mins");m.addEventListener("input",u=>{let c=u.target.value.trim();n.updateSettings({toteBarcode:c}),c||(p.value=n.getSettings().timeoutMins?.toString()||i.toString())}),p.addEventListener("change",u=>{let c=u.target.value.trim(),t=i;if(c.includes(":")){let l=c.split(":");t=parseInt(l[0]||"0",10)+parseInt(l[1]||"0",10)/60}else{let l=parseFloat(c);!isNaN(l)&&l>0&&(t=l)}n.updateSettings({timeoutMins:t})}),p.addEventListener("keydown",u=>{u.key==="Enter"&&p.blur()});let x=()=>{document.activeElement!==m&&(m.value=n.getSettings().toteBarcode||""),document.activeElement!==p&&(p.value=n.getSettings().timeoutMins?.toString()||i.toString(),p.style.color="")},E=u=>{if(document.activeElement===p||!n.getSettings().toteBarcode)return;let c=Math.ceil(u.detail.remainingMs/1e3),t=Math.floor(c/60),l=String(c%60).padStart(2,"0");p.value=`${t}:${l}`,p.style.color=c<=30?"#d93025":"#1a73e8",p.style.fontWeight="bold"};s._abortController&&s._abortController.abort();let h=new AbortController;s._abortController=h,window.addEventListener("sh-offtask-update",x,{signal:h.signal}),window.addEventListener("sh-offtask-tick",E,{signal:h.signal})},experimental:!0},{id:"binds",name:"\u0411\u0456\u043D\u0434\u0438",file:"binds.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u043E\u043A\u043B\u0456\u043A\u0443\u0454 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456.<br>\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u043D\u0430 F-\u043A\u043D\u043E\u043F\u043A\u0443 \u0434\u043B\u044F \u0437\u0430\u043F\u0438\u0441\u0443(\u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E F9 \u0456 F1-F7) \u0430\u0431\u043E \u043D\u0430 \u0441\u043B\u043E\u0432\u043E, \u0449\u043E\u0431 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0439\u043E\u0433\u043E.",getHandler:()=>window.__binds,renderSettings:s=>{let n=window.__binds;if(!n)return;let i=JSON.parse(JSON.stringify(n.getShortcuts()));s._abortController&&s._abortController.abort();let g=new AbortController;s._abortController=g,window.addEventListener("sh-binds-update",()=>{i=JSON.parse(JSON.stringify(n.getShortcuts())),f()},{signal:g.signal});let f=()=>{let v=Object.keys(i),m=n.getRecordingKey(),p="";v.length>0?p=v.map(h=>{let u=i[h],c=m===h,t=u.map((e,o)=>{let r=e.split(/\s+/).slice(0,2).join(" ");return`<span class="sh-bind-del-word" data-key="${h}" data-idx="${o}" title="\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438: ${e}">${r}</span>`}).join(' <span class="sh-arrow">\u2794</span> '),l=u.length>0?t:c?"<i>\u0417\u0430\u043F\u0438\u0441...</i>":"";return`
                                <div class="sh-bind-row">
                                    <div class="${c?"sh-bind-key sh-recording":"sh-bind-key"}" data-key="${h}" title="\u0417\u0430\u043F\u0438\u0441 / \u0417\u0443\u043F\u0438\u043D\u043A\u0430">${h}</div>
                                    <div class="sh-bind-action">${l}</div>
                                </div>
                            `}).join(""):p='<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">\u041D\u0430\u0440\u0430\u0437\u0456 \u043D\u0435\u043C\u0430\u0454 \u0436\u043E\u0434\u043D\u043E\u0433\u043E \u0431\u0456\u043D\u0434\u0430.</div>',s.innerHTML=`
                        <div id="sh-adv-container-binds" class="sh-adv-container ${s.querySelector("#sh-adv-container-binds")?.classList.contains("sh-expanded")?"sh-expanded":""}">
                            <div class="sh-bind-list">
                                ${p}
                            </div>
                        </div>
                        <div class="sh-adv-toggle-wrap">
                            <span id="sh-adv-btn-binds" class="sh-adv-text" style="margin-left: auto;">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</span>
                        </div>
                    `,s.querySelectorAll(".sh-bind-key").forEach(h=>{h.addEventListener("click",u=>{let t=u.target.getAttribute("data-key");t&&(n.getRecordingKey()===t?n.stopRecording():n.startRecording(t))})}),s.querySelectorAll(".sh-bind-del-word").forEach(h=>{h.addEventListener("click",u=>{let c=u.target,t=c.getAttribute("data-key"),l=c.getAttribute("data-idx");if(t&&l!==null&&!m){let a=parseInt(l,10);i[t].splice(a,1),n.updateShortcuts(i),f()}})});let x=s.querySelector("#sh-adv-btn-binds"),E=s.querySelector("#sh-adv-container-binds");x&&E&&x.addEventListener("click",()=>{E.classList.toggle("sh-expanded")})};f()}},{id:"auto-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn.js",description:'\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 "\u043F\u0435\u0440\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 LPN" \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456 LPN \u0430\u0431\u043E \u0431\u0443\u0434\u044C-\u0447\u043E\u0433\u043E \u0456\u043D\u0448\u043E\u0433\u043E, \u043E\u043A\u0440\u0456\u043C \u0442\u043E\u0442\u0430',excludeDeps:["REFURB"],getHandler:()=>window.__autoLpn},{id:"dev-inspector",name:"Dev Inspector",file:"dev_inspector.js",description:"\u041A\u043B\u0456\u043A\u043D\u0456\u0442\u044C \u043D\u0430 \u0431\u0443\u0434\u044C-\u044F\u043A\u0438\u0439 \u0435\u043B\u0435\u043C\u0435\u043D\u0442, \u0449\u043E\u0431 \u043F\u043E\u0431\u0430\u0447\u0438\u0442\u0438 \u0439\u043E\u0433\u043E HTML (\u0422\u0456\u043B\u044C\u043A\u0438 \u0434\u043B\u044F \u0440\u043E\u0437\u0440\u043E\u0431\u043A\u0438).",getHandler:()=>window.__devInspector,experimental:!0}];async function _(s,n,i){let g=n.checked,f=s.getHandler();if(g&&!f){n.disabled=!0;let v=`${T}/${s.file}?cb=${Date.now()}`;try{let m=await fetch(v);if(!m.ok)throw new Error(`HTTP ${m.status}`);let p=await m.text(),x=document.createElement("script");x.textContent=p,document.head.appendChild(x),f=s.getHandler(),n.disabled=!1}catch(m){alert(`\u26A0\uFE0F Failed to load ${s.name}:
${m.message}`),n.checked=!1,n.disabled=!1;return}}f&&(g?(f.enable(),s.renderSettings&&i&&(i.style.display="block",s.renderSettings(i))):(f.disable(),i&&(i.style.display="none",i.innerHTML="")))}["keydown","keyup","keypress"].forEach(s=>{window.addEventListener(s,n=>{let i=n.target;i&&i.closest("#sh-root")&&n.stopPropagation()},!0)}),H()}var $,B;})();

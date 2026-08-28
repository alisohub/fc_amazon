"use strict";(()=>{var H=`
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
`;if(window.__scriptHubLoaded){let E=document.getElementById("sh-panel");E&&(E.classList.contains("sh-open")?(E.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(L=>L.classList.remove("sh-expanded")),window.dispatchEvent(new CustomEvent("sh-panel-closed"))):E.classList.add("sh-open"))}else{let M=function(s){return s==="CRET"||s==="FAST"||s==="UG"||s==="REFURB"},_=function(){let s="sh_panel_opacity",n=.4;try{let t=localStorage.getItem(s);if(t!==null){let a=parseFloat(t);!isNaN(a)&&a>=.1&&a<=1&&(n=a)}}catch{}let r=document.createElement("div");r.id="sh-root",r.innerHTML=`
            <style>
                ${H}
            </style>
            
            <div id="sh-panel" style="opacity: ${n};">
                <div class="sh-header">
                    <div class="sh-header-group">
                        <select id="sh-subdep-select" class="sh-dep-dropdown">
                            ${w.map(t=>`<option value="${t}" ${y===t?"selected":""}>${t}</option>`).join(`
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
        `,document.body.appendChild(r);let g=document.getElementById("sh-panel"),u=document.getElementById("sh-settings-toggle-btn"),v=document.getElementById("sh-global-settings"),f=document.getElementById("sh-panel-opacity");u&&v&&u.addEventListener("click",()=>{u.classList.toggle("active"),v.classList.toggle("sh-expanded")}),f&&f.addEventListener("input",t=>{let a=t.target,i=parseFloat(a.value);g.style.opacity=i.toString();try{localStorage.setItem(s,i.toString())}catch{}});function c(){g.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(t=>t.classList.remove("sh-expanded")),v&&v.classList.remove("sh-expanded"),u&&u.classList.remove("active"),window.dispatchEvent(new CustomEvent("sh-panel-closed"))}document.addEventListener("mousedown",t=>{let a=t.target;g.classList.contains("sh-open")&&!g.contains(a)&&c()});let x=document.getElementById("sh-subdep-select");x&&x.addEventListener("change",t=>{let a=t.target;if(M(a.value)){y=a.value,localStorage.setItem("sh_hub_dep",y);let i=S[y];if(i){if(window.__itemCounter){window.__itemCounter.updateSettings({targetRate:i.targetRate});let e=document.getElementById("sh-cfg-target");e&&(e.value=i.targetRate.toString())}else try{let e=JSON.parse(localStorage.getItem("sh_item_counter_settings")||"{}");e.targetRate=i.targetRate,localStorage.setItem("sh_item_counter_settings",JSON.stringify(e))}catch{}if(window.__offTask){window.__offTask.updateSettings({timeoutMins:i.offTaskMins});let e=document.getElementById("sh-ot-mins");e&&(e.value=i.offTaskMins.toString())}else try{let e=JSON.parse(localStorage.getItem("sh_off_task_settings")||"{}");e.timeoutMins=i.offTaskMins,localStorage.setItem("sh_off_task_settings",JSON.stringify(e))}catch{}}b.forEach(e=>{let l=document.getElementById(`sh-card-${e.id}`);if(l)if(e.excludeDeps?.includes(y)){l.style.display="none";let o=e.getHandler(),m=document.getElementById(`sh-chk-${e.id}`);o&&o.isActive()&&(o.disable(),m&&(m.checked=!1))}else l.style.display="block"})}});let b=R.filter(t=>!t.experimental||E==="development"||E==="ts-all-the-way"),p=()=>{let t=document.getElementById("sh-chk-all");if(!t)return;let i=b.filter(e=>!e.experimental).map(e=>document.getElementById(`sh-chk-${e.id}`));t.checked=i.length>0&&i.every(e=>e&&e.checked)},h=document.getElementById("sh-list");h&&b.forEach(t=>{let a=t.getHandler(),i=a?a.isActive():!1,e=document.createElement("div");e.id=`sh-card-${t.id}`,e.className="sh-card",t.excludeDeps?.includes(y)&&(e.style.display="none"),e.innerHTML=`
                    <div class="sh-card-top">
                        <div class="sh-card-info">
                            <div class="sh-card-title">${t.name}</div>
                            <div class="sh-card-desc">${t.description}</div>
                        </div>
                        <label class="sh-switch">
                            <input type="checkbox" id="sh-chk-${t.id}" ${i?"checked":""}>
                            <span class="sh-slider"></span>
                        </label>
                    </div>
                    <div class="sh-card-settings" id="sh-settings-${t.id}"></div>
                `,h.appendChild(e);let l=e.querySelector(`#sh-chk-${t.id}`),o=e.querySelector(`#sh-settings-${t.id}`);i&&t.renderSettings&&(o.style.display="block",t.renderSettings(o)),l&&(l.onchange=async()=>{await I(t,l,o),p()})});let d=document.getElementById("sh-chk-all");d&&d.addEventListener("change",async t=>{let i=t.target.checked,e=[];b.forEach(l=>{if(l.experimental)return;let o=document.getElementById(`sh-chk-${l.id}`),m=document.getElementById(`sh-settings-${l.id}`);o&&o.checked!==i&&!o.disabled&&(o.checked=i,e.push(I(l,o,m)))}),await Promise.all(e),p()}),p(),setTimeout(()=>{g.classList.add("sh-open")},100)};$=M,B=_,window.__scriptHubLoaded=!0;let E=window.__SH_BRANCH||"main",L=E==="local"?"http://localhost:3000/dist":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${E}/dist`,S={CRET:{targetRate:47,offTaskMins:4},FAST:{targetRate:100,offTaskMins:10},UG:{targetRate:47,offTaskMins:4},REFURB:{targetRate:30,offTaskMins:10}},T=new URLSearchParams(window.location.search).get("gradingMode"),w=[];T==="CRETURN_PRIMARY_GRADING"?w=["UG"]:T==="CRETURN"?w=["CRET","FAST"]:T==="CRETURN_REFURB"?w=["REFURB"]:w=["CRET","FAST","UG","REFURB"];let k=localStorage.getItem("sh_hub_dep"),y=M(k)&&w.includes(k)?k:w[0];if(k!==y)try{localStorage.setItem("sh_hub_dep",y)}catch{}let R=[{id:"item-counter",name:"\u0420\u0430\u0445\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u043A",file:"counter.js",description:"\u0420\u0430\u0445\u0443\u0454 \u043F\u0430\u0447\u043A\u0438, \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0445\u043E\u0432\u0430\u0442\u0438 \u0437 \u0435\u043A\u0440\u0430\u043D\u0443 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E F10. \u0412\u0438\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u0435\u0440\u0435\u0440\u0432\u0443.",getHandler:()=>window.__itemCounter,renderSettings:s=>{let n=window.__itemCounter;if(!n)return;let r=n.getSettings(),g=n.getCount(),u=S[y]?S[y].targetRate:47,v=r.targetRate!==void 0?r.targetRate:u;n.updateSettings({targetRate:v}),s.innerHTML=`
                    <div class="sh-settings-divider"></div>
                    <div class="sh-setting-row" title="Options & Manual Edit">
                        <span class="sh-emoji">\u{1F374}</span>
                        <div class="sh-opt-group">
                            <div class="sh-opt-btn ${r.lunchBreak===1?"active":""}" data-val="1">1</div>
                            <div class="sh-opt-btn ${r.lunchBreak===2?"active":""}" data-val="2">2</div>
                            <div class="sh-opt-btn ${r.lunchBreak===3?"active":""}" data-val="3">3</div>
                            <div class="sh-opt-btn ${r.lunchBreak===4?"active":""}" data-val="4">4</div>
                        </div>
                        <span class="sh-emoji">\u270F\uFE0F</span>
                        <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${g===0?"":g}" placeholder="666" />
                    </div>
                    <div class="sh-setting-row" title="Overlay Opacity">
                        <span class="sh-emoji">\u{1F47B}</span>
                        <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${r.overlayOpacity}" />
                    </div>
                    
                    <div id="sh-adv-container-item-counter" class="sh-adv-container">
                        <div class="sh-setting-row" title="Target Rate">
                            <span class="sh-emoji">\u{1F3AF}</span>
                            <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${v}" placeholder="\u041D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u0430 \u043D\u043E\u0440\u043C\u0430" />
                        </div>
                        
                        <div class="sh-setting-row sh-mt-8 sh-space-between" title="\u0412\u043B\u0430\u0441\u043D\u0438\u0439 \u0447\u0430\u0441 \u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0437\u043C\u0456\u043D\u0438">
                            <div class="sh-flex-center-gap">
                                <span class="sh-emoji">\u23F1\uFE0F</span>
                                <input type="text" id="sh-cfg-start-time" class="sh-input sh-time-input-small" value="${r.customStartTime||""}" placeholder="14:30" maxlength="5" />
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
                `,s.querySelectorAll(".sh-opt-btn").forEach(a=>{a.addEventListener("click",i=>{let e=i.target;s.querySelectorAll(".sh-opt-btn").forEach(o=>o.classList.remove("active")),e.classList.add("active");let l=parseInt(e.getAttribute("data-val")||"1",10);n.updateSettings({lunchBreak:l})})});let f=s.querySelector("#sh-cfg-count");f&&f.addEventListener("input",a=>{let i=a.target,e=parseInt(i.value,10);isNaN(e)&&(e=0),e<0&&(e=0,i.value="0"),n.setCount(e)});let c=s.querySelector("#sh-cfg-opacity");c&&c.addEventListener("input",a=>{let i=a.target,e=parseFloat(i.value);n.updateSettings({overlayOpacity:e})});let x=s.querySelector("#sh-cfg-target");x&&x.addEventListener("input",a=>{let i=a.target,e=parseFloat(i.value);(isNaN(e)||e<0)&&(e=0),n.updateSettings({targetRate:e})});let b=s.querySelector("#sh-cfg-start-time"),p=s.querySelector("#sh-btn-start-now"),h=s.querySelector("#sh-btn-start-reset");b&&p&&h&&(b.addEventListener("input",a=>{let i=a.target,e=a,l=i.value.replace(/\D/g,"").split(""),o="";if(l.length>0){let m=l.shift();m>="3"?o+="0"+m:o+=m}if(l.length>0&&o.length===1){let m=l.shift();o[0]==="2"&&m>="4"?(o="0"+o[0],l.unshift(m)):o+=m}if(o.length===2&&(l.length>0||e.inputType!=="deleteContentBackward"||i.value.endsWith(":"))&&(o+=":"),l.length>0){let m=l.shift();m>="6"?o+="0"+m:o+=m}if(l.length>0&&o.length===4){let m=l.shift();o+=m}i.value=o,o.length===5&&o.match(/^\d{2}:\d{2}$/)?n.updateSettings({customStartTime:o}):o===""&&n.updateSettings({customStartTime:null})}),p.addEventListener("click",()=>{let a=new Date,i=String(a.getHours()).padStart(2,"0"),e=String(a.getMinutes()).padStart(2,"0"),l=`${i}:${e}`;b.value=l,n.updateSettings({customStartTime:l})}),h.addEventListener("click",()=>{b.value="",n.updateSettings({customStartTime:null})}));let d=s.querySelector("#sh-adv-btn-item-counter"),t=s.querySelector("#sh-adv-container-item-counter");d&&t&&d.addEventListener("click",()=>{t.classList.toggle("sh-expanded")})}},{id:"off-task",name:"\u0410\u0432\u0442\u043E-\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044F (Off-Task)",file:"off_task.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u0438\u0431\u0438\u0432\u0430\u0454 \u0434\u043E \u0442\u043E\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441.",getHandler:()=>window.__offTask,renderSettings:s=>{let n=window.__offTask;if(!n)return;let r=S[y].offTaskMins,g=n.getSettings(),u=g.timeoutMins!==void 0?g.timeoutMins:r,v=g.toteBarcode||"";g.timeoutMins===void 0&&n.updateSettings({timeoutMins:r}),s.innerHTML=`
                    <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                        <span class="sh-emoji" title="\u0422\u0430\u0440\u0430">\u{1F4E6}</span>
                        <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${v}" placeholder="ts... (\u043F\u0443\u0441\u0442\u043E=\u0432\u0438\u043C\u043A)" autocomplete="off">
                        <span class="sh-emoji" title="\u0425\u0432\u0438\u043B\u0438\u043D\u0438">\u23F1\uFE0F</span>
                        <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${u}" title="\u0422\u0430\u0439\u043C\u0435\u0440">
                    </div>
                `;let f=s.querySelector("#sh-ot-tote"),c=s.querySelector("#sh-ot-mins");f.addEventListener("input",h=>{let d=h.target.value.trim();n.updateSettings({toteBarcode:d}),d||(c.value=n.getSettings().timeoutMins?.toString()||r.toString())}),c.addEventListener("change",h=>{let d=h.target.value.trim(),t=r;if(d.includes(":")){let a=d.split(":");t=parseInt(a[0]||"0",10)+parseInt(a[1]||"0",10)/60}else{let a=parseFloat(d);!isNaN(a)&&a>0&&(t=a)}n.updateSettings({timeoutMins:t})}),c.addEventListener("keydown",h=>{h.key==="Enter"&&c.blur()});let x=()=>{document.activeElement!==f&&(f.value=n.getSettings().toteBarcode||""),document.activeElement!==c&&(c.value=n.getSettings().timeoutMins?.toString()||r.toString(),c.style.color="")},b=h=>{if(document.activeElement===c||!n.getSettings().toteBarcode)return;let d=Math.ceil(h.detail.remainingMs/1e3),t=Math.floor(d/60),a=String(d%60).padStart(2,"0");c.value=`${t}:${a}`,c.style.color=d<=30?"#d93025":"#1a73e8",c.style.fontWeight="bold"};s._abortController&&s._abortController.abort();let p=new AbortController;s._abortController=p,window.addEventListener("sh-offtask-update",x,{signal:p.signal}),window.addEventListener("sh-offtask-tick",b,{signal:p.signal})}},{id:"binds",name:"\u0411\u0456\u043D\u0434\u0438",file:"binds.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u043E\u043A\u043B\u0456\u043A\u0443\u0454 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456.<br>\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u043D\u0430 F-\u043A\u043D\u043E\u043F\u043A\u0443 \u0434\u043B\u044F \u0437\u0430\u043F\u0438\u0441\u0443 \u0430\u0431\u043E \u043D\u0430 \u0441\u043B\u043E\u0432\u043E, \u0449\u043E\u0431 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0439\u043E\u0433\u043E.",getHandler:()=>window.__binds,renderSettings:s=>{let n=window.__binds;if(!n)return;let r=JSON.parse(JSON.stringify(n.getShortcuts()));s._abortController&&s._abortController.abort();let g=new AbortController;s._abortController=g,window.addEventListener("sh-binds-update",()=>{r=JSON.parse(JSON.stringify(n.getShortcuts())),u()},{signal:g.signal});let u=()=>{let v=Object.keys(r),f=n.getRecordingKey(),c="";v.length>0?c=v.map(p=>{let h=r[p],d=f===p,t=h.map((e,l)=>{let o=e.split(/\s+/).slice(0,2).join(" ");return`<span class="sh-bind-del-word" data-key="${p}" data-idx="${l}" title="\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438: ${e}">${o}</span>`}).join(' <span class="sh-arrow">\u2794</span> '),a=h.length>0?t:d?"<i>\u0417\u0430\u043F\u0438\u0441...</i>":"";return`
                                <div class="sh-bind-row">
                                    <div class="${d?"sh-bind-key sh-recording":"sh-bind-key"}" data-key="${p}" title="\u0417\u0430\u043F\u0438\u0441 / \u0417\u0443\u043F\u0438\u043D\u043A\u0430">${p}</div>
                                    <div class="sh-bind-action">${a}</div>
                                </div>
                            `}).join(""):c='<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">\u041D\u0430\u0440\u0430\u0437\u0456 \u043D\u0435\u043C\u0430\u0454 \u0436\u043E\u0434\u043D\u043E\u0433\u043E \u0431\u0456\u043D\u0434\u0430.</div>',s.innerHTML=`
                        <div id="sh-adv-container-binds" class="sh-adv-container ${s.querySelector("#sh-adv-container-binds")?.classList.contains("sh-expanded")?"sh-expanded":""}">
                            <div class="sh-bind-list">
                                ${c}
                            </div>
                        </div>
                        <div class="sh-adv-toggle-wrap">
                            <span id="sh-adv-btn-binds" class="sh-adv-text" style="margin-left: auto;">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</span>
                        </div>
                    `,s.querySelectorAll(".sh-bind-key").forEach(p=>{p.addEventListener("click",h=>{let t=h.target.getAttribute("data-key");t&&(n.getRecordingKey()===t?n.stopRecording():n.startRecording(t))})}),s.querySelectorAll(".sh-bind-del-word").forEach(p=>{p.addEventListener("click",h=>{let d=h.target,t=d.getAttribute("data-key"),a=d.getAttribute("data-idx");if(t&&a!==null&&!f){let i=parseInt(a,10);r[t].splice(i,1),n.updateShortcuts(r),u()}})});let x=s.querySelector("#sh-adv-btn-binds"),b=s.querySelector("#sh-adv-container-binds");x&&b&&x.addEventListener("click",()=>{b.classList.toggle("sh-expanded")})};u()}},{id:"auto-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn.js",description:'\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 "\u043F\u0435\u0440\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 LPN" \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456 LPN \u0430\u0431\u043E \u0431\u0443\u0434\u044C-\u0447\u043E\u0433\u043E \u0456\u043D\u0448\u043E\u0433\u043E, \u043E\u043A\u0440\u0456\u043C \u0442\u043E\u0442\u0430',excludeDeps:["REFURB"],getHandler:()=>window.__autoLpn},{id:"dev-inspector",name:"Dev Inspector",file:"dev_inspector.js",description:"\u041A\u043B\u0456\u043A\u043D\u0456\u0442\u044C \u043D\u0430 \u0431\u0443\u0434\u044C-\u044F\u043A\u0438\u0439 \u0435\u043B\u0435\u043C\u0435\u043D\u0442, \u0449\u043E\u0431 \u043F\u043E\u0431\u0430\u0447\u0438\u0442\u0438 \u0439\u043E\u0433\u043E HTML (\u0422\u0456\u043B\u044C\u043A\u0438 \u0434\u043B\u044F \u0440\u043E\u0437\u0440\u043E\u0431\u043A\u0438).",getHandler:()=>window.__devInspector,experimental:!0}];async function I(s,n,r){let g=n.checked,u=s.getHandler();if(g&&!u){n.disabled=!0;let v=`${L}/${s.file}?cb=${Date.now()}`;try{let f=await fetch(v);if(!f.ok)throw new Error(`HTTP ${f.status}`);let c=await f.text(),x=document.createElement("script");x.textContent=c,document.head.appendChild(x),u=s.getHandler(),n.disabled=!1}catch(f){alert(`\u26A0\uFE0F Failed to load ${s.name}:
${f.message}`),n.checked=!1,n.disabled=!1;return}}u&&(g?(u.enable(),s.renderSettings&&r&&(r.style.display="block",s.renderSettings(r))):(u.disable(),r&&(r.style.display="none",r.innerHTML="")))}["keydown","keyup","keypress"].forEach(s=>{window.addEventListener(s,n=>{let r=n.target;r&&r.closest("#sh-root")&&n.stopPropagation()},!0)}),_()}var $,B;})();

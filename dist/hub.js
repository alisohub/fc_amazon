"use strict";(()=>{var C="sh_hub_dep";var B="sh_item_counter_settings",P="sh_off_task_settings";var A="sh_lpn",O="sh_work_station";var W=["Wprowad\u017A LPN"],U=["Wprowad\u017A stacj\u0119 robocz\u0105"],j=["Wprowad\u017A numer rma"],z=["Wprowad\u017A lpn lub sku"];var G=`
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
`;if(window.location.href.includes("gravis"))(async()=>{let L=window.__SH_BRANCH||"main",H=L==="local"?"http://localhost:3000/dist/hub_gravis.js":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${L}/dist/hub_gravis.js`;try{let I=await fetch(H);if(!I.ok)throw new Error(`HTTP ${I.status}`);let _=await I.text(),w=document.createElement("script");w.textContent=_,document.head.appendChild(w)}catch(I){alert(`\u26A0\uFE0F Failed to load Gravis Hub: ${I}`)}})();else if(window.__scriptHubLoaded){let L=document.getElementById("sh-panel");L&&(L.classList.contains("sh-open")?(L.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(H=>H.classList.remove("sh-expanded")),window.dispatchEvent(new CustomEvent("sh-panel-closed"))):L.classList.add("sh-open"))}else{window.__scriptHubLoaded=!0;async function L(_){let w=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(_));return Array.from(new Uint8Array(w)).map(M=>M.toString(16).padStart(2,"0")).join("")}async function H(){return new Promise(_=>{let w=Date.now(),M=async()=>{let E=document.querySelector("p.user__username");E&&E.textContent?_(await L(E.textContent.trim())):Date.now()-w>1e4?_(null):setTimeout(M,500)};M()})}let I=["24deb6961c3cef1d2e3795aaf4b7e3fe8d83d20adff06215426c05827c8351ca","710a0c6095723bc0a46d78897497b5af0417cee56708fdc10cca6860b686ea6e","bc95a4675c77e3ee07d42d825c05e403c3861d29b24ddd57c6e30ebb7a8c2336","49480808159cde937909eaad603911749197829c0cea7a8b68c29e63c98538c0","61678f96fc810a611097d9b0bc98bc8ecb0abee7cd55f2faa19b455604dc2332","2f5ae5e87d1a659e1a01e2bc2c38441bba81bb12eb39d59695b4960576012c55","004381f7f5b3ace58d7dc03a047674325acd266ddc576c273942fdb7237f7130","f355a6794c9a044989a7d2e5bc1e3aa5bff909a38adfbdc68cc0433042ea84b9"];(async()=>{let _=window.__SH_BRANCH||"main",w=!1;if(_==="local")w=!0;else{let s=await H();if(!s||(w=I.includes(s),_==="development"&&!w))return}let M=_==="local"?"http://localhost:3000/dist":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${_}/dist`,E={CRET:{targetRate:47,offTaskMins:4,doubleCountMode:!1,scanTimeoutMs:6e3},FAST:{targetRate:80,offTaskMins:2,doubleCountMode:!1,scanTimeoutMs:4e3},UG:{targetRate:47,offTaskMins:4,doubleCountMode:!0,scanTimeoutMs:6e3},REFURB:{targetRate:30,offTaskMins:1,doubleCountMode:!1,scanTimeoutMs:6e3},WHD:{targetRate:25,offTaskMins:5,doubleCountMode:!1,scanTimeoutMs:6e3}},N=new URLSearchParams(window.location.search).get("gradingMode"),k=[];N==="CRETURN_PRIMARY_GRADING"?k=["UG"]:N==="CRETURN"?k=["FAST","CRET"]:N==="CRETURN_REFURB"?k=["REFURB"]:N==="WAREHOUSE_DEALS"?k=["WHD"]:k=["FAST","CRET","UG","REFURB","WHD"];function D(s){return s==="FAST"||s==="CRET"||s==="UG"||s==="REFURB"||s==="WHD"}let R=localStorage.getItem(C),v=D(R)&&k.includes(R)?R:k[0];if(R!==v)try{localStorage.setItem(C,v)}catch{}let F=[{id:"item-counter",name:"\u0420\u0430\u0445\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u043A",file:"counter.js",description:"\u0420\u0430\u0445\u0443\u0454 \u043F\u0430\u0447\u043A\u0438, \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0445\u043E\u0432\u0430\u0442\u0438 \u0437 \u0435\u043A\u0440\u0430\u043D\u0443 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E F10. \u0412\u0438\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u0435\u0440\u0435\u0440\u0432\u0443.",getHandler:()=>window.__itemCounter,renderSettings:s=>{let n=window.__itemCounter;if(!n)return;let a=n.getSettings(),f=n.getCount(),u=E[v]?E[v].targetRate:47,x=E[v]?E[v].doubleCountMode:!1,h=E[v]?E[v].scanTimeoutMs:6e3,d=a.targetRate!==void 0?a.targetRate:u;n.updateSettings({targetRate:d,doubleCountMode:x,scanTimeoutMs:h}),s.innerHTML=`
                            <div class="sh-settings-divider"></div>
                            <div class="sh-setting-row" title="Options & Manual Edit">
                                <span class="sh-emoji">\u{1F374}</span>
                                <div class="sh-opt-group">
                                    <div class="sh-opt-btn ${a.lunchBreak===1?"active":""}" data-val="1">1</div>
                                    <div class="sh-opt-btn ${a.lunchBreak===2?"active":""}" data-val="2">2</div>
                                    <div class="sh-opt-btn ${a.lunchBreak===3?"active":""}" data-val="3">3</div>
                                    <div class="sh-opt-btn ${a.lunchBreak===4?"active":""}" data-val="4">4</div>
                                </div>
                                <span class="sh-emoji">\u270F\uFE0F</span>
                                <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${f===0?"":f}" placeholder="666" />
                            </div>
                            <div class="sh-setting-row" title="Overlay Opacity">
                                <span class="sh-emoji">\u{1F47B}</span>
                                <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${a.overlayOpacity}" />
                            </div>
                            
                            <div id="sh-adv-container-item-counter" class="sh-adv-container">
                                <div class="sh-setting-row" title="Target Rate">
                                    <span class="sh-emoji">\u{1F3AF}</span>
                                    <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${d}" placeholder="\u041D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u0430 \u043D\u043E\u0440\u043C\u0430" />
                                </div>
                                
                                <div class="sh-setting-row sh-mt-8 sh-space-between" title="\u0412\u043B\u0430\u0441\u043D\u0438\u0439 \u0447\u0430\u0441 \u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0437\u043C\u0456\u043D\u0438">
                                    <div class="sh-flex-center-gap">
                                        <span class="sh-emoji">\u23F1\uFE0F</span>
                                        <input type="text" id="sh-cfg-start-time" class="sh-input sh-time-input-small" value="${a.customStartTime||""}" placeholder="14:30" maxlength="5" />
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
                        `,s.querySelectorAll(".sh-opt-btn").forEach(e=>{e.addEventListener("click",r=>{let l=r.target;s.querySelectorAll(".sh-opt-btn").forEach(p=>p.classList.remove("active")),l.classList.add("active");let b=parseInt(l.getAttribute("data-val")||"1",10);n.updateSettings({lunchBreak:b})})});let y=s.querySelector("#sh-cfg-count");y&&y.addEventListener("input",e=>{let r=e.target,l=parseInt(r.value,10);isNaN(l)&&(l=0),l<0&&(l=0,r.value="0"),n.setCount(l)});let S=s.querySelector("#sh-cfg-opacity");S&&S.addEventListener("input",e=>{let r=e.target,l=parseFloat(r.value);n.updateSettings({overlayOpacity:l})});let m=s.querySelector("#sh-cfg-target");m&&m.addEventListener("input",e=>{let r=e.target,l=parseFloat(r.value);(isNaN(l)||l<0)&&(l=0),n.updateSettings({targetRate:l})});let g=s.querySelector("#sh-cfg-start-time"),c=s.querySelector("#sh-btn-start-now"),t=s.querySelector("#sh-btn-start-reset");g&&c&&t&&(g.addEventListener("input",e=>{let r=e.target,l=e,b=r.value.replace(/\D/g,"").split(""),p="";if(b.length>0){let T=b.shift();T>="3"?p+="0"+T:p+=T}if(b.length>0&&p.length===1){let T=b.shift();p[0]==="2"&&T>="4"?(p="0"+p[0],b.unshift(T)):p+=T}if(p.length===2&&(b.length>0||l.inputType!=="deleteContentBackward"||r.value.endsWith(":"))&&(p+=":"),b.length>0){let T=b.shift();T>="6"?p+="0"+T:p+=T}if(b.length>0&&p.length===4){let T=b.shift();p+=T}r.value=p,p.length===5&&p.match(/^\d{2}:\d{2}$/)?n.updateSettings({customStartTime:p}):p===""&&n.updateSettings({customStartTime:null})}),c.addEventListener("click",()=>{let e=new Date,r=String(e.getHours()).padStart(2,"0"),l=String(e.getMinutes()).padStart(2,"0"),b=`${r}:${l}`;g.value=b,n.updateSettings({customStartTime:b})}),t.addEventListener("click",()=>{g.value="",n.updateSettings({customStartTime:null})}));let i=s.querySelector("#sh-adv-btn-item-counter"),o=s.querySelector("#sh-adv-container-item-counter");i&&o&&i.addEventListener("click",()=>{o.classList.toggle("sh-expanded")})}},{id:"off-task",name:"\u0410\u0432\u0442\u043E-\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044F (Off-Task)",file:"off_task.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u0438\u0431\u0438\u0432\u0430\u0454 \u0434\u043E \u0442\u043E\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441.",getHandler:()=>window.__offTask,renderSettings:s=>{let n=window.__offTask;if(!n)return;let a=E[v].offTaskMins,f=n.getSettings(),u=f.timeoutMins!==void 0?f.timeoutMins:a,x=f.toteBarcode||"";f.timeoutMins===void 0&&n.updateSettings({timeoutMins:a}),s.innerHTML=`
                            <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                                <span class="sh-emoji" title="\u0422\u0430\u0440\u0430">\u{1F4E6}</span>
                                <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${x}" placeholder="ts... (\u043F\u0443\u0441\u0442\u043E=\u0432\u0438\u043C\u043A)" autocomplete="off">
                                <span class="sh-emoji" title="\u0425\u0432\u0438\u043B\u0438\u043D\u0438">\u23F1\uFE0F</span>
                                <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${u}" title="\u0422\u0430\u0439\u043C\u0435\u0440">
                            </div>
                        `;let h=s.querySelector("#sh-ot-tote"),d=s.querySelector("#sh-ot-mins");h.addEventListener("input",g=>{let c=g.target.value.trim();n.updateSettings({toteBarcode:c}),c||(d.value=n.getSettings().timeoutMins?.toString()||a.toString())}),d.addEventListener("change",g=>{let c=g.target.value.trim(),t=a;if(c.includes(":")){let i=c.split(":");t=parseInt(i[0]||"0",10)+parseInt(i[1]||"0",10)/60}else{let i=parseFloat(c);!isNaN(i)&&i>0&&(t=i)}n.updateSettings({timeoutMins:t})}),d.addEventListener("keydown",g=>{g.key==="Enter"&&d.blur()});let y=()=>{document.activeElement!==h&&(h.value=n.getSettings().toteBarcode||""),document.activeElement!==d&&(d.value=n.getSettings().timeoutMins?.toString()||a.toString(),d.style.color="")},S=g=>{if(document.activeElement===d||!n.getSettings().toteBarcode)return;let c=Math.ceil(g.detail.remainingMs/1e3),t=Math.floor(c/60),i=String(c%60).padStart(2,"0");d.value=`${t}:${i}`,d.style.color=c<=30?"#d93025":"#1a73e8",d.style.fontWeight="bold"};s._abortController&&s._abortController.abort();let m=new AbortController;s._abortController=m,window.addEventListener("sh-offtask-update",y,{signal:m.signal}),window.addEventListener("sh-offtask-tick",S,{signal:m.signal})},isTrusted:!0},{id:"binds",name:"\u0411\u0456\u043D\u0434\u0438",file:"binds.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u043E\u043A\u043B\u0456\u043A\u0443\u0454 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456.<br>\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u043D\u0430 F-\u043A\u043D\u043E\u043F\u043A\u0443 \u0434\u043B\u044F \u0437\u0430\u043F\u0438\u0441\u0443(\u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E F9 \u0456 F1-F7) \u0430\u0431\u043E \u043D\u0430 \u0441\u043B\u043E\u0432\u043E, \u0449\u043E\u0431 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0439\u043E\u0433\u043E.",getHandler:()=>window.__binds,renderSettings:s=>{let n=window.__binds;if(!n)return;let a=JSON.parse(JSON.stringify(n.getShortcuts()));s._abortController&&s._abortController.abort();let f=new AbortController;s._abortController=f,window.addEventListener("sh-binds-update",()=>{a=JSON.parse(JSON.stringify(n.getShortcuts())),u()},{signal:f.signal});let u=()=>{let x=Object.keys(a),h=n.getRecordingKey(),d="";x.length>0?d=x.map(m=>{let g=a[m],c=h===m,t=g.map((e,r)=>{let l=e.split(/\s+/).slice(0,2).join(" ");return`<span class="sh-bind-del-word" data-key="${m}" data-idx="${r}" title="\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438: ${e}">${l}</span>`}).join(' <span class="sh-arrow">\u2794</span> '),i=g.length>0?t:c?"<i>\u0417\u0430\u043F\u0438\u0441...</i>":"";return`
                                        <div class="sh-bind-row">
                                            <div class="${c?"sh-bind-key sh-recording":"sh-bind-key"}" data-key="${m}" title="\u0417\u0430\u043F\u0438\u0441 / \u0417\u0443\u043F\u0438\u043D\u043A\u0430">${m}</div>
                                            <div class="sh-bind-action">${i}</div>
                                        </div>
                                    `}).join(""):d='<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">\u041D\u0430\u0440\u0430\u0437\u0456 \u043D\u0435\u043C\u0430\u0454 \u0436\u043E\u0434\u043D\u043E\u0433\u043E \u0431\u0456\u043D\u0434\u0430.</div>',s.innerHTML=`
                                <div id="sh-adv-container-binds" class="sh-adv-container ${s.querySelector("#sh-adv-container-binds")?.classList.contains("sh-expanded")?"sh-expanded":""}">
                                    <div class="sh-bind-list">
                                        ${d}
                                    </div>
                                </div>
                                <div class="sh-adv-toggle-wrap">
                                    <span id="sh-adv-btn-binds" class="sh-adv-text" style="margin-left: auto;">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</span>
                                </div>
                            `,s.querySelectorAll(".sh-bind-key").forEach(m=>{m.addEventListener("click",g=>{let t=g.target.getAttribute("data-key");t&&(n.getRecordingKey()===t?n.stopRecording():n.startRecording(t))})}),s.querySelectorAll(".sh-bind-del-word").forEach(m=>{m.addEventListener("click",g=>{let c=g.target,t=c.getAttribute("data-key"),i=c.getAttribute("data-idx");if(t&&i!==null&&!h){let o=parseInt(i,10);a[t].splice(o,1),n.updateShortcuts(a),u()}})});let y=s.querySelector("#sh-adv-btn-binds"),S=s.querySelector("#sh-adv-container-binds");y&&S&&y.addEventListener("click",()=>{S.classList.toggle("sh-expanded")})};u()}},{id:"auto-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn.js",description:'\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 "\u043F\u0435\u0440\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 LPN" \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456 LPN \u0430\u0431\u043E \u0431\u0443\u0434\u044C-\u0447\u043E\u0433\u043E \u0456\u043D\u0448\u043E\u0433\u043E, \u043E\u043A\u0440\u0456\u043C \u0442\u043E\u0442\u0430',excludeDeps:["REFURB","WHD"],getHandler:()=>window.__autoLpn},{id:"refurb-lpn",name:"A\u0432\u0442\u043E-LPN",file:"auto_lpn_refurb.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0437\u0430\u043F\u043E\u0432\u043D\u044E\u0454 \u0441\u0442\u0430\u0440\u0443 LPN",excludeDeps:["CRET","FAST","UG"],getHandler:()=>window.__refurbLpn},{id:"clear-session",name:"\u0410\u0432\u0442\u043E-\u0441\u043A\u0430\u0441\u0443\u0439",file:"clear_session.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0441\u043A\u0430\u0441\u043E\u0432\u0443\u0454 \u0441\u0435\u0441\u0456\u044E \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456 `us` \u043D\u0430 \u043A\u043B\u0430\u0432\u0456\u0430\u0442\u0443\u0440\u0456.",getHandler:()=>window.__clearSession},{id:"gravis",name:"Gravis",file:"gravis.js",description:"\u0412 \u043F\u0440\u043E\u0446\u0435\u0441\u0456 \u0440\u043E\u0437\u0440\u043E\u0431\u043A\u0438! \u041D\u0415 \u041F\u0420\u0410\u0426\u042E\u0404!",excludeDeps:["REFURB","WHD"],experimental:!0,getHandler:()=>window.__gravis},{id:"dev-inspector",name:"Dev Inspector",file:"dev_inspector.js",description:"",experimental:!0,getHandler:()=>window.__devInspector,renderSettings:s=>{let n=window.__devInspector;if(!n||!n.getSettings)return;let a=n.getSettings();s.innerHTML=`
                            <div class="sh-settings-divider"></div>
                            <div class="sh-setting-row" style="flex-direction: column; align-items: flex-start; gap: 8px;">
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; color: #5f6368;">
                                    <input type="radio" name="dev_mode" value="html" ${a.htmlOutput?"checked":""}>
                                    \u{1F50D} HTML Output on Press
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; color: #5f6368;">
                                    <input type="radio" name="dev_mode" value="network" ${a.networkWiretap?"checked":""}>
                                    \u{1F4E1} Network Wiretap
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; color: #5f6368;">
                                    <input type="radio" name="dev_mode" value="off" ${!a.htmlOutput&&!a.networkWiretap?"checked":""}>
                                    \u274C Off
                                </label>
                            </div>
                            <div class="sh-setting-row" title="Wiretap Opacity" style="margin-top: 8px;">
                                <span class="sh-emoji">\u{1F441}\uFE0F</span>
                                <input type="range" id="sh-dev-opacity" class="sh-range" min="0.1" max="1" step="0.1" value="${a.wiretapOpacity!==void 0?a.wiretapOpacity:.9}" />
                            </div>
                        `,s.querySelectorAll('input[name="dev_mode"]').forEach(x=>{x.addEventListener("change",h=>{let d=h.target.value;d==="html"?n.updateSettings({htmlOutput:!0,networkWiretap:!1}):d==="network"?n.updateSettings({htmlOutput:!1,networkWiretap:!0}):n.updateSettings({htmlOutput:!1,networkWiretap:!1})})});let u=s.querySelector("#sh-dev-opacity");u&&u.addEventListener("input",x=>{let h=parseFloat(x.target.value);n.updateSettings({wiretapOpacity:h})})}}];async function $(s,n,a){let f=n.checked,u=s.getHandler();if(f&&!u){n.disabled=!0;let x=`${M}/${s.file}?cb=${Date.now()}`;try{let h=await fetch(x);if(!h.ok)throw new Error(`HTTP ${h.status}`);let d=await h.text(),y=document.createElement("script");y.textContent=d,document.head.appendChild(y),u=s.getHandler(),n.disabled=!1}catch(h){alert(`\u26A0\uFE0F Failed to load ${s.name}:
${h.message}`),n.checked=!1,n.disabled=!1;return}}u&&(f?(u.enable(),s.renderSettings&&a&&(a.style.display="block",s.renderSettings(a))):(u.disable(),a&&(a.style.display="none",a.innerHTML="")))}["keydown","keyup","keypress"].forEach(s=>{window.addEventListener(s,n=>{let a=n.target;a&&a.closest("#sh-root")&&n.stopPropagation()},!0)});function K(){let s="sh_panel_opacity",n=.4;try{let t=localStorage.getItem(s);if(t!==null){let i=parseFloat(t);!isNaN(i)&&i>=.1&&i<=1&&(n=i)}}catch{}let a=document.createElement("div");a.id="sh-root",a.innerHTML=`
                    <style>
                        ${G}
                    </style>
                    
                    <div id="sh-panel" style="opacity: ${n};">
                        <div class="sh-header">
                            <div class="sh-header-group">
                                <select id="sh-subdep-select" class="sh-dep-dropdown">
                                    ${k.map(t=>`<option value="${t}" ${v===t?"selected":""}>${t}</option>`).join(`
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
                `,document.body.appendChild(a);let f=document.getElementById("sh-panel"),u=document.getElementById("sh-settings-toggle-btn"),x=document.getElementById("sh-global-settings"),h=document.getElementById("sh-panel-opacity");u&&x&&u.addEventListener("click",()=>{u.classList.toggle("active"),x.classList.toggle("sh-expanded")}),h&&h.addEventListener("input",t=>{let i=t.target,o=parseFloat(i.value);f.style.opacity=o.toString();try{localStorage.setItem(s,o.toString())}catch{}});function d(){f.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(t=>t.classList.remove("sh-expanded")),x&&x.classList.remove("sh-expanded"),u&&u.classList.remove("active"),window.dispatchEvent(new CustomEvent("sh-panel-closed"))}document.addEventListener("mousedown",t=>{let i=t.target;f.classList.contains("sh-open")&&!f.contains(i)&&d()});let y=document.getElementById("sh-subdep-select");y&&y.addEventListener("change",t=>{let i=t.target;if(D(i.value)){v=i.value,localStorage.setItem(C,v);let o=E[v];if(o){if(window.__itemCounter){window.__itemCounter.updateSettings({targetRate:o.targetRate,doubleCountMode:o.doubleCountMode,scanTimeoutMs:o.scanTimeoutMs});let e=document.getElementById("sh-cfg-target");e&&(e.value=o.targetRate.toString())}else try{let e=JSON.parse(localStorage.getItem(B)||"{}");e.targetRate=o.targetRate,e.doubleCountMode=o.doubleCountMode,e.scanTimeoutMs=o.scanTimeoutMs,localStorage.setItem(B,JSON.stringify(e))}catch{}if(window.__offTask){window.__offTask.updateSettings({timeoutMins:o.offTaskMins});let e=document.getElementById("sh-ot-mins");e&&(e.value=o.offTaskMins.toString())}else try{let e=JSON.parse(localStorage.getItem(P)||"{}");e.timeoutMins=o.offTaskMins,localStorage.setItem(P,JSON.stringify(e))}catch{}}S.forEach(e=>{let r=document.getElementById(`sh-card-${e.id}`);if(r)if(e.excludeDeps?.includes(v)){r.style.display="none";let l=e.getHandler(),b=document.getElementById(`sh-chk-${e.id}`);l&&l.isActive()&&(l.disable(),b&&(b.checked=!1))}else r.style.display="block"})}}),document.addEventListener("keydown",t=>{if(t.key!=="Enter"||!window.__refurbLpnLoaded&&!window.__gravisLoaded&&!window.__clearSession)return;let i=t.target;if(!i||!i.matches("input"))return;let o=i.value?.trim();if(!o)return;let e=(i.getAttribute("aria-label")||"").toLowerCase(),r={lpnLabels:[j,z,W],wsLabels:U};try{if(r.lpnLabels.flat().some(p=>e.includes(p.toLowerCase()))&&/^lpn[a-z0-9]+/i.test(o)){localStorage.getItem(A)!==o&&(localStorage.setItem(A,o),window.__gravis?.sendLpn(o));return}if(r.wsLabels.some(p=>e.includes(p.toLowerCase()))&&/^ws[_-]+/i.test(o)){localStorage.setItem(O,o);return}}catch{}},!0);let S=F.filter(t=>!(t.experimental&&!["development","local"].includes(_)||t.isTrusted&&!w)),m=()=>{let t=document.getElementById("sh-chk-all");if(!t)return;let o=S.filter(e=>!(e.experimental||e.excludeDeps&&e.excludeDeps.includes(v))).map(e=>document.getElementById(`sh-chk-${e.id}`));t.checked=o.length>0&&o.every(e=>e&&e.checked)},g=document.getElementById("sh-list");g&&S.forEach(t=>{let i=t.getHandler(),o=i?i.isActive():!1,e=document.createElement("div");e.id=`sh-card-${t.id}`,e.className="sh-card",t.excludeDeps?.includes(v)&&(e.style.display="none"),e.innerHTML=`
                            <div class="sh-card-top">
                                <div class="sh-card-info">
                                    <div class="sh-card-title">${t.name}</div>
                                    <div class="sh-card-desc">${t.description}</div>
                                </div>
                                <label class="sh-switch">
                                    <input type="checkbox" id="sh-chk-${t.id}" ${o?"checked":""}>
                                    <span class="sh-slider"></span>
                                </label>
                            </div>
                            <div class="sh-card-settings" id="sh-settings-${t.id}"></div>
                        `,g.appendChild(e);let r=e.querySelector(`#sh-chk-${t.id}`),l=e.querySelector(`#sh-settings-${t.id}`);o&&t.renderSettings&&(l.style.display="block",t.renderSettings(l)),r&&(r.onchange=async()=>{await $(t,r,l),m()})});let c=document.getElementById("sh-chk-all");c&&c.addEventListener("change",t=>{let i=t.target.checked,o=[];S.forEach(e=>{if(e.experimental||e.excludeDeps&&e.excludeDeps.includes(v))return;let r=document.getElementById(`sh-chk-${e.id}`),l=document.getElementById(`sh-settings-${e.id}`);r&&r.checked!==i&&!r.disabled&&(r.checked=i,o.push($(e,r,l)))}),o.length>0&&(c.disabled=!0,Promise.all(o).finally(()=>{c.disabled=!1,m()}))}),m(),setTimeout(()=>{f.classList.add("sh-open")},100)}K()})()}})();

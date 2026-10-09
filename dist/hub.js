"use strict";(()=>{var N="sh_hub_dep";var B="sh_item_counter_settings",A="sh_off_task_settings";var P="sh_lpn",O="sh_work_station";var U=["Wprowad\u017A LPN"],j=["Wprowad\u017A stacj\u0119 robocz\u0105"],z=["Wprowad\u017A numer rma"],G=["Wprowad\u017A lpn lub sku"];var F=`
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
`;if(window.location.href.includes("gravis"))(async()=>{let L=window.__SH_BRANCH||"main",H=L==="local"?"http://localhost:3000/dist/hub_gravis.js":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${L}/dist/hub_gravis.js`;try{let M=await fetch(H);if(!M.ok)throw new Error(`HTTP ${M.status}`);let S=await M.text(),T=document.createElement("script");T.textContent=S,document.head.appendChild(T)}catch(M){alert(`\u26A0\uFE0F Failed to load Gravis Hub: ${M}`)}})();else if(window.__scriptHubLoaded){let L=document.getElementById("sh-panel");L&&(L.classList.contains("sh-open")?(L.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(H=>H.classList.remove("sh-expanded")),window.dispatchEvent(new CustomEvent("sh-panel-closed"))):L.classList.add("sh-open"))}else{window.__scriptHubLoaded=!0;async function L(S){let T=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(S));return Array.from(new Uint8Array(T)).map(I=>I.toString(16).padStart(2,"0")).join("")}async function H(){return new Promise(S=>{let T=Date.now(),I=async()=>{let _=document.querySelector("p.user__username");_&&_.textContent?S(await L(_.textContent.trim())):Date.now()-T>1e4?S(null):setTimeout(I,500)};I()})}let M=["24deb6961c3cef1d2e3795aaf4b7e3fe8d83d20adff06215426c05827c8351ca","710a0c6095723bc0a46d78897497b5af0417cee56708fdc10cca6860b686ea6e","bc95a4675c77e3ee07d42d825c05e403c3861d29b24ddd57c6e30ebb7a8c2336","49480808159cde937909eaad603911749197829c0cea7a8b68c29e63c98538c0","61678f96fc810a611097d9b0bc98bc8ecb0abee7cd55f2faa19b455604dc2332","2f5ae5e87d1a659e1a01e2bc2c38441bba81bb12eb39d59695b4960576012c55","004381f7f5b3ace58d7dc03a047674325acd266ddc576c273942fdb7237f7130","f355a6794c9a044989a7d2e5bc1e3aa5bff909a38adfbdc68cc0433042ea84b9"];(async()=>{let S=window.__SH_BRANCH||"main",T=!1;if(S==="local")T=!0;else{let s=await H();if(!s||(T=M.includes(s),S==="development"&&!T))return}let I=S==="local"?"http://localhost:3000/dist":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${S}/dist`,_={CRET:{targetRate:47,offTaskMins:4,doubleCountMode:!1,scanTimeoutMs:6e3},FAST:{targetRate:80,offTaskMins:10,doubleCountMode:!1,scanTimeoutMs:4e3},UG:{targetRate:47,offTaskMins:4,doubleCountMode:!0,scanTimeoutMs:6e3},REFURB:{targetRate:30,offTaskMins:10,doubleCountMode:!1,scanTimeoutMs:6e3},WHD:{targetRate:20,offTaskMins:5,doubleCountMode:!1,scanTimeoutMs:6e3}},R=new URLSearchParams(window.location.search).get("gradingMode"),k=[];R==="CRETURN_PRIMARY_GRADING"?k=["UG"]:R==="CRETURN"?k=["FAST","CRET"]:R==="CRETURN_REFURB"?k=["REFURB"]:R==="WAREHOUSE_DEALS"?k=["WHD"]:k=["FAST","CRET","UG","REFURB","WHD"];function D(s){return s==="FAST"||s==="CRET"||s==="UG"||s==="REFURB"||s==="WHD"}let C=localStorage.getItem(N),x=D(C)&&k.includes(C)?C:k[0];if(C!==x)try{localStorage.setItem(N,x)}catch{}let W=[{id:"item-counter",name:"\u0420\u0430\u0445\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u043A",file:"counter.js",description:"\u0420\u0430\u0445\u0443\u0454 \u043F\u0430\u0447\u043A\u0438, \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0445\u043E\u0432\u0430\u0442\u0438 \u0437 \u0435\u043A\u0440\u0430\u043D\u0443 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E F10. \u0412\u0438\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u0435\u0440\u0435\u0440\u0432\u0443.",getHandler:()=>window.__itemCounter,renderSettings:s=>{let n=window.__itemCounter;if(!n)return;let i=n.getSettings(),u=n.getCount(),g=_[x]?_[x].targetRate:47,E=_[x]?_[x].doubleCountMode:!1,m=_[x]?_[x].scanTimeoutMs:6e3,d=i.targetRate!==void 0?i.targetRate:g;n.updateSettings({targetRate:d,doubleCountMode:E,scanTimeoutMs:m}),s.innerHTML=`
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
                                <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${u===0?"":u}" placeholder="666" />
                            </div>
                            <div class="sh-setting-row" title="Overlay Opacity">
                                <span class="sh-emoji">\u{1F47B}</span>
                                <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${i.overlayOpacity}" />
                            </div>
                            
                            <div id="sh-adv-container-item-counter" class="sh-adv-container">
                                <div class="sh-setting-row" title="Target Rate">
                                    <span class="sh-emoji">\u{1F3AF}</span>
                                    <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${d}" placeholder="\u041D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u0430 \u043D\u043E\u0440\u043C\u0430" />
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
                        `,s.querySelectorAll(".sh-opt-btn").forEach(e=>{e.addEventListener("click",r=>{let l=r.target;s.querySelectorAll(".sh-opt-btn").forEach(p=>p.classList.remove("active")),l.classList.add("active");let v=parseInt(l.getAttribute("data-val")||"1",10);n.updateSettings({lunchBreak:v})})});let b=s.querySelector("#sh-cfg-count");b&&b.addEventListener("input",e=>{let r=e.target,l=parseInt(r.value,10);isNaN(l)&&(l=0),l<0&&(l=0,r.value="0"),n.setCount(l)});let y=s.querySelector("#sh-cfg-opacity");y&&y.addEventListener("input",e=>{let r=e.target,l=parseFloat(r.value);n.updateSettings({overlayOpacity:l})});let h=s.querySelector("#sh-cfg-target");h&&h.addEventListener("input",e=>{let r=e.target,l=parseFloat(r.value);(isNaN(l)||l<0)&&(l=0),n.updateSettings({targetRate:l})});let f=s.querySelector("#sh-cfg-start-time"),c=s.querySelector("#sh-btn-start-now"),t=s.querySelector("#sh-btn-start-reset");f&&c&&t&&(f.addEventListener("input",e=>{let r=e.target,l=e,v=r.value.replace(/\D/g,"").split(""),p="";if(v.length>0){let w=v.shift();w>="3"?p+="0"+w:p+=w}if(v.length>0&&p.length===1){let w=v.shift();p[0]==="2"&&w>="4"?(p="0"+p[0],v.unshift(w)):p+=w}if(p.length===2&&(v.length>0||l.inputType!=="deleteContentBackward"||r.value.endsWith(":"))&&(p+=":"),v.length>0){let w=v.shift();w>="6"?p+="0"+w:p+=w}if(v.length>0&&p.length===4){let w=v.shift();p+=w}r.value=p,p.length===5&&p.match(/^\d{2}:\d{2}$/)?n.updateSettings({customStartTime:p}):p===""&&n.updateSettings({customStartTime:null})}),c.addEventListener("click",()=>{let e=new Date,r=String(e.getHours()).padStart(2,"0"),l=String(e.getMinutes()).padStart(2,"0"),v=`${r}:${l}`;f.value=v,n.updateSettings({customStartTime:v})}),t.addEventListener("click",()=>{f.value="",n.updateSettings({customStartTime:null})}));let a=s.querySelector("#sh-adv-btn-item-counter"),o=s.querySelector("#sh-adv-container-item-counter");a&&o&&a.addEventListener("click",()=>{o.classList.toggle("sh-expanded")})}},{id:"off-task",name:"\u0410\u0432\u0442\u043E-\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044F (Off-Task)",file:"off_task.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u0438\u0431\u0438\u0432\u0430\u0454 \u0434\u043E \u0442\u043E\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441.",getHandler:()=>window.__offTask,renderSettings:s=>{let n=window.__offTask;if(!n)return;let i=_[x].offTaskMins,u=n.getSettings(),g=u.timeoutMins!==void 0?u.timeoutMins:i,E=u.toteBarcode||"";u.timeoutMins===void 0&&n.updateSettings({timeoutMins:i}),s.innerHTML=`
                            <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                                <span class="sh-emoji" title="\u0422\u0430\u0440\u0430">\u{1F4E6}</span>
                                <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${E}" placeholder="ts... (\u043F\u0443\u0441\u0442\u043E=\u0432\u0438\u043C\u043A)" autocomplete="off">
                                <span class="sh-emoji" title="\u0425\u0432\u0438\u043B\u0438\u043D\u0438">\u23F1\uFE0F</span>
                                <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${g}" title="\u0422\u0430\u0439\u043C\u0435\u0440">
                            </div>
                        `;let m=s.querySelector("#sh-ot-tote"),d=s.querySelector("#sh-ot-mins");m.addEventListener("input",f=>{let c=f.target.value.trim();n.updateSettings({toteBarcode:c}),c||(d.value=n.getSettings().timeoutMins?.toString()||i.toString())}),d.addEventListener("change",f=>{let c=f.target.value.trim(),t=i;if(c.includes(":")){let a=c.split(":");t=parseInt(a[0]||"0",10)+parseInt(a[1]||"0",10)/60}else{let a=parseFloat(c);!isNaN(a)&&a>0&&(t=a)}n.updateSettings({timeoutMins:t})}),d.addEventListener("keydown",f=>{f.key==="Enter"&&d.blur()});let b=()=>{document.activeElement!==m&&(m.value=n.getSettings().toteBarcode||""),document.activeElement!==d&&(d.value=n.getSettings().timeoutMins?.toString()||i.toString(),d.style.color="")},y=f=>{if(document.activeElement===d||!n.getSettings().toteBarcode)return;let c=Math.ceil(f.detail.remainingMs/1e3),t=Math.floor(c/60),a=String(c%60).padStart(2,"0");d.value=`${t}:${a}`,d.style.color=c<=30?"#d93025":"#1a73e8",d.style.fontWeight="bold"};s._abortController&&s._abortController.abort();let h=new AbortController;s._abortController=h,window.addEventListener("sh-offtask-update",b,{signal:h.signal}),window.addEventListener("sh-offtask-tick",y,{signal:h.signal})},isTrusted:!0},{id:"binds",name:"\u0411\u0456\u043D\u0434\u0438",file:"binds.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u043E\u043A\u043B\u0456\u043A\u0443\u0454 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456.<br>\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u043D\u0430 F-\u043A\u043D\u043E\u043F\u043A\u0443 \u0434\u043B\u044F \u0437\u0430\u043F\u0438\u0441\u0443(\u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E F9 \u0456 F1-F7) \u0430\u0431\u043E \u043D\u0430 \u0441\u043B\u043E\u0432\u043E, \u0449\u043E\u0431 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0439\u043E\u0433\u043E.",getHandler:()=>window.__binds,renderSettings:s=>{let n=window.__binds;if(!n)return;let i=JSON.parse(JSON.stringify(n.getShortcuts()));s._abortController&&s._abortController.abort();let u=new AbortController;s._abortController=u,window.addEventListener("sh-binds-update",()=>{i=JSON.parse(JSON.stringify(n.getShortcuts())),g()},{signal:u.signal});let g=()=>{let E=Object.keys(i),m=n.getRecordingKey(),d="";E.length>0?d=E.map(h=>{let f=i[h],c=m===h,t=f.map((e,r)=>{let l=e.split(/\s+/).slice(0,2).join(" ");return`<span class="sh-bind-del-word" data-key="${h}" data-idx="${r}" title="\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438: ${e}">${l}</span>`}).join(' <span class="sh-arrow">\u2794</span> '),a=f.length>0?t:c?"<i>\u0417\u0430\u043F\u0438\u0441...</i>":"";return`
                                        <div class="sh-bind-row">
                                            <div class="${c?"sh-bind-key sh-recording":"sh-bind-key"}" data-key="${h}" title="\u0417\u0430\u043F\u0438\u0441 / \u0417\u0443\u043F\u0438\u043D\u043A\u0430">${h}</div>
                                            <div class="sh-bind-action">${a}</div>
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
                            `,s.querySelectorAll(".sh-bind-key").forEach(h=>{h.addEventListener("click",f=>{let t=f.target.getAttribute("data-key");t&&(n.getRecordingKey()===t?n.stopRecording():n.startRecording(t))})}),s.querySelectorAll(".sh-bind-del-word").forEach(h=>{h.addEventListener("click",f=>{let c=f.target,t=c.getAttribute("data-key"),a=c.getAttribute("data-idx");if(t&&a!==null&&!m){let o=parseInt(a,10);i[t].splice(o,1),n.updateShortcuts(i),g()}})});let b=s.querySelector("#sh-adv-btn-binds"),y=s.querySelector("#sh-adv-container-binds");b&&y&&b.addEventListener("click",()=>{y.classList.toggle("sh-expanded")})};g()}},{id:"auto-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn.js",description:'\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 "\u043F\u0435\u0440\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 LPN" \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456 LPN \u0430\u0431\u043E \u0431\u0443\u0434\u044C-\u0447\u043E\u0433\u043E \u0456\u043D\u0448\u043E\u0433\u043E, \u043E\u043A\u0440\u0456\u043C \u0442\u043E\u0442\u0430',excludeDeps:["REFURB","WHD"],getHandler:()=>window.__autoLpn},{id:"refurb-lpn",name:"A\u0432\u0442\u043E-LPN",file:"auto_lpn_refurb.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0437\u0430\u043F\u043E\u0432\u043D\u044E\u0454 \u0441\u0442\u0430\u0440\u0443 LPN",excludeDeps:["CRET","FAST","UG"],getHandler:()=>window.__refurbLpn},{id:"clear-session",name:"\u0410\u0432\u0442\u043E-\u0441\u043A\u0430\u0441\u0443\u0439",file:"clear_session.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0441\u043A\u0430\u0441\u043E\u0432\u0443\u0454 \u0441\u0435\u0441\u0456\u044E \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456 `us` \u043D\u0430 \u043A\u043B\u0430\u0432\u0456\u0430\u0442\u0443\u0440\u0456",getHandler:()=>window.__clearSession},{id:"gravis",name:"Gravis",file:"gravis.js",description:"\u0412 \u043F\u0440\u043E\u0446\u0435\u0441\u0456 \u0440\u043E\u0437\u0440\u043E\u0431\u043A\u0438! \u041D\u0415 \u041F\u0420\u0410\u0426\u042E\u0404!",excludeDeps:["REFURB","WHD"],experimental:!0,getHandler:()=>window.__gravis},{id:"dev-inspector",name:"Dev Inspector",file:"dev_inspector.js",description:"",experimental:!0,getHandler:()=>window.__devInspector,renderSettings:s=>{let n=window.__devInspector;if(!n||!n.getSettings)return;let i=n.getSettings(),u=(g,E,m)=>{let d=document.createElement("div");Object.assign(d.style,{display:"flex",alignItems:"center",marginBottom:"8px"});let b=document.createElement("input");b.type="checkbox",b.id=g,b.checked=i[m],b.style.marginRight="8px";let y=document.createElement("label");return y.htmlFor=g,y.textContent=E,Object.assign(y.style,{fontSize:"13px",color:"#aab7c4",cursor:"pointer"}),b.addEventListener("change",h=>{n.updateSettings({[m]:h.target.checked})}),d.appendChild(b),d.appendChild(y),d};s.appendChild(u("sh-dev-details","Show Element Details","showDetails")),s.appendChild(u("sh-dev-css","Show Element CSS","showCSS")),s.appendChild(u("sh-dev-coords","Show Click Coordinates","showCoords"))}}];async function $(s,n,i){let u=n.checked,g=s.getHandler();if(u&&!g){n.disabled=!0;let E=`${I}/${s.file}?cb=${Date.now()}`;try{let m=await fetch(E);if(!m.ok)throw new Error(`HTTP ${m.status}`);let d=await m.text(),b=document.createElement("script");b.textContent=d,document.head.appendChild(b),g=s.getHandler(),n.disabled=!1}catch(m){alert(`\u26A0\uFE0F Failed to load ${s.name}:
${m.message}`),n.checked=!1,n.disabled=!1;return}}g&&(u?(g.enable(),s.renderSettings&&i&&(i.style.display="block",s.renderSettings(i))):(g.disable(),i&&(i.style.display="none",i.innerHTML="")))}["keydown","keyup","keypress"].forEach(s=>{window.addEventListener(s,n=>{let i=n.target;i&&i.closest("#sh-root")&&n.stopPropagation()},!0)});function K(){let s="sh_panel_opacity",n=.4;try{let t=localStorage.getItem(s);if(t!==null){let a=parseFloat(t);!isNaN(a)&&a>=.1&&a<=1&&(n=a)}}catch{}let i=document.createElement("div");i.id="sh-root",i.innerHTML=`
                    <style>
                        ${F}
                    </style>
                    
                    <div id="sh-panel" style="opacity: ${n};">
                        <div class="sh-header">
                            <div class="sh-header-group">
                                <select id="sh-subdep-select" class="sh-dep-dropdown">
                                    ${k.map(t=>`<option value="${t}" ${x===t?"selected":""}>${t}</option>`).join(`
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
                `,document.body.appendChild(i);let u=document.getElementById("sh-panel"),g=document.getElementById("sh-settings-toggle-btn"),E=document.getElementById("sh-global-settings"),m=document.getElementById("sh-panel-opacity");g&&E&&g.addEventListener("click",()=>{g.classList.toggle("active"),E.classList.toggle("sh-expanded")}),m&&m.addEventListener("input",t=>{let a=t.target,o=parseFloat(a.value);u.style.opacity=o.toString();try{localStorage.setItem(s,o.toString())}catch{}});function d(){u.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(t=>t.classList.remove("sh-expanded")),E&&E.classList.remove("sh-expanded"),g&&g.classList.remove("active"),window.dispatchEvent(new CustomEvent("sh-panel-closed"))}document.addEventListener("mousedown",t=>{let a=t.target;u.classList.contains("sh-open")&&!u.contains(a)&&d()});let b=document.getElementById("sh-subdep-select");b&&b.addEventListener("change",t=>{let a=t.target;if(D(a.value)){x=a.value,localStorage.setItem(N,x);let o=_[x];if(o){if(window.__itemCounter){window.__itemCounter.updateSettings({targetRate:o.targetRate,doubleCountMode:o.doubleCountMode,scanTimeoutMs:o.scanTimeoutMs});let e=document.getElementById("sh-cfg-target");e&&(e.value=o.targetRate.toString())}else try{let e=JSON.parse(localStorage.getItem(B)||"{}");e.targetRate=o.targetRate,e.doubleCountMode=o.doubleCountMode,e.scanTimeoutMs=o.scanTimeoutMs,localStorage.setItem(B,JSON.stringify(e))}catch{}if(window.__offTask){window.__offTask.updateSettings({timeoutMins:o.offTaskMins});let e=document.getElementById("sh-ot-mins");e&&(e.value=o.offTaskMins.toString())}else try{let e=JSON.parse(localStorage.getItem(A)||"{}");e.timeoutMins=o.offTaskMins,localStorage.setItem(A,JSON.stringify(e))}catch{}}y.forEach(e=>{let r=document.getElementById(`sh-card-${e.id}`);if(r)if(e.excludeDeps?.includes(x)){r.style.display="none";let l=e.getHandler(),v=document.getElementById(`sh-chk-${e.id}`);l&&l.isActive()&&(l.disable(),v&&(v.checked=!1))}else r.style.display="block"})}}),document.addEventListener("keydown",t=>{if(t.key!=="Enter"||!window.__refurbLpnLoaded&&!window.__gravisLoaded&&!window.__clearSession)return;let a=t.target;if(!a||!a.matches("input"))return;let o=a.value?.trim();if(!o)return;let e=(a.getAttribute("aria-label")||"").toLowerCase(),r={lpnLabels:[z,G,U],wsLabels:j};try{if(r.lpnLabels.flat().some(p=>e.includes(p.toLowerCase()))&&/^lpn[a-z0-9]+/i.test(o)){localStorage.getItem(P)!==o&&(localStorage.setItem(P,o),window.__gravis?.sendLpn(o));return}if(r.wsLabels.some(p=>e.includes(p.toLowerCase()))&&/^ws[_-]+/i.test(o)){localStorage.setItem(O,o);return}}catch{}},!0);let y=W.filter(t=>!(t.experimental&&!["development","local"].includes(S)||t.isTrusted&&!T)),h=()=>{let t=document.getElementById("sh-chk-all");if(!t)return;let o=y.filter(e=>!(e.experimental||e.excludeDeps&&e.excludeDeps.includes(x))).map(e=>document.getElementById(`sh-chk-${e.id}`));t.checked=o.length>0&&o.every(e=>e&&e.checked)},f=document.getElementById("sh-list");f&&y.forEach(t=>{let a=t.getHandler(),o=a?a.isActive():!1,e=document.createElement("div");e.id=`sh-card-${t.id}`,e.className="sh-card",t.excludeDeps?.includes(x)&&(e.style.display="none"),e.innerHTML=`
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
                        `,f.appendChild(e);let r=e.querySelector(`#sh-chk-${t.id}`),l=e.querySelector(`#sh-settings-${t.id}`);o&&t.renderSettings&&(l.style.display="block",t.renderSettings(l)),r&&(r.onchange=async()=>{await $(t,r,l),h()})});let c=document.getElementById("sh-chk-all");c&&c.addEventListener("change",t=>{let a=t.target.checked,o=[];y.forEach(e=>{if(e.experimental||e.excludeDeps&&e.excludeDeps.includes(x))return;let r=document.getElementById(`sh-chk-${e.id}`),l=document.getElementById(`sh-settings-${e.id}`);r&&r.checked!==a&&!r.disabled&&(r.checked=a,o.push($(e,r,l)))}),o.length>0&&(c.disabled=!0,Promise.all(o).finally(()=>{c.disabled=!1,h()}))}),h(),setTimeout(()=>{u.classList.add("sh-open")},100)}K()})()}})();

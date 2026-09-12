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
    /* Click-to-delete styling */
    .sh-bind-del-word { cursor: pointer; transition: color 0.2s, text-decoration 0.2s; }
    .sh-bind-del-word:hover { color: #d93025; text-decoration: line-through; }
    /* F-Key Interactions */
    .sh-bind-key { cursor: pointer; transition: background 0.2s, color 0.2s, border-color 0.2s; }
    .sh-bind-key:hover { background: #d2e3fc; color: #174ea6; }
    .sh-bind-key.sh-recording { background: #fce8e6 !important; color: #d93025 !important; border-color: #d93025 !important; }
`;if(window.__scriptHubLoaded){let L=document.getElementById("sh-panel");L&&(L.classList.contains("sh-open")?(L.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(_=>_.classList.remove("sh-expanded")),window.dispatchEvent(new CustomEvent("sh-panel-closed"))):L.classList.add("sh-open"))}else{window.__scriptHubLoaded=!0;async function L(w){let S=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(w));return Array.from(new Uint8Array(S)).map(k=>k.toString(16).padStart(2,"0")).join("")}async function _(){return new Promise(w=>{let S=async()=>{let k=document.querySelector("p.user__username");k&&k.textContent?w(await L(k.textContent.trim())):setTimeout(S,500)};S()})}let B=["24deb6961c3cef1d2e3795aaf4b7e3fe8d83d20adff06215426c05827c8351ca","710a0c6095723bc0a46d78897497b5af0417cee56708fdc10cca6860b686ea6e"];(async()=>{let w=window.__SH_BRANCH||"main",S=!1;if(w==="local")S=!0;else{let s=await _();if(S=s?B.includes(s):!1,w==="development"&&!S)return}let k=w==="local"?"http://localhost:3000/dist":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${w}/dist`,M={FAST:{targetRate:100,offTaskMins:10,doubleCountMode:!1},CRET:{targetRate:47,offTaskMins:4,doubleCountMode:!1},UG:{targetRate:47,offTaskMins:4,doubleCountMode:!0},REFURB:{targetRate:30,offTaskMins:10,doubleCountMode:!1}},H=new URLSearchParams(window.location.search).get("gradingMode"),T=[];H==="CRETURN_PRIMARY_GRADING"?T=["UG"]:H==="CRETURN"?T=["FAST","CRET"]:H==="CRETURN_REFURB"?T=["REFURB"]:T=["FAST","CRET","UG","REFURB"];function R(s){return s==="FAST"||s==="CRET"||s==="UG"||s==="REFURB"}let I=localStorage.getItem("sh_hub_dep"),b=R(I)&&T.includes(I)?I:T[0];if(I!==b)try{localStorage.setItem("sh_hub_dep",b)}catch{}let A=[{id:"item-counter",name:"\u0420\u0430\u0445\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u043A",file:"counter.js",description:"\u0420\u0430\u0445\u0443\u0454 \u043F\u0430\u0447\u043A\u0438, \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0445\u043E\u0432\u0430\u0442\u0438 \u0437 \u0435\u043A\u0440\u0430\u043D\u0443 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E F10. \u0412\u0438\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u0435\u0440\u0435\u0440\u0432\u0443.",getHandler:()=>window.__itemCounter,renderSettings:s=>{let n=window.__itemCounter;if(!n)return;let i=n.getSettings(),g=n.getCount(),f=M[b]?M[b].targetRate:47,v=M[b]?M[b].doubleCountMode:!1,m=i.targetRate!==void 0?i.targetRate:f;n.updateSettings({targetRate:m,doubleCountMode:v}),s.innerHTML=`
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
                    `,s.querySelectorAll(".sh-opt-btn").forEach(a=>{a.addEventListener("click",e=>{let o=e.target;s.querySelectorAll(".sh-opt-btn").forEach(d=>d.classList.remove("active")),o.classList.add("active");let l=parseInt(o.getAttribute("data-val")||"1",10);n.updateSettings({lunchBreak:l})})});let p=s.querySelector("#sh-cfg-count");p&&p.addEventListener("input",a=>{let e=a.target,o=parseInt(e.value,10);isNaN(o)&&(o=0),o<0&&(o=0,e.value="0"),n.setCount(o)});let x=s.querySelector("#sh-cfg-opacity");x&&x.addEventListener("input",a=>{let e=a.target,o=parseFloat(e.value);n.updateSettings({overlayOpacity:o})});let E=s.querySelector("#sh-cfg-target");E&&E.addEventListener("input",a=>{let e=a.target,o=parseFloat(e.value);(isNaN(o)||o<0)&&(o=0),n.updateSettings({targetRate:o})});let u=s.querySelector("#sh-cfg-start-time"),h=s.querySelector("#sh-btn-start-now"),c=s.querySelector("#sh-btn-start-reset");u&&h&&c&&(u.addEventListener("input",a=>{let e=a.target,o=a,l=e.value.replace(/\D/g,"").split(""),d="";if(l.length>0){let y=l.shift();y>="3"?d+="0"+y:d+=y}if(l.length>0&&d.length===1){let y=l.shift();d[0]==="2"&&y>="4"?(d="0"+d[0],l.unshift(y)):d+=y}if(d.length===2&&(l.length>0||o.inputType!=="deleteContentBackward"||e.value.endsWith(":"))&&(d+=":"),l.length>0){let y=l.shift();y>="6"?d+="0"+y:d+=y}if(l.length>0&&d.length===4){let y=l.shift();d+=y}e.value=d,d.length===5&&d.match(/^\d{2}:\d{2}$/)?n.updateSettings({customStartTime:d}):d===""&&n.updateSettings({customStartTime:null})}),h.addEventListener("click",()=>{let a=new Date,e=String(a.getHours()).padStart(2,"0"),o=String(a.getMinutes()).padStart(2,"0"),l=`${e}:${o}`;u.value=l,n.updateSettings({customStartTime:l})}),c.addEventListener("click",()=>{u.value="",n.updateSettings({customStartTime:null})}));let t=s.querySelector("#sh-adv-btn-item-counter"),r=s.querySelector("#sh-adv-container-item-counter");t&&r&&t.addEventListener("click",()=>{r.classList.toggle("sh-expanded")})}},{id:"off-task",name:"\u0410\u0432\u0442\u043E-\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044F (Off-Task)",file:"off_task.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u0438\u0431\u0438\u0432\u0430\u0454 \u0434\u043E \u0442\u043E\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441.",getHandler:()=>window.__offTask,renderSettings:s=>{let n=window.__offTask;if(!n)return;let i=M[b].offTaskMins,g=n.getSettings(),f=g.timeoutMins!==void 0?g.timeoutMins:i,v=g.toteBarcode||"";g.timeoutMins===void 0&&n.updateSettings({timeoutMins:i}),s.innerHTML=`
                        <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                            <span class="sh-emoji" title="\u0422\u0430\u0440\u0430">\u{1F4E6}</span>
                            <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${v}" placeholder="ts... (\u043F\u0443\u0441\u0442\u043E=\u0432\u0438\u043C\u043A)" autocomplete="off">
                            <span class="sh-emoji" title="\u0425\u0432\u0438\u043B\u0438\u043D\u0438">\u23F1\uFE0F</span>
                            <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${f}" title="\u0422\u0430\u0439\u043C\u0435\u0440">
                        </div>
                    `;let m=s.querySelector("#sh-ot-tote"),p=s.querySelector("#sh-ot-mins");m.addEventListener("input",h=>{let c=h.target.value.trim();n.updateSettings({toteBarcode:c}),c||(p.value=n.getSettings().timeoutMins?.toString()||i.toString())}),p.addEventListener("change",h=>{let c=h.target.value.trim(),t=i;if(c.includes(":")){let r=c.split(":");t=parseInt(r[0]||"0",10)+parseInt(r[1]||"0",10)/60}else{let r=parseFloat(c);!isNaN(r)&&r>0&&(t=r)}n.updateSettings({timeoutMins:t})}),p.addEventListener("keydown",h=>{h.key==="Enter"&&p.blur()});let x=()=>{document.activeElement!==m&&(m.value=n.getSettings().toteBarcode||""),document.activeElement!==p&&(p.value=n.getSettings().timeoutMins?.toString()||i.toString(),p.style.color="")},E=h=>{if(document.activeElement===p||!n.getSettings().toteBarcode)return;let c=Math.ceil(h.detail.remainingMs/1e3),t=Math.floor(c/60),r=String(c%60).padStart(2,"0");p.value=`${t}:${r}`,p.style.color=c<=30?"#d93025":"#1a73e8",p.style.fontWeight="bold"};s._abortController&&s._abortController.abort();let u=new AbortController;s._abortController=u,window.addEventListener("sh-offtask-update",x,{signal:u.signal}),window.addEventListener("sh-offtask-tick",E,{signal:u.signal})},isTrusted:!0},{id:"binds",name:"\u0411\u0456\u043D\u0434\u0438",file:"binds.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u043E\u043A\u043B\u0456\u043A\u0443\u0454 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456.<br>\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u043D\u0430 F-\u043A\u043D\u043E\u043F\u043A\u0443 \u0434\u043B\u044F \u0437\u0430\u043F\u0438\u0441\u0443(\u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E F9 \u0456 F1-F7) \u0430\u0431\u043E \u043D\u0430 \u0441\u043B\u043E\u0432\u043E, \u0449\u043E\u0431 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0439\u043E\u0433\u043E.",getHandler:()=>window.__binds,renderSettings:s=>{let n=window.__binds;if(!n)return;let i=JSON.parse(JSON.stringify(n.getShortcuts()));s._abortController&&s._abortController.abort();let g=new AbortController;s._abortController=g,window.addEventListener("sh-binds-update",()=>{i=JSON.parse(JSON.stringify(n.getShortcuts())),f()},{signal:g.signal});let f=()=>{let v=Object.keys(i),m=n.getRecordingKey(),p="";v.length>0?p=v.map(u=>{let h=i[u],c=m===u,t=h.map((e,o)=>{let l=e.split(/\s+/).slice(0,2).join(" ");return`<span class="sh-bind-del-word" data-key="${u}" data-idx="${o}" title="\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438: ${e}">${l}</span>`}).join(' <span class="sh-arrow">\u2794</span> '),r=h.length>0?t:c?"<i>\u0417\u0430\u043F\u0438\u0441...</i>":"";return`
                                    <div class="sh-bind-row">
                                        <div class="${c?"sh-bind-key sh-recording":"sh-bind-key"}" data-key="${u}" title="\u0417\u0430\u043F\u0438\u0441 / \u0417\u0443\u043F\u0438\u043D\u043A\u0430">${u}</div>
                                        <div class="sh-bind-action">${r}</div>
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
                        `,s.querySelectorAll(".sh-bind-key").forEach(u=>{u.addEventListener("click",h=>{let t=h.target.getAttribute("data-key");t&&(n.getRecordingKey()===t?n.stopRecording():n.startRecording(t))})}),s.querySelectorAll(".sh-bind-del-word").forEach(u=>{u.addEventListener("click",h=>{let c=h.target,t=c.getAttribute("data-key"),r=c.getAttribute("data-idx");if(t&&r!==null&&!m){let a=parseInt(r,10);i[t].splice(a,1),n.updateShortcuts(i),f()}})});let x=s.querySelector("#sh-adv-btn-binds"),E=s.querySelector("#sh-adv-container-binds");x&&E&&x.addEventListener("click",()=>{E.classList.toggle("sh-expanded")})};f()}},{id:"auto-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn.js",description:'\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 "\u043F\u0435\u0440\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 LPN" \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456 LPN \u0430\u0431\u043E \u0431\u0443\u0434\u044C-\u0447\u043E\u0433\u043E \u0456\u043D\u0448\u043E\u0433\u043E, \u043E\u043A\u0440\u0456\u043C \u0442\u043E\u0442\u0430',excludeDeps:["REFURB"],getHandler:()=>window.__autoLpn},{id:"dev-inspector",name:"Dev Inspector",file:"dev_inspector.js",description:"\u041A\u043B\u0456\u043A\u043D\u0456\u0442\u044C \u043D\u0430 \u0431\u0443\u0434\u044C-\u044F\u043A\u0438\u0439 \u0435\u043B\u0435\u043C\u0435\u043D\u0442, \u0449\u043E\u0431 \u043F\u043E\u0431\u0430\u0447\u0438\u0442\u0438 \u0439\u043E\u0433\u043E HTML (\u0422\u0456\u043B\u044C\u043A\u0438 \u0434\u043B\u044F \u0440\u043E\u0437\u0440\u043E\u0431\u043A\u0438).",getHandler:()=>window.__devInspector,experimental:!0}];async function C(s,n,i){let g=n.checked,f=s.getHandler();if(g&&!f){n.disabled=!0;let v=`${k}/${s.file}?cb=${Date.now()}`;try{let m=await fetch(v);if(!m.ok)throw new Error(`HTTP ${m.status}`);let p=await m.text(),x=document.createElement("script");x.textContent=p,document.head.appendChild(x),f=s.getHandler(),n.disabled=!1}catch(m){alert(`\u26A0\uFE0F Failed to load ${s.name}:
${m.message}`),n.checked=!1,n.disabled=!1;return}}f&&(g?(f.enable(),s.renderSettings&&i&&(i.style.display="block",s.renderSettings(i))):(f.disable(),i&&(i.style.display="none",i.innerHTML="")))}["keydown","keyup","keypress"].forEach(s=>{window.addEventListener(s,n=>{let i=n.target;i&&i.closest("#sh-root")&&n.stopPropagation()},!0)});function N(){let s="sh_panel_opacity",n=.4;try{let t=localStorage.getItem(s);if(t!==null){let r=parseFloat(t);!isNaN(r)&&r>=.1&&r<=1&&(n=r)}}catch{}let i=document.createElement("div");i.id="sh-root",i.innerHTML=`
                <style>
                    ${$}
                </style>
                
                <div id="sh-panel" style="opacity: ${n};">
                    <div class="sh-header">
                        <div class="sh-header-group">
                            <select id="sh-subdep-select" class="sh-dep-dropdown">
                                ${T.map(t=>`<option value="${t}" ${b===t?"selected":""}>${t}</option>`).join(`
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
            `,document.body.appendChild(i);let g=document.getElementById("sh-panel"),f=document.getElementById("sh-settings-toggle-btn"),v=document.getElementById("sh-global-settings"),m=document.getElementById("sh-panel-opacity");f&&v&&f.addEventListener("click",()=>{f.classList.toggle("active"),v.classList.toggle("sh-expanded")}),m&&m.addEventListener("input",t=>{let r=t.target,a=parseFloat(r.value);g.style.opacity=a.toString();try{localStorage.setItem(s,a.toString())}catch{}});function p(){g.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(t=>t.classList.remove("sh-expanded")),v&&v.classList.remove("sh-expanded"),f&&f.classList.remove("active"),window.dispatchEvent(new CustomEvent("sh-panel-closed"))}document.addEventListener("mousedown",t=>{let r=t.target;g.classList.contains("sh-open")&&!g.contains(r)&&p()});let x=document.getElementById("sh-subdep-select");x&&x.addEventListener("change",t=>{let r=t.target;if(R(r.value)){b=r.value,localStorage.setItem("sh_hub_dep",b);let a=M[b];if(a){if(window.__itemCounter){window.__itemCounter.updateSettings({targetRate:a.targetRate,doubleCountMode:a.doubleCountMode});let e=document.getElementById("sh-cfg-target");e&&(e.value=a.targetRate.toString())}else try{let e=JSON.parse(localStorage.getItem("sh_item_counter_settings")||"{}");e.targetRate=a.targetRate,e.doubleCountMode=a.doubleCountMode,localStorage.setItem("sh_item_counter_settings",JSON.stringify(e))}catch{}if(window.__offTask){window.__offTask.updateSettings({timeoutMins:a.offTaskMins});let e=document.getElementById("sh-ot-mins");e&&(e.value=a.offTaskMins.toString())}else try{let e=JSON.parse(localStorage.getItem("sh_off_task_settings")||"{}");e.timeoutMins=a.offTaskMins,localStorage.setItem("sh_off_task_settings",JSON.stringify(e))}catch{}}E.forEach(e=>{let o=document.getElementById(`sh-card-${e.id}`);if(o)if(e.excludeDeps?.includes(b)){o.style.display="none";let l=e.getHandler(),d=document.getElementById(`sh-chk-${e.id}`);l&&l.isActive()&&(l.disable(),d&&(d.checked=!1))}else o.style.display="block"})}});let E=A.filter(t=>!(t.experimental&&!["development","local"].includes(w)||t.isTrusted&&!S)),u=()=>{let t=document.getElementById("sh-chk-all");if(!t)return;let a=E.filter(e=>!e.experimental&&!e.isTrusted).map(e=>document.getElementById(`sh-chk-${e.id}`));t.checked=a.length>0&&a.every(e=>e&&e.checked)},h=document.getElementById("sh-list");h&&E.forEach(t=>{let r=t.getHandler(),a=r?r.isActive():!1,e=document.createElement("div");e.id=`sh-card-${t.id}`,e.className="sh-card",t.excludeDeps?.includes(b)&&(e.style.display="none"),e.innerHTML=`
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
                    `,h.appendChild(e);let o=e.querySelector(`#sh-chk-${t.id}`),l=e.querySelector(`#sh-settings-${t.id}`);a&&t.renderSettings&&(l.style.display="block",t.renderSettings(l)),o&&(o.onchange=async()=>{await C(t,o,l),u()})});let c=document.getElementById("sh-chk-all");c&&c.addEventListener("change",async t=>{let a=t.target.checked,e=[];E.forEach(o=>{if(o.experimental)return;let l=document.getElementById(`sh-chk-${o.id}`),d=document.getElementById(`sh-settings-${o.id}`);l&&l.checked!==a&&!l.disabled&&(l.checked=a,e.push(C(o,l,d)))}),await Promise.all(e),u()}),u(),setTimeout(()=>{g.classList.add("sh-open")},100)}N()})()}})();

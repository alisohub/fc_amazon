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
`;if(window.__scriptHubLoaded){let H=document.getElementById("sh-panel");H&&(H.classList.contains("sh-open")?(H.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(R=>R.classList.remove("sh-expanded")),window.dispatchEvent(new CustomEvent("sh-panel-closed"))):H.classList.add("sh-open"))}else{window.__scriptHubLoaded=!0;async function H(w){let T=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(w));return Array.from(new Uint8Array(T)).map(M=>M.toString(16).padStart(2,"0")).join("")}async function R(){return new Promise(w=>{let T=async()=>{let M=document.querySelector("p.user__username");M&&M.textContent?w(await H(M.textContent.trim())):setTimeout(T,500)};T()})}let D=["24deb6961c3cef1d2e3795aaf4b7e3fe8d83d20adff06215426c05827c8351ca","710a0c6095723bc0a46d78897497b5af0417cee56708fdc10cca6860b686ea6e","bc95a4675c77e3ee07d42d825c05e403c3861d29b24ddd57c6e30ebb7a8c2336","49480808159cde937909eaad603911749197829c0cea7a8b68c29e63c98538c0","61678f96fc810a611097d9b0bc98bc8ecb0abee7cd55f2faa19b455604dc2332","2f5ae5e87d1a659e1a01e2bc2c38441bba81bb12eb39d59695b4960576012c55","004381f7f5b3ace58d7dc03a047674325acd266ddc576c273942fdb7237f7130","f355a6794c9a044989a7d2e5bc1e3aa5bff909a38adfbdc68cc0433042ea84b9"];(async()=>{let w=window.__SH_BRANCH||"main",T=!1;if(w==="local")T=!0;else{let t=await R();if(T=t?D.includes(t):!1,w==="development"&&!T)return}let M=w==="local"?"http://localhost:3000/dist":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${w}/dist`,k={CRET:{targetRate:47,offTaskMins:4,doubleCountMode:!1,scanTimeoutMs:6e3},FAST:{targetRate:100,offTaskMins:10,doubleCountMode:!1,scanTimeoutMs:4e3},UG:{targetRate:47,offTaskMins:4,doubleCountMode:!0,scanTimeoutMs:6e3},REFURB:{targetRate:30,offTaskMins:10,doubleCountMode:!1,scanTimeoutMs:6e3},WHD:{targetRate:20,offTaskMins:5,doubleCountMode:!1,scanTimeoutMs:6e3}},I=new URLSearchParams(window.location.search).get("gradingMode"),L=[];I==="CRETURN_PRIMARY_GRADING"?L=["UG"]:I==="CRETURN"?L=["FAST","CRET"]:I==="CRETURN_REFURB"?L=["REFURB"]:I==="WAREHOUSE_DEALS"?L=["WHD"]:L=["FAST","CRET","UG","REFURB","WHD"];function C(t){return t==="FAST"||t==="CRET"||t==="UG"||t==="REFURB"||t==="WHD"}let _=localStorage.getItem("sh_hub_dep"),v=C(_)&&L.includes(_)?_:L[0];if(_!==v)try{localStorage.setItem("sh_hub_dep",v)}catch{}let A=[{id:"item-counter",name:"\u0420\u0430\u0445\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u043A",file:"counter.js",description:"\u0420\u0430\u0445\u0443\u0454 \u043F\u0430\u0447\u043A\u0438, \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0445\u043E\u0432\u0430\u0442\u0438 \u0437 \u0435\u043A\u0440\u0430\u043D\u0443 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E F10. \u0412\u0438\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u0435\u0440\u0435\u0440\u0432\u0443.",getHandler:()=>window.__itemCounter,renderSettings:t=>{let a=window.__itemCounter;if(!a)return;let o=a.getSettings(),f=a.getCount(),m=k[v]?k[v].targetRate:47,x=k[v]?k[v].doubleCountMode:!1,b=k[v]?k[v].scanTimeoutMs:6e3,p=o.targetRate!==void 0?o.targetRate:m;a.updateSettings({targetRate:p,doubleCountMode:x,scanTimeoutMs:b}),t.innerHTML=`
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
                            <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${f===0?"":f}" placeholder="666" />
                        </div>
                        <div class="sh-setting-row" title="Overlay Opacity">
                            <span class="sh-emoji">\u{1F47B}</span>
                            <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${o.overlayOpacity}" />
                        </div>
                        
                        <div id="sh-adv-container-item-counter" class="sh-adv-container">
                            <div class="sh-setting-row" title="Target Rate">
                                <span class="sh-emoji">\u{1F3AF}</span>
                                <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${p}" placeholder="\u041D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u0430 \u043D\u043E\u0440\u043C\u0430" />
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
                    `,t.querySelectorAll(".sh-opt-btn").forEach(s=>{s.addEventListener("click",l=>{let n=l.target;t.querySelectorAll(".sh-opt-btn").forEach(h=>h.classList.remove("active")),n.classList.add("active");let c=parseInt(n.getAttribute("data-val")||"1",10);a.updateSettings({lunchBreak:c})})});let y=t.querySelector("#sh-cfg-count");y&&y.addEventListener("input",s=>{let l=s.target,n=parseInt(l.value,10);isNaN(n)&&(n=0),n<0&&(n=0,l.value="0"),a.setCount(n)});let S=t.querySelector("#sh-cfg-opacity");S&&S.addEventListener("input",s=>{let l=s.target,n=parseFloat(l.value);a.updateSettings({overlayOpacity:n})});let g=t.querySelector("#sh-cfg-target");g&&g.addEventListener("input",s=>{let l=s.target,n=parseFloat(l.value);(isNaN(n)||n<0)&&(n=0),a.updateSettings({targetRate:n})});let u=t.querySelector("#sh-cfg-start-time"),d=t.querySelector("#sh-btn-start-now"),e=t.querySelector("#sh-btn-start-reset");u&&d&&e&&(u.addEventListener("input",s=>{let l=s.target,n=s,c=l.value.replace(/\D/g,"").split(""),h="";if(c.length>0){let E=c.shift();E>="3"?h+="0"+E:h+=E}if(c.length>0&&h.length===1){let E=c.shift();h[0]==="2"&&E>="4"?(h="0"+h[0],c.unshift(E)):h+=E}if(h.length===2&&(c.length>0||n.inputType!=="deleteContentBackward"||l.value.endsWith(":"))&&(h+=":"),c.length>0){let E=c.shift();E>="6"?h+="0"+E:h+=E}if(c.length>0&&h.length===4){let E=c.shift();h+=E}l.value=h,h.length===5&&h.match(/^\d{2}:\d{2}$/)?a.updateSettings({customStartTime:h}):h===""&&a.updateSettings({customStartTime:null})}),d.addEventListener("click",()=>{let s=new Date,l=String(s.getHours()).padStart(2,"0"),n=String(s.getMinutes()).padStart(2,"0"),c=`${l}:${n}`;u.value=c,a.updateSettings({customStartTime:c})}),e.addEventListener("click",()=>{u.value="",a.updateSettings({customStartTime:null})}));let i=t.querySelector("#sh-adv-btn-item-counter"),r=t.querySelector("#sh-adv-container-item-counter");i&&r&&i.addEventListener("click",()=>{r.classList.toggle("sh-expanded")})}},{id:"off-task",name:"\u0410\u0432\u0442\u043E-\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044F (Off-Task)",file:"off_task.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u0438\u0431\u0438\u0432\u0430\u0454 \u0434\u043E \u0442\u043E\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441.",getHandler:()=>window.__offTask,renderSettings:t=>{let a=window.__offTask;if(!a)return;let o=k[v].offTaskMins,f=a.getSettings(),m=f.timeoutMins!==void 0?f.timeoutMins:o,x=f.toteBarcode||"";f.timeoutMins===void 0&&a.updateSettings({timeoutMins:o}),t.innerHTML=`
                        <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                            <span class="sh-emoji" title="\u0422\u0430\u0440\u0430">\u{1F4E6}</span>
                            <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${x}" placeholder="ts... (\u043F\u0443\u0441\u0442\u043E=\u0432\u0438\u043C\u043A)" autocomplete="off">
                            <span class="sh-emoji" title="\u0425\u0432\u0438\u043B\u0438\u043D\u0438">\u23F1\uFE0F</span>
                            <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${m}" title="\u0422\u0430\u0439\u043C\u0435\u0440">
                        </div>
                    `;let b=t.querySelector("#sh-ot-tote"),p=t.querySelector("#sh-ot-mins");b.addEventListener("input",u=>{let d=u.target.value.trim();a.updateSettings({toteBarcode:d}),d||(p.value=a.getSettings().timeoutMins?.toString()||o.toString())}),p.addEventListener("change",u=>{let d=u.target.value.trim(),e=o;if(d.includes(":")){let i=d.split(":");e=parseInt(i[0]||"0",10)+parseInt(i[1]||"0",10)/60}else{let i=parseFloat(d);!isNaN(i)&&i>0&&(e=i)}a.updateSettings({timeoutMins:e})}),p.addEventListener("keydown",u=>{u.key==="Enter"&&p.blur()});let y=()=>{document.activeElement!==b&&(b.value=a.getSettings().toteBarcode||""),document.activeElement!==p&&(p.value=a.getSettings().timeoutMins?.toString()||o.toString(),p.style.color="")},S=u=>{if(document.activeElement===p||!a.getSettings().toteBarcode)return;let d=Math.ceil(u.detail.remainingMs/1e3),e=Math.floor(d/60),i=String(d%60).padStart(2,"0");p.value=`${e}:${i}`,p.style.color=d<=30?"#d93025":"#1a73e8",p.style.fontWeight="bold"};t._abortController&&t._abortController.abort();let g=new AbortController;t._abortController=g,window.addEventListener("sh-offtask-update",y,{signal:g.signal}),window.addEventListener("sh-offtask-tick",S,{signal:g.signal})},isTrusted:!0},{id:"binds",name:"\u0411\u0456\u043D\u0434\u0438",file:"binds.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u043E\u043A\u043B\u0456\u043A\u0443\u0454 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456.<br>\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u043D\u0430 F-\u043A\u043D\u043E\u043F\u043A\u0443 \u0434\u043B\u044F \u0437\u0430\u043F\u0438\u0441\u0443(\u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E F9 \u0456 F1-F7) \u0430\u0431\u043E \u043D\u0430 \u0441\u043B\u043E\u0432\u043E, \u0449\u043E\u0431 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0439\u043E\u0433\u043E.",getHandler:()=>window.__binds,renderSettings:t=>{let a=window.__binds;if(!a)return;let o=JSON.parse(JSON.stringify(a.getShortcuts()));t._abortController&&t._abortController.abort();let f=new AbortController;t._abortController=f,window.addEventListener("sh-binds-update",()=>{o=JSON.parse(JSON.stringify(a.getShortcuts())),m()},{signal:f.signal});let m=()=>{let x=Object.keys(o),b=a.getRecordingKey(),p="";x.length>0?p=x.map(g=>{let u=o[g],d=b===g,e=u.map((s,l)=>{let n=s.split(/\s+/).slice(0,2).join(" ");return`<span class="sh-bind-del-word" data-key="${g}" data-idx="${l}" title="\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438: ${s}">${n}</span>`}).join(' <span class="sh-arrow">\u2794</span> '),i=u.length>0?e:d?"<i>\u0417\u0430\u043F\u0438\u0441...</i>":"";return`
                                    <div class="sh-bind-row">
                                        <div class="${d?"sh-bind-key sh-recording":"sh-bind-key"}" data-key="${g}" title="\u0417\u0430\u043F\u0438\u0441 / \u0417\u0443\u043F\u0438\u043D\u043A\u0430">${g}</div>
                                        <div class="sh-bind-action">${i}</div>
                                    </div>
                                `}).join(""):p='<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">\u041D\u0430\u0440\u0430\u0437\u0456 \u043D\u0435\u043C\u0430\u0454 \u0436\u043E\u0434\u043D\u043E\u0433\u043E \u0431\u0456\u043D\u0434\u0430.</div>',t.innerHTML=`
                            <div id="sh-adv-container-binds" class="sh-adv-container ${t.querySelector("#sh-adv-container-binds")?.classList.contains("sh-expanded")?"sh-expanded":""}">
                                <div class="sh-bind-list">
                                    ${p}
                                </div>
                            </div>
                            <div class="sh-adv-toggle-wrap">
                                <span id="sh-adv-btn-binds" class="sh-adv-text" style="margin-left: auto;">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</span>
                            </div>
                        `,t.querySelectorAll(".sh-bind-key").forEach(g=>{g.addEventListener("click",u=>{let e=u.target.getAttribute("data-key");e&&(a.getRecordingKey()===e?a.stopRecording():a.startRecording(e))})}),t.querySelectorAll(".sh-bind-del-word").forEach(g=>{g.addEventListener("click",u=>{let d=u.target,e=d.getAttribute("data-key"),i=d.getAttribute("data-idx");if(e&&i!==null&&!b){let r=parseInt(i,10);o[e].splice(r,1),a.updateShortcuts(o),m()}})});let y=t.querySelector("#sh-adv-btn-binds"),S=t.querySelector("#sh-adv-container-binds");y&&S&&y.addEventListener("click",()=>{S.classList.toggle("sh-expanded")})};m()}},{id:"auto-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn.js",description:'\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 "\u043F\u0435\u0440\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 LPN" \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456 LPN \u0430\u0431\u043E \u0431\u0443\u0434\u044C-\u0447\u043E\u0433\u043E \u0456\u043D\u0448\u043E\u0433\u043E, \u043E\u043A\u0440\u0456\u043C \u0442\u043E\u0442\u0430',excludeDeps:["REFURB","WHD"],getHandler:()=>window.__autoLpn},{id:"refurb-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn_refurb.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0437\u0430\u043F\u043E\u0432\u043D\u044E\u0454 \u0441\u0442\u0430\u0440\u0443 LPN",excludeDeps:["CRET","FAST","UG"],getHandler:()=>window.__refurbLpn},{id:"dev-inspector",name:"Dev Inspector",file:"dev_inspector.js",description:"\u041A\u043B\u0456\u043A\u043D\u0456\u0442\u044C \u043D\u0430 \u0431\u0443\u0434\u044C-\u044F\u043A\u0438\u0439 \u0435\u043B\u0435\u043C\u0435\u043D\u0442, \u0449\u043E\u0431 \u043F\u043E\u0431\u0430\u0447\u0438\u0442\u0438 \u0439\u043E\u0433\u043E HTML (\u0422\u0456\u043B\u044C\u043A\u0438 \u0434\u043B\u044F \u0440\u043E\u0437\u0440\u043E\u0431\u043A\u0438).",getHandler:()=>window.__devInspector,experimental:!0}];async function B(t,a,o){let f=a.checked,m=t.getHandler();if(f&&!m){a.disabled=!0;let x=`${M}/${t.file}?cb=${Date.now()}`;try{let b=await fetch(x);if(!b.ok)throw new Error(`HTTP ${b.status}`);let p=await b.text(),y=document.createElement("script");y.textContent=p,document.head.appendChild(y),m=t.getHandler(),a.disabled=!1}catch(b){alert(`\u26A0\uFE0F Failed to load ${t.name}:
${b.message}`),a.checked=!1,a.disabled=!1;return}}m&&(f?(m.enable(),t.renderSettings&&o&&(o.style.display="block",t.renderSettings(o))):(m.disable(),o&&(o.style.display="none",o.innerHTML="")))}["keydown","keyup","keypress"].forEach(t=>{window.addEventListener(t,a=>{let o=a.target;o&&o.closest("#sh-root")&&a.stopPropagation()},!0)});function N(){let t="sh_panel_opacity",a=.4;try{let e=localStorage.getItem(t);if(e!==null){let i=parseFloat(e);!isNaN(i)&&i>=.1&&i<=1&&(a=i)}}catch{}let o=document.createElement("div");o.id="sh-root",o.innerHTML=`
                <style>
                    ${$}
                </style>
                
                <div id="sh-panel" style="opacity: ${a};">
                    <div class="sh-header">
                        <div class="sh-header-group">
                            <select id="sh-subdep-select" class="sh-dep-dropdown">
                                ${L.map(e=>`<option value="${e}" ${v===e?"selected":""}>${e}</option>`).join(`
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
                            <input type="range" id="sh-panel-opacity" class="sh-range" min="0.1" max="1" step="0.05" value="${a}" />
                        </div>
                    </div>
                    <div class="sh-body" id="sh-list"></div>
                </div>
            `,document.body.appendChild(o);let f=document.getElementById("sh-panel"),m=document.getElementById("sh-settings-toggle-btn"),x=document.getElementById("sh-global-settings"),b=document.getElementById("sh-panel-opacity");m&&x&&m.addEventListener("click",()=>{m.classList.toggle("active"),x.classList.toggle("sh-expanded")}),b&&b.addEventListener("input",e=>{let i=e.target,r=parseFloat(i.value);f.style.opacity=r.toString();try{localStorage.setItem(t,r.toString())}catch{}});function p(){f.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(e=>e.classList.remove("sh-expanded")),x&&x.classList.remove("sh-expanded"),m&&m.classList.remove("active"),window.dispatchEvent(new CustomEvent("sh-panel-closed"))}document.addEventListener("mousedown",e=>{let i=e.target;f.classList.contains("sh-open")&&!f.contains(i)&&p()});let y=document.getElementById("sh-subdep-select");y&&y.addEventListener("change",e=>{let i=e.target;if(C(i.value)){v=i.value,localStorage.setItem("sh_hub_dep",v);let r=k[v];if(r){if(window.__itemCounter){window.__itemCounter.updateSettings({targetRate:r.targetRate,doubleCountMode:r.doubleCountMode,scanTimeoutMs:r.scanTimeoutMs});let s=document.getElementById("sh-cfg-target");s&&(s.value=r.targetRate.toString())}else try{let s=JSON.parse(localStorage.getItem("sh_item_counter_settings")||"{}");s.targetRate=r.targetRate,s.doubleCountMode=r.doubleCountMode,s.scanTimeoutMs=r.scanTimeoutMs,localStorage.setItem("sh_item_counter_settings",JSON.stringify(s))}catch{}if(window.__offTask){window.__offTask.updateSettings({timeoutMins:r.offTaskMins});let s=document.getElementById("sh-ot-mins");s&&(s.value=r.offTaskMins.toString())}else try{let s=JSON.parse(localStorage.getItem("sh_off_task_settings")||"{}");s.timeoutMins=r.offTaskMins,localStorage.setItem("sh_off_task_settings",JSON.stringify(s))}catch{}}S.forEach(s=>{let l=document.getElementById(`sh-card-${s.id}`);if(l)if(s.excludeDeps?.includes(v)){l.style.display="none";let n=s.getHandler(),c=document.getElementById(`sh-chk-${s.id}`);n&&n.isActive()&&(n.disable(),c&&(c.checked=!1))}else l.style.display="block"})}});let S=A.filter(e=>!(e.experimental&&!["development","local"].includes(w)||e.isTrusted&&!T)),g=()=>{let e=document.getElementById("sh-chk-all");if(!e)return;let i=document.getElementById("sh-sub-dep-select"),r=i?i.value:"UG",l=S.filter(n=>!(n.experimental||n.excludeDeps&&n.excludeDeps.includes(r))).map(n=>document.getElementById(`sh-chk-${n.id}`));e.checked=l.length>0&&l.every(n=>n&&n.checked)},u=document.getElementById("sh-list");u&&S.forEach(e=>{let i=e.getHandler(),r=i?i.isActive():!1,s=document.createElement("div");s.id=`sh-card-${e.id}`,s.className="sh-card",e.excludeDeps?.includes(v)&&(s.style.display="none"),s.innerHTML=`
                        <div class="sh-card-top">
                            <div class="sh-card-info">
                                <div class="sh-card-title">${e.name}</div>
                                <div class="sh-card-desc">${e.description}</div>
                            </div>
                            <label class="sh-switch">
                                <input type="checkbox" id="sh-chk-${e.id}" ${r?"checked":""}>
                                <span class="sh-slider"></span>
                            </label>
                        </div>
                        <div class="sh-card-settings" id="sh-settings-${e.id}"></div>
                    `,u.appendChild(s);let l=s.querySelector(`#sh-chk-${e.id}`),n=s.querySelector(`#sh-settings-${e.id}`);r&&e.renderSettings&&(n.style.display="block",e.renderSettings(n)),l&&(l.onchange=async()=>{await B(e,l,n),g()})});let d=document.getElementById("sh-chk-all");d&&d.addEventListener("change",e=>{let i=e.target.checked,r=[],s=document.getElementById("sh-sub-dep-select"),l=s?s.value:"UG";S.forEach(n=>{if(n.experimental||n.excludeDeps&&n.excludeDeps.includes(l))return;let c=document.getElementById(`sh-chk-${n.id}`),h=document.getElementById(`sh-settings-${n.id}`);c&&c.checked!==i&&!c.disabled&&(c.checked=i,r.push(B(n,c,h)))}),r.length>0&&(d.disabled=!0,Promise.all(r).finally(()=>{d.disabled=!1,g()}))}),g(),setTimeout(()=>{f.classList.add("sh-open")},100)}N()})()}})();

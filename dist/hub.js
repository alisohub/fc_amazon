"use strict";(()=>{var N={CRET:{targetRate:47,offTaskMins:4,doubleCountMode:!1,scanTimeoutMs:6e3},FAST:{targetRate:80,offTaskMins:2,doubleCountMode:!1,scanTimeoutMs:4e3},UG:{targetRate:47,offTaskMins:4,doubleCountMode:!0,scanTimeoutMs:6e3},REFURB:{targetRate:30,offTaskMins:1,doubleCountMode:!1,scanTimeoutMs:6e3},WHD:{targetRate:25,offTaskMins:5,doubleCountMode:!1,scanTimeoutMs:6e3}},C="sh_hub_dep";var A="sh_item_counter_settings",D="sh_off_task_settings";var $="sh_lpn",G="sh_work_station";var U="lpn-input-label",j="ws-input",z="package-input",F="wd-item-scan-label";var W=`
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
`;var K=w=>[{id:"item-counter",name:"\u0420\u0430\u0445\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u043A",file:"counter.js",description:"\u0420\u0430\u0445\u0443\u0454 \u043F\u0430\u0447\u043A\u0438, \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0445\u043E\u0432\u0430\u0442\u0438 \u0437 \u0435\u043A\u0440\u0430\u043D\u0443 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E F10. \u0412\u0438\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u0435\u0440\u0435\u0440\u0432\u0443.",getHandler:()=>window.__itemCounter,renderSettings:a=>{let t=window.__itemCounter;if(!t)return;let l=w(),i=t.getSettings(),y=t.getCount(),I=N[l]?N[l].targetRate:47,k=N[l]?N[l].doubleCountMode:!1,_=N[l]?N[l].scanTimeoutMs:6e3,v=i.targetRate!==void 0?i.targetRate:I;t.updateSettings({targetRate:v,doubleCountMode:k,scanTimeoutMs:_}),a.innerHTML=`
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
                        <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${y===0?"":y}" placeholder="666" />
                    </div>
                    <div class="sh-setting-row" title="Overlay Opacity">
                        <span class="sh-emoji">\u{1F47B}</span>
                        <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${i.overlayOpacity}" />
                    </div>
                    
                    <div id="sh-adv-container-item-counter" class="sh-adv-container">
                        <div class="sh-setting-row" title="Target Rate">
                            <span class="sh-emoji">\u{1F3AF}</span>
                            <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${v}" placeholder="\u041D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u0430 \u043D\u043E\u0440\u043C\u0430" />
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
                `,a.querySelectorAll(".sh-opt-btn").forEach(g=>{g.addEventListener("click",r=>{let p=r.target;a.querySelectorAll(".sh-opt-btn").forEach(f=>f.classList.remove("active")),p.classList.add("active");let h=parseInt(p.getAttribute("data-val")||"1",10);t.updateSettings({lunchBreak:h})})});let L=a.querySelector("#sh-cfg-count");L&&L.addEventListener("input",g=>{let r=g.target,p=parseInt(r.value,10);isNaN(p)&&(p=0),p<0&&(p=0,r.value="0"),t.setCount(p)});let c=a.querySelector("#sh-cfg-opacity");c&&c.addEventListener("input",g=>{let r=g.target,p=parseFloat(r.value);t.updateSettings({overlayOpacity:p})});let S=a.querySelector("#sh-cfg-target");S&&S.addEventListener("input",g=>{let r=g.target,p=parseFloat(r.value);(isNaN(p)||p<0)&&(p=0),t.updateSettings({targetRate:p})});let b=a.querySelector("#sh-cfg-start-time"),u=a.querySelector("#sh-btn-start-now"),n=a.querySelector("#sh-btn-start-reset");b&&u&&n&&(b.addEventListener("input",g=>{let r=g.target,p=g,h=r.value.replace(/\D/g,"").split(""),f="";if(h.length>0){let T=h.shift();T>="3"?f+="0"+T:f+=T}if(h.length>0&&f.length===1){let T=h.shift();f[0]==="2"&&T>="4"?(f="0"+f[0],h.unshift(T)):f+=T}if(f.length===2&&(h.length>0||p.inputType!=="deleteContentBackward"||r.value.endsWith(":"))&&(f+=":"),h.length>0){let T=h.shift();T>="6"?f+="0"+T:f+=T}if(h.length>0&&f.length===4){let T=h.shift();f+=T}r.value=f,f.length===5&&f.match(/^\d{2}:\d{2}$/)?t.updateSettings({customStartTime:f}):f===""&&t.updateSettings({customStartTime:null})}),u.addEventListener("click",()=>{let g=new Date,r=String(g.getHours()).padStart(2,"0"),p=String(g.getMinutes()).padStart(2,"0"),h=`${r}:${p}`;b.value=h,t.updateSettings({customStartTime:h})}),n.addEventListener("click",()=>{b.value="",t.updateSettings({customStartTime:null})}));let d=a.querySelector("#sh-adv-btn-item-counter"),x=a.querySelector("#sh-adv-container-item-counter");d&&x&&d.addEventListener("click",()=>{x.classList.toggle("sh-expanded")})}},{id:"off-task",name:"\u0410\u0432\u0442\u043E-\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044F (Off-Task)",file:"off_task.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u0438\u0431\u0438\u0432\u0430\u0454 \u0434\u043E \u0442\u043E\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441.",getHandler:()=>window.__offTask,renderSettings:a=>{let t=window.__offTask;if(!t)return;let l=w(),i=N[l].offTaskMins,y=t.getSettings(),I=y.timeoutMins!==void 0?y.timeoutMins:i,k=y.toteBarcode||"";y.timeoutMins===void 0&&t.updateSettings({timeoutMins:i}),a.innerHTML=`
                    <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                        <span class="sh-emoji" title="\u0422\u0430\u0440\u0430">\u{1F4E6}</span>
                        <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${k}" placeholder="ts... (\u043F\u0443\u0441\u0442\u043E=\u0432\u0438\u043C\u043A)" autocomplete="off">
                        <span class="sh-emoji" title="\u0425\u0432\u0438\u043B\u0438\u043D\u0438">\u23F1\uFE0F</span>
                        <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${I}" title="\u0422\u0430\u0439\u043C\u0435\u0440">
                    </div>
                `;let _=a.querySelector("#sh-ot-tote"),v=a.querySelector("#sh-ot-mins");_.addEventListener("input",b=>{let u=b.target.value.trim();t.updateSettings({toteBarcode:u}),u||(v.value=t.getSettings().timeoutMins?.toString()||i.toString())}),v.addEventListener("change",b=>{let u=b.target.value.trim(),n=i;if(u.includes(":")){let d=u.split(":");n=parseInt(d[0]||"0",10)+parseInt(d[1]||"0",10)/60}else{let d=parseFloat(u);!isNaN(d)&&d>0&&(n=d)}t.updateSettings({timeoutMins:n})}),v.addEventListener("keydown",b=>{b.key==="Enter"&&v.blur()});let L=()=>{document.activeElement!==_&&(_.value=t.getSettings().toteBarcode||""),document.activeElement!==v&&(v.value=t.getSettings().timeoutMins?.toString()||i.toString(),v.style.color="")},c=b=>{if(document.activeElement===v||!t.getSettings().toteBarcode)return;let u=Math.ceil(b.detail.remainingMs/1e3),n=Math.floor(u/60),d=String(u%60).padStart(2,"0");v.value=`${n}:${d}`,v.style.color=u<=30?"#d93025":"#1a73e8",v.style.fontWeight="bold"};a._abortController&&a._abortController.abort();let S=new AbortController;a._abortController=S,window.addEventListener("sh-offtask-update",L,{signal:S.signal}),window.addEventListener("sh-offtask-tick",c,{signal:S.signal})},isTrusted:!0},{id:"binds",name:"\u0411\u0456\u043D\u0434\u0438",file:"binds.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u043E\u043A\u043B\u0456\u043A\u0443\u0454 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456.<br>\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u043D\u0430 F-\u043A\u043D\u043E\u043F\u043A\u0443 \u0434\u043B\u044F \u0437\u0430\u043F\u0438\u0441\u0443(\u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E F9 \u0456 F1-F7) \u0430\u0431\u043E \u043D\u0430 \u0441\u043B\u043E\u0432\u043E, \u0449\u043E\u0431 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0439\u043E\u0433\u043E.",getHandler:()=>window.__binds,renderSettings:a=>{let t=window.__binds;if(!t)return;let l=JSON.parse(JSON.stringify(t.getShortcuts()));a._abortController&&a._abortController.abort();let i=new AbortController;a._abortController=i,window.addEventListener("sh-binds-update",()=>{l=JSON.parse(JSON.stringify(t.getShortcuts())),y()},{signal:i.signal});let y=()=>{let I=Object.keys(l),k=t.getRecordingKey(),_="";I.length>0?_=I.map(c=>{let S=l[c],b=k===c,u=S.map((x,g)=>{let r=x.split(/\s+/).slice(0,2).join(" ");return`<span class="sh-bind-del-word" data-key="${c}" data-idx="${g}" title="\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438: ${x}">${r}</span>`}).join(' <span class="sh-arrow">\u2794</span> '),n=S.length>0?u:b?"<i>\u0417\u0430\u043F\u0438\u0441...</i>":"";return`
                                <div class="sh-bind-row">
                                    <div class="${b?"sh-bind-key sh-recording":"sh-bind-key"}" data-key="${c}" title="\u0417\u0430\u043F\u0438\u0441 / \u0417\u0443\u043F\u0438\u043D\u043A\u0430">${c}</div>
                                    <div class="sh-bind-action">${n}</div>
                                </div>
                            `}).join(""):_='<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">\u041D\u0430\u0440\u0430\u0437\u0456 \u043D\u0435\u043C\u0430\u0454 \u0436\u043E\u0434\u043D\u043E\u0433\u043E \u0431\u0456\u043D\u0434\u0430.</div>',a.innerHTML=`
                        <div id="sh-adv-container-binds" class="sh-adv-container ${a.querySelector("#sh-adv-container-binds")?.classList.contains("sh-expanded")?"sh-expanded":""}">
                            <div class="sh-bind-list">
                                ${_}
                            </div>
                        </div>
                        <div class="sh-adv-toggle-wrap">
                            <span id="sh-adv-btn-binds" class="sh-adv-text" style="margin-left: auto;">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</span>
                        </div>
                    `,a.querySelectorAll(".sh-bind-key").forEach(c=>{c.addEventListener("click",S=>{let u=S.target.getAttribute("data-key");u&&(t.getRecordingKey()===u?t.stopRecording():t.startRecording(u))})}),a.querySelectorAll(".sh-bind-del-word").forEach(c=>{c.addEventListener("click",S=>{let b=S.target,u=b.getAttribute("data-key"),n=b.getAttribute("data-idx");if(u&&n!==null&&!k){let d=parseInt(n,10);l[u].splice(d,1),t.updateShortcuts(l),y()}})});let v=a.querySelector("#sh-adv-btn-binds"),L=a.querySelector("#sh-adv-container-binds");v&&L&&v.addEventListener("click",()=>{L.classList.toggle("sh-expanded")})};y()}},{id:"auto-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn.js",description:'\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 "\u043F\u0435\u0440\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 LPN" \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456 LPN \u0430\u0431\u043E \u0431\u0443\u0434\u044C-\u0447\u043E\u0433\u043E \u0456\u043D\u0448\u043E\u0433\u043E, \u043E\u043A\u0440\u0456\u043C \u0442\u043E\u0442\u0430',excludeDeps:["REFURB","WHD"],getHandler:()=>window.__autoLpn},{id:"refurb-lpn",name:"A\u0432\u0442\u043E-LPN",file:"auto_lpn_refurb.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0437\u0430\u043F\u043E\u0432\u043D\u044E\u0454 \u0441\u0442\u0430\u0440\u0443 LPN",excludeDeps:["CRET","FAST","UG"],getHandler:()=>window.__refurbLpn},{id:"clear-session",name:"\u0410\u0432\u0442\u043E-\u0441\u043A\u0430\u0441\u0443\u0439",file:"clear_session.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0441\u043A\u0430\u0441\u043E\u0432\u0443\u0454 \u0441\u0435\u0441\u0456\u044E \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456 `us` \u043D\u0430 \u043A\u043B\u0430\u0432\u0456\u0430\u0442\u0443\u0440\u0456.",getHandler:()=>window.__clearSession},{id:"gravis",name:"Gravis",file:"gravis.js",description:`\u042F\u043A\u0449\u043E \u0448\u0442\u0440\u0438\u0445-\u043A\u043E\u0434 \u0442\u043E\u0432\u0430\u0440\u0443 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0432 Gravis
\u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0441\u0442\u0430\u0432\u043B\u044F\u0454 \u0439\u043E\u0433\u043E \u0443 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u043D\u0435 \u043F\u043E\u043B\u0435 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u0456 F8.
\u041F\u0440\u0438 \u0432\u0456\u0434\u043A\u0440\u0438\u0442\u0442\u0456 \u0432\u043A\u043B\u0430\u0434\u043A\u0438 \u0437 Gravis \u0430\u043A\u0442\u0438\u0432\u0443\u0439\u0442\u0435 \u0441\u043A\u0440\u0438\u043F\u0442 \u0432 \u043D\u0456\u0439 \u0442\u0430\u043A\u043E\u0436.`,excludeDeps:["REFURB","WHD"],getHandler:()=>window.__gravis}];if(window.location.href.includes("gravis"))(async()=>{let w=window.__SH_BRANCH||"main",a=w==="local"?"http://localhost:3000/dist/hub_gravis.js":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${w}/dist/hub_gravis.js`;try{let t=await fetch(a);if(!t.ok)throw new Error(`HTTP ${t.status}`);let l=await t.text(),i=document.createElement("script");i.textContent=l,document.head.appendChild(i)}catch(t){alert(`\u26A0\uFE0F Failed to load Gravis Hub: ${t}`)}})();else if(window.__scriptHubLoaded){let w=document.getElementById("sh-panel");w&&(w.classList.contains("sh-open")?(w.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(a=>a.classList.remove("sh-expanded")),window.dispatchEvent(new CustomEvent("sh-panel-closed"))):w.classList.add("sh-open"))}else{window.__scriptHubLoaded=!0;async function w(l){let i=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(l));return Array.from(new Uint8Array(i)).map(y=>y.toString(16).padStart(2,"0")).join("")}async function a(){return new Promise(l=>{let i=Date.now(),y=async()=>{let I=document.querySelector("p.user__username");I&&I.textContent?l(await w(I.textContent.trim())):Date.now()-i>1e4?l(null):setTimeout(y,500)};y()})}let t=["24deb6961c3cef1d2e3795aaf4b7e3fe8d83d20adff06215426c05827c8351ca","710a0c6095723bc0a46d78897497b5af0417cee56708fdc10cca6860b686ea6e","bc95a4675c77e3ee07d42d825c05e403c3861d29b24ddd57c6e30ebb7a8c2336","49480808159cde937909eaad603911749197829c0cea7a8b68c29e63c98538c0","61678f96fc810a611097d9b0bc98bc8ecb0abee7cd55f2faa19b455604dc2332","2f5ae5e87d1a659e1a01e2bc2c38441bba81bb12eb39d59695b4960576012c55","004381f7f5b3ace58d7dc03a047674325acd266ddc576c273942fdb7237f7130","f355a6794c9a044989a7d2e5bc1e3aa5bff909a38adfbdc68cc0433042ea84b9"];(async()=>{let l=window.__SH_BRANCH||"main",i=!1;if(l==="local")i=!0;else{let n=await a();if(!n||(i=t.includes(n),l==="development"&&!i))return}let y=l==="local"?"http://localhost:3000/dist":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${l}/dist`,k=new URLSearchParams(window.location.search).get("gradingMode"),_=[];k==="CRETURN_PRIMARY_GRADING"?_=["UG"]:k==="CRETURN"?_=["FAST","CRET"]:k==="CRETURN_REFURB"?_=["REFURB"]:k==="WAREHOUSE_DEALS"?_=["WHD"]:_=["FAST","CRET","UG","REFURB","WHD"];function v(n){return n==="FAST"||n==="CRET"||n==="UG"||n==="REFURB"||n==="WHD"}let L=localStorage.getItem(C),c=v(L)&&_.includes(L)?L:_[0];if(L!==c)try{localStorage.setItem(C,c)}catch{}let S=K(()=>c);async function b(n,d,x){let g=d.checked,r=n.getHandler();if(g&&!r){d.disabled=!0;let p=`${y}/${n.file}?cb=${Date.now()}`;try{let h=await fetch(p);if(!h.ok)throw new Error(`HTTP ${h.status}`);let f=await h.text(),T=document.createElement("script");T.textContent=f,document.head.appendChild(T),r=n.getHandler(),d.disabled=!1}catch(h){alert(`\u26A0\uFE0F Failed to load ${n.name}:
${h.message}`),d.checked=!1,d.disabled=!1;return}}r&&(g?(r.enable(),n.renderSettings&&x&&(x.style.display="block",n.renderSettings(x))):(r.disable(),x&&(x.style.display="none",x.innerHTML="")))}["keydown","keyup","keypress"].forEach(n=>{window.addEventListener(n,d=>{let x=d.target;x&&x.closest("#sh-root")&&d.stopPropagation()},!0)});function u(){let n="sh_panel_opacity",d=.4;try{let s=localStorage.getItem(n);if(s!==null){let m=parseFloat(s);!isNaN(m)&&m>=.1&&m<=1&&(d=m)}}catch{}let x=document.createElement("div");x.id="sh-root",x.innerHTML=`
                    <style>
                        ${W}
                    </style>
                    
                    <div id="sh-panel" style="opacity: ${d};">
                        <div class="sh-header">
                            <div class="sh-header-group">
                                <select id="sh-subdep-select" class="sh-dep-dropdown">
                                    ${_.map(s=>`<option value="${s}" ${c===s?"selected":""}>${s}</option>`).join(`
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
                                <input type="range" id="sh-panel-opacity" class="sh-range" min="0.1" max="1" step="0.05" value="${d}" />
                            </div>
                        </div>
                        <div class="sh-body" id="sh-list"></div>
                    </div>
                `,document.body.appendChild(x);let g=document.getElementById("sh-panel"),r=document.getElementById("sh-settings-toggle-btn"),p=document.getElementById("sh-global-settings"),h=document.getElementById("sh-panel-opacity");r&&p&&r.addEventListener("click",()=>{r.classList.toggle("active"),p.classList.toggle("sh-expanded")}),h&&h.addEventListener("input",s=>{let m=s.target,o=parseFloat(m.value);g.style.opacity=o.toString();try{localStorage.setItem(n,o.toString())}catch{}});function f(){g.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(s=>s.classList.remove("sh-expanded")),p&&p.classList.remove("sh-expanded"),r&&r.classList.remove("active"),window.dispatchEvent(new CustomEvent("sh-panel-closed"))}document.addEventListener("mousedown",s=>{let m=s.target;g.classList.contains("sh-open")&&!g.contains(m)&&f()});let T=document.getElementById("sh-subdep-select");T&&T.addEventListener("change",s=>{let m=s.target;if(v(m.value)){c=m.value,localStorage.setItem(C,c);let o=N[c];if(o){if(window.__itemCounter){window.__itemCounter.updateSettings({targetRate:o.targetRate,doubleCountMode:o.doubleCountMode,scanTimeoutMs:o.scanTimeoutMs});let e=document.getElementById("sh-cfg-target");e&&(e.value=o.targetRate.toString())}else try{let e=JSON.parse(localStorage.getItem(A)||"{}");e.targetRate=o.targetRate,e.doubleCountMode=o.doubleCountMode,e.scanTimeoutMs=o.scanTimeoutMs,localStorage.setItem(A,JSON.stringify(e))}catch{}if(window.__offTask){window.__offTask.updateSettings({timeoutMins:o.offTaskMins});let e=document.getElementById("sh-ot-mins");e&&(e.value=o.offTaskMins.toString())}else try{let e=JSON.parse(localStorage.getItem(D)||"{}");e.timeoutMins=o.offTaskMins,localStorage.setItem(D,JSON.stringify(e))}catch{}}H.forEach(e=>{let E=document.getElementById(`sh-card-${e.id}`);if(E)if(e.excludeDeps?.includes(c)){E.style.display="none";let M=e.getHandler(),P=document.getElementById(`sh-chk-${e.id}`);M&&M.isActive()&&(M.disable(),P&&(P.checked=!1))}else E.style.display="block"})}}),document.addEventListener("keydown",s=>{if(s.key!=="Enter"||!window.__refurbLpnLoaded&&!window.__gravisLoaded&&!window.__clearSession)return;let m=s.target;if(!m||!m.matches("input"))return;let o=m.value?.trim();if(!o)return;let e=(m.getAttribute("data-testid")||"").toLowerCase(),E={lpnTestId:[z,F,U],wsTestId:j};try{if(E.lpnTestId.some(q=>e.includes(q.toLowerCase()))&&/^lpn[a-z0-9]+/i.test(o)){localStorage.getItem($)!==o&&(localStorage.setItem($,o),window.__gravis?.sendLpn(o));return}if(e.includes(E.wsTestId)&&/^ws[_-]+/i.test(o)){localStorage.setItem(G,o);return}}catch{}},!0);let H=S.filter(s=>!(s.experimental&&!["development","local"].includes(l)||s.isTrusted&&!i)),B=()=>{let s=document.getElementById("sh-chk-all");if(!s)return;let o=H.filter(e=>!(e.experimental||e.excludeDeps&&e.excludeDeps.includes(c))).map(e=>document.getElementById(`sh-chk-${e.id}`));s.checked=o.length>0&&o.every(e=>e&&e.checked)},O=document.getElementById("sh-list");O&&H.forEach(s=>{let m=s.getHandler(),o=m?m.isActive():!1,e=document.createElement("div");e.id=`sh-card-${s.id}`,e.className="sh-card",s.excludeDeps?.includes(c)&&(e.style.display="none"),e.innerHTML=`
                            <div class="sh-card-top">
                                <div class="sh-card-info">
                                    <div class="sh-card-title">${s.name}</div>
                                    <div class="sh-card-desc">${s.description}</div>
                                </div>
                                <label class="sh-switch">
                                    <input type="checkbox" id="sh-chk-${s.id}" ${o?"checked":""}>
                                    <span class="sh-slider"></span>
                                </label>
                            </div>
                            <div class="sh-card-settings" id="sh-settings-${s.id}"></div>
                        `,O.appendChild(e);let E=e.querySelector(`#sh-chk-${s.id}`),M=e.querySelector(`#sh-settings-${s.id}`);o&&s.renderSettings&&(M.style.display="block",s.renderSettings(M)),E&&(E.onchange=async()=>{await b(s,E,M),B()})});let R=document.getElementById("sh-chk-all");R&&R.addEventListener("change",s=>{let m=s.target.checked,o=[];H.forEach(e=>{if(e.experimental||e.excludeDeps&&e.excludeDeps.includes(c))return;let E=document.getElementById(`sh-chk-${e.id}`),M=document.getElementById(`sh-settings-${e.id}`);E&&E.checked!==m&&!E.disabled&&(E.checked=m,o.push(b(e,E,M)))}),o.length>0&&(R.disabled=!0,Promise.all(o).finally(()=>{R.disabled=!1,B()}))}),B(),setTimeout(()=>{g.classList.add("sh-open")},100)}u()})()}})();

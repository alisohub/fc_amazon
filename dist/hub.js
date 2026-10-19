"use strict";(()=>{var N={CRET:{targetRate:47,offTaskMins:4,doubleCountMode:!1},FAST:{targetRate:80,offTaskMins:2,doubleCountMode:!1},UG:{targetRate:47,offTaskMins:4,doubleCountMode:!0},REFURB:{targetRate:30,offTaskMins:1,doubleCountMode:!1},WHD:{targetRate:25,offTaskMins:5,doubleCountMode:!1}},C="sh_hub_dep";var A="sh_item_counter_settings",D="sh_off_task_settings";var $="sh_lpn",G="sh_work_station";var U="lpn-input-label",j="ws-input",z="package-input",F="wd-item-scan-label";var W=`
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
`;var K=S=>[{id:"item-counter",name:"\u0420\u0430\u0445\u0443\u0432\u0430\u043B\u044C\u043D\u0438\u043A",file:"counter.js",description:"\u0420\u0430\u0445\u0443\u0454 \u043F\u0430\u0447\u043A\u0438, \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0445\u043E\u0432\u0430\u0442\u0438 \u0437 \u0435\u043A\u0440\u0430\u043D\u0443 \u0437\u0430 \u0434\u043E\u043F\u043E\u043C\u043E\u0433\u043E\u044E F10. \u0412\u0438\u0441\u0442\u0430\u0432\u0442\u0435 \u043F\u0435\u0440\u0435\u0440\u0432\u0443.",getHandler:()=>window.__itemCounter,renderSettings:a=>{let t=window.__itemCounter;if(!t)return;let u=S(),l=t.getSettings(),T=t.getCount(),L=N[u]?N[u].targetRate:47,I=N[u]?N[u].doubleCountMode:!1,x=l.targetRate!==void 0?l.targetRate:L;t.updateSettings({targetRate:x,doubleCountMode:I}),a.innerHTML=`
                    <div class="sh-settings-divider"></div>
                    <div class="sh-setting-row" title="Options & Manual Edit">
                        <span class="sh-emoji">\u{1F374}</span>
                        <div class="sh-opt-group">
                            <div class="sh-opt-btn ${l.lunchBreak===1?"active":""}" data-val="1">1</div>
                            <div class="sh-opt-btn ${l.lunchBreak===2?"active":""}" data-val="2">2</div>
                            <div class="sh-opt-btn ${l.lunchBreak===3?"active":""}" data-val="3">3</div>
                            <div class="sh-opt-btn ${l.lunchBreak===4?"active":""}" data-val="4">4</div>
                        </div>
                        <span class="sh-emoji">\u270F\uFE0F</span>
                        <input type="number" id="sh-cfg-count" class="sh-input sh-input-small" min="0" value="${T===0?"":T}" placeholder="666" />
                    </div>
                    <div class="sh-setting-row" title="Overlay Opacity">
                        <span class="sh-emoji">\u{1F47B}</span>
                        <input type="range" id="sh-cfg-opacity" class="sh-range" min="0" max="1" step="0.05" value="${l.overlayOpacity}" />
                    </div>
                    
                    <div id="sh-adv-container-item-counter" class="sh-adv-container">
                        <div class="sh-setting-row" title="Target Rate">
                            <span class="sh-emoji">\u{1F3AF}</span>
                            <input type="number" id="sh-cfg-target" class="sh-input sh-flex-1" min="0" value="${x}" placeholder="\u041D\u0435\u043E\u0431\u0445\u0456\u0434\u043D\u0430 \u043D\u043E\u0440\u043C\u0430" />
                        </div>
                        
                        <div class="sh-setting-row sh-mt-8 sh-space-between" title="\u0412\u043B\u0430\u0441\u043D\u0438\u0439 \u0447\u0430\u0441 \u043F\u043E\u0447\u0430\u0442\u043A\u0443 \u0437\u043C\u0456\u043D\u0438">
                            <div class="sh-flex-center-gap">
                                <span class="sh-emoji">\u23F1\uFE0F</span>
                                <input type="text" id="sh-cfg-start-time" class="sh-input sh-time-input-small" value="${l.customStartTime||""}" placeholder="14:30" maxlength="5" />
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
                `,a.querySelectorAll(".sh-opt-btn").forEach(i=>{i.addEventListener("click",g=>{let o=g.target;a.querySelectorAll(".sh-opt-btn").forEach(d=>d.classList.remove("active")),o.classList.add("active");let m=parseInt(o.getAttribute("data-val")||"1",10);t.updateSettings({lunchBreak:m})})});let b=a.querySelector("#sh-cfg-count");b&&b.addEventListener("input",i=>{let g=i.target,o=parseInt(g.value,10);isNaN(o)&&(o=0),o<0&&(o=0,g.value="0"),t.setCount(o)});let w=a.querySelector("#sh-cfg-opacity");w&&w.addEventListener("input",i=>{let g=i.target,o=parseFloat(g.value);t.updateSettings({overlayOpacity:o})});let p=a.querySelector("#sh-cfg-target");p&&p.addEventListener("input",i=>{let g=i.target,o=parseFloat(g.value);(isNaN(o)||o<0)&&(o=0),t.updateSettings({targetRate:o})});let _=a.querySelector("#sh-cfg-start-time"),v=a.querySelector("#sh-btn-start-now"),h=a.querySelector("#sh-btn-start-reset");_&&v&&h&&(_.addEventListener("input",i=>{let g=i.target,o=i,m=g.value.replace(/\D/g,"").split(""),d="";if(m.length>0){let y=m.shift();y>="3"?d+="0"+y:d+=y}if(m.length>0&&d.length===1){let y=m.shift();d[0]==="2"&&y>="4"?(d="0"+d[0],m.unshift(y)):d+=y}if(d.length===2&&(m.length>0||o.inputType!=="deleteContentBackward"||g.value.endsWith(":"))&&(d+=":"),m.length>0){let y=m.shift();y>="6"?d+="0"+y:d+=y}if(m.length>0&&d.length===4){let y=m.shift();d+=y}g.value=d,d.length===5&&d.match(/^\d{2}:\d{2}$/)?t.updateSettings({customStartTime:d}):d===""&&t.updateSettings({customStartTime:null})}),v.addEventListener("click",()=>{let i=new Date,g=String(i.getHours()).padStart(2,"0"),o=String(i.getMinutes()).padStart(2,"0"),m=`${g}:${o}`;_.value=m,t.updateSettings({customStartTime:m})}),h.addEventListener("click",()=>{_.value="",t.updateSettings({customStartTime:null})}));let n=a.querySelector("#sh-adv-btn-item-counter"),c=a.querySelector("#sh-adv-container-item-counter");n&&c&&n.addEventListener("click",()=>{c.classList.toggle("sh-expanded")})}},{id:"off-task",name:"\u0410\u0432\u0442\u043E-\u0412\u0432\u0435\u0434\u0435\u043D\u043D\u044F (Off-Task)",file:"off_task.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u0438\u0431\u0438\u0432\u0430\u0454 \u0434\u043E \u0442\u043E\u0442\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439 \u0447\u0430\u0441.",getHandler:()=>window.__offTask,renderSettings:a=>{let t=window.__offTask;if(!t)return;let u=S(),l=N[u].offTaskMins,T=t.getSettings(),L=T.timeoutMins!==void 0?T.timeoutMins:l,I=T.toteBarcode||"";T.timeoutMins===void 0&&t.updateSettings({timeoutMins:l}),a.innerHTML=`
                    <div class="sh-setting-row" style="align-items: center; gap: 6px; margin-bottom: 2px;">
                        <span class="sh-emoji" title="\u0422\u0430\u0440\u0430">\u{1F4E6}</span>
                        <input type="text" id="sh-ot-tote" class="sh-input sh-flex-1" style="min-width: 0;" value="${I}" placeholder="ts... (\u043F\u0443\u0441\u0442\u043E=\u0432\u0438\u043C\u043A)" autocomplete="off">
                        <span class="sh-emoji" title="\u0425\u0432\u0438\u043B\u0438\u043D\u0438">\u23F1\uFE0F</span>
                        <input type="text" id="sh-ot-mins" class="sh-input sh-time-input-small" style="width: 50px; padding: 6px 2px;" value="${L}" title="\u0422\u0430\u0439\u043C\u0435\u0440">
                    </div>
                `;let x=a.querySelector("#sh-ot-tote"),b=a.querySelector("#sh-ot-mins");x.addEventListener("input",v=>{let h=v.target.value.trim();t.updateSettings({toteBarcode:h}),h||(b.value=t.getSettings().timeoutMins?.toString()||l.toString())}),b.addEventListener("change",v=>{let h=v.target.value.trim(),n=l;if(h.includes(":")){let c=h.split(":");n=parseInt(c[0]||"0",10)+parseInt(c[1]||"0",10)/60}else{let c=parseFloat(h);!isNaN(c)&&c>0&&(n=c)}t.updateSettings({timeoutMins:n})}),b.addEventListener("keydown",v=>{v.key==="Enter"&&b.blur()});let w=()=>{document.activeElement!==x&&(x.value=t.getSettings().toteBarcode||""),document.activeElement!==b&&(b.value=t.getSettings().timeoutMins?.toString()||l.toString(),b.style.color="")},p=v=>{if(document.activeElement===b||!t.getSettings().toteBarcode)return;let h=Math.ceil(v.detail.remainingMs/1e3),n=Math.floor(h/60),c=String(h%60).padStart(2,"0");b.value=`${n}:${c}`,b.style.color=h<=30?"#d93025":"#1a73e8",b.style.fontWeight="bold"};a._abortController&&a._abortController.abort();let _=new AbortController;a._abortController=_,window.addEventListener("sh-offtask-update",w,{signal:_.signal}),window.addEventListener("sh-offtask-tick",p,{signal:_.signal})},isTrusted:!0},{id:"binds",name:"\u0411\u0456\u043D\u0434\u0438",file:"binds.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u043F\u0440\u043E\u043A\u043B\u0456\u043A\u0443\u0454 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456.<br>\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C \u043D\u0430 F-\u043A\u043D\u043E\u043F\u043A\u0443 \u0434\u043B\u044F \u0437\u0430\u043F\u0438\u0441\u0443(\u0430\u043B\u044C\u0442\u0435\u0440\u043D\u0430\u0442\u0438\u0432\u043D\u043E F9 \u0456 F1-F7) \u0430\u0431\u043E \u043D\u0430 \u0441\u043B\u043E\u0432\u043E, \u0449\u043E\u0431 \u0432\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0439\u043E\u0433\u043E.",getHandler:()=>window.__binds,renderSettings:a=>{let t=window.__binds;if(!t)return;let u=JSON.parse(JSON.stringify(t.getShortcuts()));a._abortController&&a._abortController.abort();let l=new AbortController;a._abortController=l,window.addEventListener("sh-binds-update",()=>{u=JSON.parse(JSON.stringify(t.getShortcuts())),T()},{signal:l.signal});let T=()=>{let L=Object.keys(u),I=t.getRecordingKey(),x="";L.length>0?x=L.map(p=>{let _=u[p],v=I===p,h=_.map((i,g)=>{let o=i.split(/\s+/).slice(0,2).join(" ");return`<span class="sh-bind-del-word" data-key="${p}" data-idx="${g}" title="\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438: ${i}">${o}</span>`}).join(' <span class="sh-arrow">\u2794</span> '),n=_.length>0?h:v?"<i>\u0417\u0430\u043F\u0438\u0441...</i>":"";return`
                                <div class="sh-bind-row">
                                    <div class="${v?"sh-bind-key sh-recording":"sh-bind-key"}" data-key="${p}" title="\u0417\u0430\u043F\u0438\u0441 / \u0417\u0443\u043F\u0438\u043D\u043A\u0430">${p}</div>
                                    <div class="sh-bind-action">${n}</div>
                                </div>
                            `}).join(""):x='<div style="text-align:center; padding: 10px; font-size: 11px; color:#9aa0a6;">\u041D\u0430\u0440\u0430\u0437\u0456 \u043D\u0435\u043C\u0430\u0454 \u0436\u043E\u0434\u043D\u043E\u0433\u043E \u0431\u0456\u043D\u0434\u0430.</div>',a.innerHTML=`
                        <div id="sh-adv-container-binds" class="sh-adv-container ${a.querySelector("#sh-adv-container-binds")?.classList.contains("sh-expanded")?"sh-expanded":""}">
                            <div class="sh-bind-list">
                                ${x}
                            </div>
                        </div>
                        <div class="sh-adv-toggle-wrap">
                            <span id="sh-adv-btn-binds" class="sh-adv-text" style="margin-left: auto;">\u0414\u0435\u0442\u0430\u043B\u044C\u043D\u0456\u0448\u0435</span>
                        </div>
                    `,a.querySelectorAll(".sh-bind-key").forEach(p=>{p.addEventListener("click",_=>{let h=_.target.getAttribute("data-key");h&&(t.getRecordingKey()===h?t.stopRecording():t.startRecording(h))})}),a.querySelectorAll(".sh-bind-del-word").forEach(p=>{p.addEventListener("click",_=>{let v=_.target,h=v.getAttribute("data-key"),n=v.getAttribute("data-idx");if(h&&n!==null&&!I){let c=parseInt(n,10);u[h].splice(c,1),t.updateShortcuts(u),T()}})});let b=a.querySelector("#sh-adv-btn-binds"),w=a.querySelector("#sh-adv-container-binds");b&&w&&b.addEventListener("click",()=>{w.classList.toggle("sh-expanded")})};T()}},{id:"auto-lpn",name:"\u0410\u0432\u0442\u043E-LPN",file:"auto_lpn.js",description:'\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0456\u0434\u043A\u0440\u0438\u0432\u0430\u0454 "\u043F\u0435\u0440\u0435\u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0438\u0442\u0438 LPN" \u043F\u0440\u0438 \u0441\u043A\u0430\u043D\u0443\u0432\u0430\u043D\u043D\u0456 LPN \u0430\u0431\u043E \u0431\u0443\u0434\u044C-\u0447\u043E\u0433\u043E \u0456\u043D\u0448\u043E\u0433\u043E, \u043E\u043A\u0440\u0456\u043C \u0442\u043E\u0442\u0430',excludeDeps:["REFURB","WHD"],getHandler:()=>window.__autoLpn},{id:"refurb-lpn",name:"A\u0432\u0442\u043E-LPN",file:"auto_lpn_refurb.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0437\u0430\u043F\u043E\u0432\u043D\u044E\u0454 \u0441\u0442\u0430\u0440\u0443 LPN",excludeDeps:["CRET","FAST","UG"],getHandler:()=>window.__refurbLpn},{id:"clear-session",name:"\u0410\u0432\u0442\u043E-\u0441\u043A\u0430\u0441\u0443\u0439",file:"clear_session.js",description:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0441\u043A\u0430\u0441\u043E\u0432\u0443\u0454 \u0441\u0435\u0441\u0456\u044E \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u043D\u0456 `us` \u043D\u0430 \u043A\u043B\u0430\u0432\u0456\u0430\u0442\u0443\u0440\u0456.",getHandler:()=>window.__clearSession},{id:"gravis",name:"Gravis",file:"gravis.js",description:`\u042F\u043A\u0449\u043E \u0448\u0442\u0440\u0438\u0445-\u043A\u043E\u0434 \u0442\u043E\u0432\u0430\u0440\u0443 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0432 Gravis
\u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E \u0432\u0441\u0442\u0430\u0432\u043B\u044F\u0454 \u0439\u043E\u0433\u043E \u0443 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u043D\u0435 \u043F\u043E\u043B\u0435 \u043F\u0440\u0438 \u043D\u0430\u0442\u0438\u0441\u043D\u0435\u043D\u0456 F8.
\u041F\u0440\u0438 \u0432\u0456\u0434\u043A\u0440\u0438\u0442\u0442\u0456 \u0432\u043A\u043B\u0430\u0434\u043A\u0438 \u0437 Gravis \u0430\u043A\u0442\u0438\u0432\u0443\u0439\u0442\u0435 \u0441\u043A\u0440\u0438\u043F\u0442 \u0432 \u043D\u0456\u0439 \u0442\u0430\u043A\u043E\u0436.`,excludeDeps:["REFURB","WHD"],getHandler:()=>window.__gravis}];if(window.location.href.includes("gravis"))(async()=>{let S=window.__SH_BRANCH||"main",a=S==="local"?"http://localhost:3000/dist/hub_gravis.js":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${S}/dist/hub_gravis.js`;try{let t=await fetch(a);if(!t.ok)throw new Error(`HTTP ${t.status}`);let u=await t.text(),l=document.createElement("script");l.textContent=u,document.head.appendChild(l)}catch(t){alert(`\u26A0\uFE0F Failed to load Gravis Hub: ${t}`)}})();else if(window.__scriptHubLoaded){let S=document.getElementById("sh-panel");S&&(S.classList.contains("sh-open")?(S.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(a=>a.classList.remove("sh-expanded")),window.dispatchEvent(new CustomEvent("sh-panel-closed"))):S.classList.add("sh-open"))}else{window.__scriptHubLoaded=!0;async function S(u){let l=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(u));return Array.from(new Uint8Array(l)).map(T=>T.toString(16).padStart(2,"0")).join("")}async function a(){return new Promise(u=>{let l=Date.now(),T=async()=>{let L=document.querySelector("p.user__username");L&&L.textContent?u(await S(L.textContent.trim())):Date.now()-l>1e4?u(null):setTimeout(T,500)};T()})}let t=["24deb6961c3cef1d2e3795aaf4b7e3fe8d83d20adff06215426c05827c8351ca","710a0c6095723bc0a46d78897497b5af0417cee56708fdc10cca6860b686ea6e","bc95a4675c77e3ee07d42d825c05e403c3861d29b24ddd57c6e30ebb7a8c2336","49480808159cde937909eaad603911749197829c0cea7a8b68c29e63c98538c0","61678f96fc810a611097d9b0bc98bc8ecb0abee7cd55f2faa19b455604dc2332","2f5ae5e87d1a659e1a01e2bc2c38441bba81bb12eb39d59695b4960576012c55","004381f7f5b3ace58d7dc03a047674325acd266ddc576c273942fdb7237f7130","f355a6794c9a044989a7d2e5bc1e3aa5bff909a38adfbdc68cc0433042ea84b9"];(async()=>{let u=window.__SH_BRANCH||"main",l=!1;if(u==="local")l=!0;else{let n=await a();if(!n||(l=t.includes(n),u==="development"&&!l))return}let T=u==="local"?"http://localhost:3000/dist":`https://raw.githubusercontent.com/alisohub/fc_amazon/refs/heads/${u}/dist`,I=new URLSearchParams(window.location.search).get("gradingMode"),x=[];I==="CRETURN_PRIMARY_GRADING"?x=["UG"]:I==="CRETURN"?x=["FAST","CRET"]:I==="CRETURN_REFURB"?x=["REFURB"]:I==="WAREHOUSE_DEALS"?x=["WHD"]:x=["FAST","CRET","UG","REFURB","WHD"];function b(n){return n==="FAST"||n==="CRET"||n==="UG"||n==="REFURB"||n==="WHD"}let w=localStorage.getItem(C),p=b(w)&&x.includes(w)?w:x[0];if(w!==p)try{localStorage.setItem(C,p)}catch{}let _=K(()=>p);async function v(n,c,i){let g=c.checked,o=n.getHandler();if(g&&!o){c.disabled=!0;let m=`${T}/${n.file}?cb=${Date.now()}`;try{let d=await fetch(m);if(!d.ok)throw new Error(`HTTP ${d.status}`);let y=await d.text(),M=document.createElement("script");M.textContent=y,document.head.appendChild(M),o=n.getHandler(),c.disabled=!1}catch(d){alert(`\u26A0\uFE0F Failed to load ${n.name}:
${d.message}`),c.checked=!1,c.disabled=!1;return}}o&&(g?(o.enable(),n.renderSettings&&i&&(i.style.display="block",n.renderSettings(i))):(o.disable(),i&&(i.style.display="none",i.innerHTML="")))}["keydown","keyup","keypress"].forEach(n=>{window.addEventListener(n,c=>{let i=c.target;i&&i.closest("#sh-root")&&c.stopPropagation()},!0)});function h(){let n="sh_panel_opacity",c=.4;try{let s=localStorage.getItem(n);if(s!==null){let f=parseFloat(s);!isNaN(f)&&f>=.1&&f<=1&&(c=f)}}catch{}let i=document.createElement("div");i.id="sh-root",i.innerHTML=`
                    <style>
                        ${W}
                    </style>
                    
                    <div id="sh-panel" style="opacity: ${c};">
                        <div class="sh-header">
                            <div class="sh-header-group">
                                <select id="sh-subdep-select" class="sh-dep-dropdown">
                                    ${x.map(s=>`<option value="${s}" ${p===s?"selected":""}>${s}</option>`).join(`
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
                                <input type="range" id="sh-panel-opacity" class="sh-range" min="0.1" max="1" step="0.05" value="${c}" />
                            </div>
                        </div>
                        <div class="sh-body" id="sh-list"></div>
                    </div>
                `,document.body.appendChild(i);let g=document.getElementById("sh-panel"),o=document.getElementById("sh-settings-toggle-btn"),m=document.getElementById("sh-global-settings"),d=document.getElementById("sh-panel-opacity");o&&m&&o.addEventListener("click",()=>{o.classList.toggle("active"),m.classList.toggle("sh-expanded")}),d&&d.addEventListener("input",s=>{let f=s.target,r=parseFloat(f.value);g.style.opacity=r.toString();try{localStorage.setItem(n,r.toString())}catch{}});function y(){g.classList.remove("sh-open"),document.querySelectorAll(".sh-adv-container").forEach(s=>s.classList.remove("sh-expanded")),m&&m.classList.remove("sh-expanded"),o&&o.classList.remove("active"),window.dispatchEvent(new CustomEvent("sh-panel-closed"))}document.addEventListener("mousedown",s=>{let f=s.target;g.classList.contains("sh-open")&&!g.contains(f)&&y()});let M=document.getElementById("sh-subdep-select");M&&M.addEventListener("change",s=>{let f=s.target;if(b(f.value)){p=f.value,localStorage.setItem(C,p);let r=N[p];if(r){if(window.__itemCounter){window.__itemCounter.updateSettings({targetRate:r.targetRate,doubleCountMode:r.doubleCountMode});let e=document.getElementById("sh-cfg-target");e&&(e.value=r.targetRate.toString())}else try{let e=JSON.parse(localStorage.getItem(A)||"{}");e.targetRate=r.targetRate,e.doubleCountMode=r.doubleCountMode,localStorage.setItem(A,JSON.stringify(e))}catch{}if(window.__offTask){window.__offTask.updateSettings({timeoutMins:r.offTaskMins});let e=document.getElementById("sh-ot-mins");e&&(e.value=r.offTaskMins.toString())}else try{let e=JSON.parse(localStorage.getItem(D)||"{}");e.timeoutMins=r.offTaskMins,localStorage.setItem(D,JSON.stringify(e))}catch{}}R.forEach(e=>{let E=document.getElementById(`sh-card-${e.id}`);if(E)if(e.excludeDeps?.includes(p)){E.style.display="none";let k=e.getHandler(),P=document.getElementById(`sh-chk-${e.id}`);k&&k.isActive()&&(k.disable(),P&&(P.checked=!1))}else E.style.display="block"})}}),document.addEventListener("keydown",s=>{if(s.key!=="Enter"||!window.__refurbLpnLoaded&&!window.__gravisLoaded&&!window.__clearSession)return;let f=s.target;if(!f||!f.matches("input"))return;let r=f.value?.trim();if(!r)return;let e=(f.getAttribute("data-testid")||"").toLowerCase(),E={lpnTestId:[z,F,U],wsTestId:j};try{if(E.lpnTestId.some(q=>e.includes(q.toLowerCase()))&&/^lpn[a-z0-9]+/i.test(r)){localStorage.getItem($)!==r&&(localStorage.setItem($,r),window.__gravis?.sendLpn(r));return}if(e.includes(E.wsTestId)&&/^ws[_-]+/i.test(r)){localStorage.setItem(G,r);return}}catch{}},!0);let R=_.filter(s=>!(s.experimental&&!["development","local"].includes(u)||s.isTrusted&&!l)),B=()=>{let s=document.getElementById("sh-chk-all");if(!s)return;let r=R.filter(e=>!(e.experimental||e.excludeDeps&&e.excludeDeps.includes(p))).map(e=>document.getElementById(`sh-chk-${e.id}`));s.checked=r.length>0&&r.every(e=>e&&e.checked)},O=document.getElementById("sh-list");O&&R.forEach(s=>{let f=s.getHandler(),r=f?f.isActive():!1,e=document.createElement("div");e.id=`sh-card-${s.id}`,e.className="sh-card",s.excludeDeps?.includes(p)&&(e.style.display="none"),e.innerHTML=`
                            <div class="sh-card-top">
                                <div class="sh-card-info">
                                    <div class="sh-card-title">${s.name}</div>
                                    <div class="sh-card-desc">${s.description}</div>
                                </div>
                                <label class="sh-switch">
                                    <input type="checkbox" id="sh-chk-${s.id}" ${r?"checked":""}>
                                    <span class="sh-slider"></span>
                                </label>
                            </div>
                            <div class="sh-card-settings" id="sh-settings-${s.id}"></div>
                        `,O.appendChild(e);let E=e.querySelector(`#sh-chk-${s.id}`),k=e.querySelector(`#sh-settings-${s.id}`);r&&s.renderSettings&&(k.style.display="block",s.renderSettings(k)),E&&(E.onchange=async()=>{await v(s,E,k),B()})});let H=document.getElementById("sh-chk-all");H&&H.addEventListener("change",s=>{let f=s.target.checked,r=[];R.forEach(e=>{if(e.experimental||e.excludeDeps&&e.excludeDeps.includes(p))return;let E=document.getElementById(`sh-chk-${e.id}`),k=document.getElementById(`sh-settings-${e.id}`);E&&E.checked!==f&&!E.disabled&&(E.checked=f,r.push(v(e,E,k)))}),r.length>0&&(H.disabled=!0,Promise.all(r).finally(()=>{H.disabled=!1,B()}))}),B(),setTimeout(()=>{g.classList.add("sh-open")},100)}h()})()}})();

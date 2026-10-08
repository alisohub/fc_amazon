"use strict";(()=>{var _="sh_dev_inspector_settings";if(!window.__devInspectorLoaded){let i=function(o){if(!r)return;let n=o.target;if(n.closest("#sh-root"))return;(n.tagName.toLowerCase()==="a"||n.closest("a"))&&o.preventDefault();let t=`\u{1F50D} Element: <${n.tagName.toLowerCase()}>
`;if(t+=`--------------------------------
`,e.showCoords&&(t+=`\u{1F4CD} COORDINATES:
`,t+=`   Client (Screen): X: ${o.clientX}, Y: ${o.clientY}
`,t+=`   Page (Scroll):   X: ${o.pageX}, Y: ${o.pageY}
`,t+=`--------------------------------
`),e.showDetails){t+=`\u{1F4DD} RAW HTML:
`;let s=n.outerHTML||"None";t+=`${s}
`,t+=`--------------------------------
`}if(e.showCSS){t+=`\u{1F3A8} CSS:
`,t+=`   Inline CSS: ${n.style.cssText||"None"}
`;let s=window.getComputedStyle(n);t+=`   Display: ${s.display}
`,t+=`   Position: ${s.position}
`,t+=`   Color: ${s.color}
`,t+=`   Background: ${s.backgroundColor}
`,t+=`   Font-Size: ${s.fontSize}
`,t+=`--------------------------------
`}alert(t.trim())};a=i,window.__devInspectorLoaded=!0;let r=!1,e={showDetails:!0,showCSS:!1,showCoords:!1};try{let o=localStorage.getItem(_);o&&(e={...e,...JSON.parse(o)})}catch{}document.addEventListener("click",i,!0),window.__devInspector={enable:()=>{r=!0},disable:()=>{r=!1},isActive:()=>r,getSettings:()=>e,updateSettings:o=>{e={...e,...o};try{localStorage.setItem(_,JSON.stringify(e))}catch{}}}}var a;})();

"use strict";(()=>{var _="sh_dev_inspector_settings";if(!window.__devInspectorLoaded){let i=function(o){if(!r)return;let e=o.target;if(e.closest("#sh-root"))return;(e.tagName.toLowerCase()==="a"||e.closest("a"))&&o.preventDefault();let t=`\u{1F50D} Element: <${e.tagName.toLowerCase()}>
`;if(t+=`--------------------------------
`,n.showCoords&&(t+=`\u{1F4CD} COORDINATES:
`,t+=`   Client (Screen): X: ${o.clientX}, Y: ${o.clientY}
`,t+=`   Page (Scroll):   X: ${o.pageX}, Y: ${o.pageY}
`,t+=`--------------------------------
`),n.showDetails){t+=`\u{1F4DD} RAW HTML:
`;let s=e.outerHTML||"None";t+=`${s}
`,t+=`--------------------------------
`}if(n.showCSS){t+=`\u{1F3A8} CSS:
`,t+=`   Inline CSS: ${e.style.cssText||"None"}
`;let s=window.getComputedStyle(e);t+=`   Display: ${s.display}
`,t+=`   Position: ${s.position}
`,t+=`   Color: ${s.color}
`,t+=`   Background: ${s.backgroundColor}
`,t+=`   Font-Size: ${s.fontSize}
`,t+=`--------------------------------
`}alert(t.trim())};c=i,window.__devInspectorLoaded=!0;let r=!1,n={showDetails:!0,showCSS:!1,showCoords:!1};try{let o=localStorage.getItem(_);o&&(n={...n,...JSON.parse(o)})}catch{}document.addEventListener("click",i,!0),window.__devInspector={enable:()=>{r=!0},disable:()=>{r=!1},isActive:()=>r,getSettings:()=>n,updateSettings:o=>{n={...n,...o};try{localStorage.setItem(_,JSON.stringify(n))}catch{}}}}var c;})();

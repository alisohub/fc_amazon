"use strict";(()=>{var _="sh_dev_inspector_settings";if(!window.__devInspectorLoaded){let i=function(o){if(!r)return;let s=o.target;if(s.closest("#sh-root"))return;(s.tagName.toLowerCase()==="a"||s.closest("a"))&&o.preventDefault();let t=`\u{1F50D} Element: <${s.tagName.toLowerCase()}>
`;if(t+=`--------------------------------
`,n.showCoords&&(t+=`\u{1F4CD} COORDINATES:
`,t+=`   Client (Screen): X: ${o.clientX}, Y: ${o.clientY}
`,t+=`   Page (Scroll):   X: ${o.pageX}, Y: ${o.pageY}
`,t+=`--------------------------------
`),n.showDetails){t+=`\u{1F4DD} RAW HTML:
`;let e=s.outerHTML||"None";e.length>800&&(e=e.substring(0,800)+`
...[TRUNCATED]`),t+=`${e}
`,t+=`--------------------------------
`}if(n.showCSS){t+=`\u{1F3A8} CSS:
`,t+=`   Inline CSS: ${s.style.cssText||"None"}
`;let e=window.getComputedStyle(s);t+=`   Display: ${e.display}
`,t+=`   Position: ${e.position}
`,t+=`   Color: ${e.color}
`,t+=`   Background: ${e.backgroundColor}
`,t+=`   Font-Size: ${e.fontSize}
`,t+=`--------------------------------
`}alert(t.trim())};a=i,window.__devInspectorLoaded=!0;let r=!1,n={showDetails:!0,showCSS:!1,showCoords:!1};try{let o=localStorage.getItem(_);o&&(n={...n,...JSON.parse(o)})}catch{}document.addEventListener("click",i,!0),window.__devInspector={enable:()=>{r=!0},disable:()=>{r=!1},isActive:()=>r,getSettings:()=>n,updateSettings:o=>{n={...n,...o};try{localStorage.setItem(_,JSON.stringify(n))}catch{}}}}var a;})();

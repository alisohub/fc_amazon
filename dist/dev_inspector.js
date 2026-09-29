"use strict";(()=>{if(!window.__devInspectorLoaded){let r=function(t){if(!i)return;let s=t.target;if(s.closest("#sh-root"))return;(s.tagName.toLowerCase()==="a"||s.closest("a"))&&t.preventDefault();let e=`\u{1F50D} Element: <${s.tagName.toLowerCase()}>
`;if(e+=`--------------------------------
`,n.showCoords&&(e+=`\u{1F4CD} COORDINATES:
`,e+=`   Client (Screen): X: ${t.clientX}, Y: ${t.clientY}
`,e+=`   Page (Scroll):   X: ${t.pageX}, Y: ${t.pageY}
`,e+=`--------------------------------
`),n.showDetails){e+=`\u{1F4DD} RAW HTML:
`;let o=s.outerHTML||"None";o.length>800&&(o=o.substring(0,800)+`
...[TRUNCATED]`),e+=`${o}
`,e+=`--------------------------------
`}if(n.showCSS){e+=`\u{1F3A8} CSS:
`,e+=`   Inline CSS: ${s.style.cssText||"None"}
`;let o=window.getComputedStyle(s);e+=`   Display: ${o.display}
`,e+=`   Position: ${o.position}
`,e+=`   Color: ${o.color}
`,e+=`   Background: ${o.backgroundColor}
`,e+=`   Font-Size: ${o.fontSize}
`,e+=`--------------------------------
`}alert(e.trim())};l=r,window.__devInspectorLoaded=!0;let i=!1,a="sh_dev_inspector_settings",n={showDetails:!0,showCSS:!1,showCoords:!1};try{let t=localStorage.getItem(a);t&&(n={...n,...JSON.parse(t)})}catch{}document.addEventListener("click",r,!0),window.__devInspector={enable:()=>{i=!0},disable:()=>{i=!1},isActive:()=>i,getSettings:()=>n,updateSettings:t=>{n={...n,...t};try{localStorage.setItem(a,JSON.stringify(n))}catch{}}}}var l;})();

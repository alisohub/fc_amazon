"use strict";(()=>{if(!window.__devInspectorLoaded){let r=function(t){if(!a)return;let n=t.target;if(n.closest("#sh-root"))return;(n.tagName.toLowerCase()==="a"||n.closest("a"))&&t.preventDefault();let e=`\u{1F50D} Element: <${n.tagName.toLowerCase()}>
`;if(e+=`--------------------------------
`,o.showCoords&&(e+=`\u{1F4CD} COORDINATES:
`,e+=`   Client (Screen): X: ${t.clientX}, Y: ${t.clientY}
`,e+=`   Page (Scroll):   X: ${t.pageX}, Y: ${t.pageY}
`,e+=`--------------------------------
`),o.showDetails){e+=`\u{1F4DD} DETAILS:
`,e+=`   ID: ${n.id||"None"}
`,e+=`   Classes: ${n.className||"None"}
`,e+=`   Aria-Label: ${n.getAttribute("aria-label")||"None"}
`;let s=n.textContent?.trim().replace(/\s+/g," ")||"None",l=s.length>60?s.substring(0,60)+"...":s;e+=`   Text: "${l}"
`,e+=`--------------------------------
`}if(o.showCSS){e+=`\u{1F3A8} CSS:
`,e+=`   Inline CSS: ${n.style.cssText||"None"}
`;let s=window.getComputedStyle(n);e+=`   Display: ${s.display}
`,e+=`   Position: ${s.position}
`,e+=`   Color: ${s.color}
`,e+=`   Background: ${s.backgroundColor}
`,e+=`   Font-Size: ${s.fontSize}
`,e+=`--------------------------------
`}alert(e.trim())};c=r,window.__devInspectorLoaded=!0;let a=!1,i="sh_dev_inspector_settings",o={showDetails:!0,showCSS:!1,showCoords:!1};try{let t=localStorage.getItem(i);t&&(o={...o,...JSON.parse(t)})}catch{}document.addEventListener("click",r,!0),window.__devInspector={enable:()=>{a=!0},disable:()=>{a=!1},isActive:()=>a,getSettings:()=>o,updateSettings:t=>{o={...o,...t};try{localStorage.setItem(i,JSON.stringify(o))}catch{}}}}var c;})();

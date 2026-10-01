'use strict';
// Lightweight, dependency-free 3D geometry renderer. Orthographic orbit, depth sorting,
// selectable world-space markers, and an equivalent top-down view.
(()=>{
const canvas=document.getElementById('factory-canvas'),ctx=canvas.getContext('2d');
if(!ctx)return;
let yaw=-.62,pitch=.64,plan=false,w=700,h=490,zoom=1,faces=[],markers=[],drag=null;
const hot=[[-3.9,2.9,-1.8],[3.2,2.1,-1.65],[3.5,2.5,2.8]];
function proj(v){const x=v[0]*Math.cos(yaw)-v[2]*Math.sin(yaw),z=v[0]*Math.sin(yaw)+v[2]*Math.cos(yaw);const py=plan?-z:v[1]*Math.cos(pitch)-z*Math.sin(pitch);const depth=plan?-v[1]:z*Math.cos(pitch)+v[1]*Math.sin(pitch);const scale=Math.min(w/18,h/13.5)*zoom;return{x:w/2+x*scale,y:h*.55-py*scale,z:depth};}
function poly(v,color,stroke){const pts=v.map(proj);faces.push({pts,color,stroke,layer:1,z:pts.reduce((a,p)=>a+p.z,0)/pts.length});}
function shade(hex,f){let s=hex.replace('#','');let r=parseInt(s.slice(0,2),16),g=parseInt(s.slice(2,4),16),b=parseInt(s.slice(4,6),16);return'rgb('+[r,g,b].map(x=>Math.min(255,Math.round(x*f))).join(',')+')';}
function box(x,y,z,dx,dy,dz,c){const x1=x-dx/2,x2=x+dx/2,y1=y,y2=y+dy,z1=z-dz/2,z2=z+dz/2;
poly([[x1,y2,z1],[x2,y2,z1],[x2,y2,z2],[x1,y2,z2]],shade(c,1.1));
poly([[x1,y1,z1],[x2,y1,z1],[x2,y2,z1],[x1,y2,z1]],shade(c,.83));
poly([[x1,y1,z2],[x2,y1,z2],[x2,y2,z2],[x1,y2,z2]],shade(c,.93));
poly([[x1,y1,z1],[x1,y1,z2],[x1,y2,z2],[x1,y2,z1]],shade(c,.74));
poly([[x2,y1,z1],[x2,y1,z2],[x2,y2,z2],[x2,y2,z1]],shade(c,.96));}
function floorRect(x,z,dx,dz,c,y=.022){poly([[x-dx/2,y,z-dz/2],[x+dx/2,y,z-dz/2],[x+dx/2,y,z+dz/2],[x-dx/2,y,z+dz/2]],c);faces[faces.length-1].layer=0;}
function cnc(x,z){box(x,.06,z,2.5,.15,1.8,'#A0B2C7');box(x,.2,z,2.4,1.8,1.65,'#D4DEED');box(x,.23,z+.85,2.35,.28,.06,'#54789E');box(x,.7,z+.84,1.45,.95,.07,'#163E70');box(x,.76,z+.9,.02,.84,.045,'#9FB9D7');box(x+.95,.75,z+.9,.3,.75,.17,'#7DA7CF');box(x+.96,1.0,z+1,.22,.32,.03,'#0A4595');box(x,2.0,z,2.4,.1,1.65,'#3F7EB4');box(x+.8,2.1,z-.45,.07,.25,.07,'#406F9F');box(x+.8,2.35,z-.45,.12,.14,.12,'#b3cfa9');}
function worker(x,z,c){box(x-.105,.07,z,.14,.52,.21,'#123C6B');box(x+.105,.07,z,.14,.52,.21,'#123C6B');box(x,.59,z,.45,.55,.25,c);box(x-.28,.61,z,.13,.49,.19,c);box(x+.28,.61,z,.13,.49,.19,c);box(x,1.15,z,.25,.25,.24,'#caab8c');box(x,1.36,z,.33,.12,.32,'#f0eee0');box(x,1.33,z+.025,.37,.04,.38,'#e0e3d4');}
function pallet(x,z){box(x,.04,z,1.0,.13,.8,'#ac9970');for(let j=0;j<3;j++)box(x-.3+j*.3,.17,z,.2,.04,.8,'#c2b18b');box(x,.2,z,.75,.6,.55,'#b4ad92');}
function scene(){faces=[];box(0,-.22,0,13,.22,9,'#BCC9DA');faces.forEach(f=>f.layer=-1);floorRect(0,0,12.8,8.8,'#DFE6F1');for(let x=-6;x<7;x+=1.5)floorRect(x,0,.012,8.7,'#C7D4E6');for(let z=-4;z<5;z+=1.5)floorRect(0,z,12.7,.012,'#C7D4E6');floorRect(0,.6,12.8,1.65,'#779FCA');floorRect(0,-.26,12.7,.055,'#eddfa0');floorRect(0,1.46,12.7,.055,'#eddfa0');for(let x=-5.7;x<6;x+=1.15)floorRect(x,.62,.6,.03,'#D8E8F8');
// Low cutaway factory perimeter and regularly spaced structural posts.
box(0,0,-4.5,13,.65,.15,'#B6CAE2');box(-6.5,0,0,.15,.65,9,'#B6C9DF');for(let x=-6.3;x<=6.3;x+=3.15){box(x,0,-4.36,.18,3.25,.18,'#829FC0');box(x,3.25,-4.36,.32,.12,.28,'#A5BAD4');}box(0,3.12,-4.36,12.8,.12,.14,'#96B0CE');
cnc(-3.9,-2.05);cnc(-.8,-2.05);
// Assembly line with conveyor rollers and two workstations.
box(3.25,.55,-1.8,3.0,.3,1.1,'#6B91B6');for(let i=0;i<9;i++)box(2.0+i*.31,.86,-1.8,.12,.08,1.05,'#BECFE3');for(const x of [2.0,4.4])for(const z of [-2.16,-1.44])box(x,.08,z,.1,.49,.1,'#668AAC');box(3.2,.95,-1.8,.5,.32,.52,'#b0af97');box(4.6,.08,-2.75,.65,1.5,.45,'#B7CEE6');box(4.6,1.0,-2.5,.43,.4,.04,'#0A4595');
// Cooling skid, pipework and metal control cabinet.
box(3.5,.08,3.0,2.15,.2,1.45,'#6B94BA');box(3.0,.28,3.0,.85,1.5,1.15,'#9FBFDA');box(4.0,.28,3.0,.73,1.5,1.15,'#779EC5');for(let i=0;i<5;i++)box(3.0,.48+i*.19,3.59,.68,.035,.035,'#0A4595');box(3.5,1.8,3,.14,.1,1.3,'#3C6E9F');box(4.0,1.8,3,.1,.28,.1,'#3C6E9F');box(4.0,2.04,2.7,.1,.08,.65,'#3C6E9F');
// Storage and maintenance bench.
for(const z of [2.35,3.5]){pallet(-4.65,z);pallet(-3.4,z);}box(-.75,.83,3.15,1.85,.14,.8,'#839677');for(const x of [-1.5,0])for(const z of [2.9,3.4])box(x,.05,z,.08,.78,.08,'#758f74');box(-.8,1.0,3.15,.35,.15,.25,'#c4ac73');box(-1.35,.98,3.16,.22,.23,.23,'#6e8d78');
worker(-2.0,-.45,'#0A4595');worker(-1.35,-.52,'#7D98BA');worker(3.75,-.45,'#497CBA');worker(.5,2.45,'#0A4595');
// Clear accent pads under the selected asset, drawn at floor level.
const pads=[[-3.9,-2.05,2.8,2.12],[3.25,-1.8,3.35,1.4],[3.5,3,2.5,1.75]];const p=pads[window.selectedFinding||0];for(const x of [-1,1])floorRect(p[0]+x*p[2]/2,p[1],.035,p[3],'#d1a658',.03);for(const z of [-1,1])floorRect(p[0],p[1]+z*p[3]/2,p[2],.035,'#d1a658',.03);
}
function render(){const r=canvas.parentElement.getBoundingClientRect();w=r.width;h=r.height;const dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);scene();faces.sort((a,b)=>a.layer-b.layer||a.z-b.z);for(const f of faces){ctx.beginPath();f.pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();}markers=hot.map(proj);markers.forEach((p,i)=>{const active=i===(window.selectedFinding||0),colors=['#c19c4d','#648da1','#5e9671'];ctx.beginPath();ctx.moveTo(p.x,p.y+13);ctx.lineTo(p.x,p.y+28);ctx.strokeStyle=colors[i];ctx.lineWidth=1;ctx.stroke();if(active){ctx.beginPath();ctx.arc(p.x,p.y,21,0,Math.PI*2);ctx.fillStyle='#ffffffaa';ctx.fill();ctx.strokeStyle=colors[i];ctx.lineWidth=1;ctx.stroke();}ctx.beginPath();ctx.arc(p.x,p.y,13,0,Math.PI*2);ctx.fillStyle=active?'#0A4595':colors[i];ctx.shadowColor='#1d493532';ctx.shadowBlur=8;ctx.shadowOffsetY=3;ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.fillStyle='#fff';ctx.font='600 10px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('0'+(i+1),p.x,p.y+.5);});}
window.renderFactory=render;
canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>5)drag.moved=true;if(!plan){yaw+=dx*.008;pitch=Math.max(.32,Math.min(1.15,pitch+dy*.004));}drag.x=e.clientX;drag.y=e.clientY;render();});
canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved){const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=-1,dist=30;markers.forEach((p,i)=>{const d=Math.hypot(p.x-x,p.y-y);if(d<dist){best=i;dist=d;}});if(best>=0)window.selectFinding(best);}drag=null;});canvas.addEventListener('pointercancel',()=>drag=null);
document.getElementById('view-toggle').addEventListener('click',e=>{plan=!plan;e.target.setAttribute('aria-pressed',String(plan));e.target.textContent=plan?'3D view':'2D plan';document.getElementById('scene-help').textContent=plan?'Select a numbered marker to explore':'Drag to rotate · Select a numbered marker';render();});
document.getElementById('reset-view').addEventListener('click',()=>{yaw=-.62;pitch=.64;zoom=1;render();});document.getElementById('rotate-left').addEventListener('click',()=>{yaw-=.28;render();});document.getElementById('rotate-right').addEventListener('click',()=>{yaw+=.28;render();});new ResizeObserver(render).observe(canvas.parentElement);render();
})();

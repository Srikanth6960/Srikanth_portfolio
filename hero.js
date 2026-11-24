/* Hero animation. Needs script.js loaded first. */
/* Hero: a live sensor trace with an eye-blink spike, a nod to the IoT work. It reacts to the pointer. */
const cv=$("wave"),cx=cv.getContext("2d");let W,H,x0=0,boost=0;
const still=matchMedia("(prefers-reduced-motion: reduce)").matches;
function size(){const r=devicePixelRatio||1;W=cv.clientWidth;H=cv.clientHeight;cv.width=W*r;cv.height=H*r;cx.setTransform(r,0,0,r,0,0)}
addEventListener("resize",size);size();
cv.addEventListener("pointermove",()=>boost=1);
const sig=x=>{const p=((x%420)+420)%420;let y=Math.sin(x*.05)*2+Math.sin(x*.13)*1.5;
 if(p>180&&p<200){y-=Math.sin((p-180)/20*Math.PI)*H*.34}else if(p>200&&p<222){y+=Math.sin((p-200)/22*Math.PI)*H*.14}return y};
function draw(){const s=getComputedStyle(root);cx.clearRect(0,0,W,H);
 const g=cx.createLinearGradient(0,0,W,0);g.addColorStop(0,"transparent");g.addColorStop(.25,s.getPropertyValue("--ac"));g.addColorStop(.85,s.getPropertyValue("--ac2"));g.addColorStop(1,"transparent");
 cx.strokeStyle=g;cx.lineWidth=2;cx.beginPath();
 for(let x=0;x<=W;x+=2){const y=H*.6+sig(x+x0)*(1+boost*.8)+(Math.random()-.5)*boost*5;x?cx.lineTo(x,y):cx.moveTo(x,y)}
 cx.stroke();x0+=1.6;boost*=.96;if(!still)requestAnimationFrame(draw)}
draw();

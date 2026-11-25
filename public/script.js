/* Core behaviour: theme, navigation, ticker, spotlight and scroll progress. Loaded first. */
const root=document.documentElement,$=id=>document.getElementById(id);
try{const t=localStorage.getItem("theme");if(t)root.dataset.theme=t;else if(matchMedia("(prefers-color-scheme: light)").matches)root.dataset.theme="light"}catch(e){}
$("theme").onclick=()=>{const t=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=t;try{localStorage.setItem("theme",t)}catch(e){}};
const links=$("links"),burger=$("burger");
burger.onclick=()=>{const o=links.classList.toggle("open");burger.setAttribute("aria-expanded",o)};
links.addEventListener("click",e=>{if(e.target.closest("a")){links.classList.remove("open");burger.setAttribute("aria-expanded",false)}});

/* Marquee and card spotlight */
const mi=$("mqi"),tk="React.js,Python,Node.js,MongoDB,Tailwind CSS,UI/UX,IoT,Machine Learning,Firebase,Git".split(",").map(t=>"<span>"+t+"</span>").join("");mi.innerHTML=tk+tk;
document.addEventListener("pointermove",e=>{const c=e.target.closest(".box,.sk,.dz");if(c){const r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")}});


/* Scroll progress and active nav link */
const pg=$("pg");addEventListener("scroll",()=>{pg.style.width=scrollY/(document.body.scrollHeight-innerHeight)*100+"%"},{passive:true});
const nl=[...document.querySelectorAll(".links a[href^='#']:not(.btn)")];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)nl.forEach(a=>a.classList.toggle("act",a.getAttribute("href")==="#"+e.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("section[id]").forEach(x=>io.observe(x));

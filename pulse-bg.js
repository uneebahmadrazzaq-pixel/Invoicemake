(function(){
  const canvas=document.getElementById("pulseAtmosphere");
  if(!canvas||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const gl=canvas.getContext("webgl",{alpha:true,antialias:false}); if(!gl)return;
  const vs=`attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
  const fs=`precision mediump float;uniform vec2 resolution;uniform vec2 pointer;uniform float time;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  void main(){vec2 uv=gl_FragCoord.xy/resolution.xy;vec2 drift=(pointer-.5)*.035;vec2 ratio=vec2(resolution.x/resolution.y,1.);
  vec2 field=(uv+drift)*ratio*52.;vec2 cell=floor(field);vec2 local=fract(field)-.5;float rnd=hash(cell);
  float breathe=.72+.28*sin(time*.22+rnd*6.283);float particle=1.-smoothstep(.035,.13,length(local));particle*=step(.68,rnd)*breathe;
  vec2 p=uv-.5;p.x*=resolution.x/resolution.y;float depth=1.-smoothstep(.18,.86,length(p));
  float glow=.035/max(.045,length(p-vec2(.18+sin(time*.13)*.05,.08)));
  vec3 lime=vec3(.847,1.,.478),cyan=vec3(.49,.906,.843);vec3 color=mix(cyan,lime,rnd)*particle*.55+cyan*glow*.035;
  gl_FragColor=vec4(color,clamp((particle*.34+glow*.018)*depth,0.,.32));}`;
  function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null}
  const vertex=compile(gl.VERTEX_SHADER,vs),fragment=compile(gl.FRAGMENT_SHADER,fs);if(!vertex||!fragment)return;
  const program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);gl.useProgram(program);
  const pos=gl.getAttribLocation(program,"position");gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  const res=gl.getUniformLocation(program,"resolution"),ptr=gl.getUniformLocation(program,"pointer"),tm=gl.getUniformLocation(program,"time"),state={x:.5,y:.5,tx:.5,ty:.5};
  addEventListener("pointermove",e=>{state.tx=e.clientX/innerWidth;state.ty=1-e.clientY/innerHeight},{passive:true});
  function resize(){const r=Math.min(devicePixelRatio||1,1.5);canvas.width=innerWidth*r;canvas.height=innerHeight*r;gl.viewport(0,0,canvas.width,canvas.height)}
  function render(ms){state.x+=(state.tx-state.x)*.025;state.y+=(state.ty-state.y)*.025;gl.uniform2f(res,canvas.width,canvas.height);gl.uniform2f(ptr,state.x,state.y);gl.uniform1f(tm,ms*.001);gl.drawArrays(gl.TRIANGLES,0,6);requestAnimationFrame(render)}
  addEventListener("resize",resize,{passive:true});resize();requestAnimationFrame(render);
})();

(function(){
  const canvas=document.getElementById("heroWave"),hero=document.querySelector(".landing-hero");
  if(!canvas||!hero)return;
  const ctx=canvas.getContext("2d"),reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width=0,height=0,dpr=1,pointerX=.5,pointerY=.5;
  function resize(){const rect=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);width=Math.max(1,rect.width);height=Math.max(1,rect.height);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  function waveY(x,t,layer){
    const nx=x/width,center=.5+(pointerX-.5)*.08,focus=Math.exp(-Math.pow((nx-center)*3.1,2));
    const base=height*(.48+(pointerY-.5)*.025)+(layer-1.5)*9;
    const slow=Math.sin(nx*8.2-t*(.46+layer*.035)+layer*.82)*height*.042;
    const detail=Math.sin(nx*19.5+t*(.34+layer*.025)+layer*1.7)*height*.014;
    const ripple=Math.sin(nx*38-t*.72+layer*.55)*height*.0045;
    return base+(slow+detail+ripple)*(.34+focus*1.08)+(nx-.5)*height*.018;
  }
  function draw(ms){
    const t=ms*.001;
    ctx.clearRect(0,0,width,height);
    const gradient=ctx.createLinearGradient(0,0,width,0);
    gradient.addColorStop(0,"rgba(125,231,215,0)");gradient.addColorStop(.12,"rgba(125,231,215,.24)");gradient.addColorStop(.38,"rgba(125,231,215,.78)");gradient.addColorStop(.56,"rgba(238,248,244,.98)");gradient.addColorStop(.76,"rgba(216,255,122,.9)");gradient.addColorStop(1,"rgba(216,255,122,0)");
    for(let layer=3;layer>=0;layer--){
      ctx.beginPath();
      for(let x=0;x<=width;x+=2){const y=waveY(x,t,layer);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
      ctx.strokeStyle=gradient;ctx.lineWidth=layer===1?2.15:1;ctx.globalAlpha=layer===1?.94:.22;ctx.shadowColor=layer<2?"#d8ff7a":"#7de7d7";ctx.shadowBlur=layer===1?20:12;ctx.stroke();
    }
    const nodes=[.28,.57,.74,.88];
    nodes.forEach((start,index)=>{
      const nx=(start+t*(.018+index*.002))%1,x=nx*width,y=waveY(x,t,index%4);
      ctx.beginPath();ctx.arc(x,y,4.5+(index%2)*1.5,0,Math.PI*2);ctx.globalAlpha=.84;ctx.fillStyle=index<2?"#aef4e7":"#d8ff7a";ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=18;ctx.fill();
    });
    ctx.globalAlpha=1;ctx.shadowBlur=0;
    if(!reduced)requestAnimationFrame(draw);
  }
  hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width;pointerY=(e.clientY-r.top)/r.height},{passive:true});
  addEventListener("resize",resize,{passive:true});resize();requestAnimationFrame(draw);
})();

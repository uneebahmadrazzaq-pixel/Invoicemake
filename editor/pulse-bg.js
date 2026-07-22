(function(){
  const canvas=document.getElementById("pulseAtmosphere");
  if(!canvas||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const gl=canvas.getContext("webgl",{alpha:true,antialias:false}); if(!gl)return;
  const vs=`attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
  const fs=`precision mediump float;uniform vec2 resolution;uniform vec2 pointer;uniform float time;
  float line(float v,float w){return 1.-smoothstep(0.,w,abs(v));}
  void main(){vec2 uv=gl_FragCoord.xy/resolution.xy;vec2 p=uv-.5;p.x*=resolution.x/resolution.y;p+=(pointer-.5)*.045;
  float b=sin(time*.22)*.035;float d=max(.12,uv.y+.08);vec2 g=vec2(p.x/d,1./d+time*.012);
  float lattice=max(line(fract(g.x*5.)-.5,.018),line(fract(g.y*.85)-.5,.022))*smoothstep(.05,.82,uv.y);
  float c=.045/max(.04,length(p-vec2(-.32+b,-.12)));float v=.05/max(.05,length(p-vec2(.34-b,.22)));
  vec3 coral=vec3(1.,.416,.333),violet=vec3(.545,.361,.965);vec3 color=lattice*mix(violet,coral,uv.x)*.13+coral*c*.08+violet*v*.075;
  float fade=smoothstep(0.,.22,uv.y)*(1.-smoothstep(.8,1.08,length(p)));gl_FragColor=vec4(color,clamp((lattice*.18+c*.03+v*.03)*fade,0.,.34));}`;
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
    const nx=x/width,center=.5+(pointerX-.5)*.08,focus=Math.exp(-Math.pow((nx-center)*3.5,2));
    const base=height*(.47+(pointerY-.5)*.025);
    const slow=Math.sin(nx*10.5-t*.82+layer)*height*.035;
    const detail=Math.sin(nx*29+t*1.25+layer*2.1)*height*.012;
    return base+(slow+detail)*(.18+focus*1.35)+(nx-.5)*height*.025;
  }
  function draw(ms){const t=ms*.001;ctx.clearRect(0,0,width,height);const gradient=ctx.createLinearGradient(0,0,width,0);gradient.addColorStop(0,"rgba(139,92,246,0)");gradient.addColorStop(.23,"rgba(139,92,246,.65)");gradient.addColorStop(.5,"rgba(255,244,234,.98)");gradient.addColorStop(.68,"rgba(255,106,85,.92)");gradient.addColorStop(1,"rgba(255,106,85,0)");
    for(let layer=2;layer>=0;layer--){ctx.beginPath();for(let x=0;x<=width;x+=3){const y=waveY(x,t-layer*.18,layer*.28)+(layer-1)*7;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.strokeStyle=gradient;ctx.lineWidth=layer===0?2.2:1;ctx.globalAlpha=layer===0?1:.28;ctx.shadowColor=layer===0?"#ff8a76":"#8b5cf6";ctx.shadowBlur=layer===0?22:34;ctx.stroke()}
    ctx.globalAlpha=1;ctx.shadowBlur=0;if(!reduced)requestAnimationFrame(draw)}
  hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width;pointerY=(e.clientY-r.top)/r.height},{passive:true});
  addEventListener("resize",resize,{passive:true});resize();requestAnimationFrame(draw);
})();

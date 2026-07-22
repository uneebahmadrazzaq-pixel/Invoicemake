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

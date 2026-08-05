(function(){
"use strict";
var fs=require("fs"),F="USER/HAMCO_LED.json";
function n(v,a,b,d){v=Number(v);return isNaN(v)?d:v<a?a:v>b?b:v}
function state(x){x=x||{};return{color:n(x.color===undefined?x.c:x.color,0,8,0)|0,level:n(x.level===undefined?x.l:x.level,.25,1,1),effect:n(x.effect===undefined?x.e:x.effect,0,15,0)|0}}
function load(){try{return state(JSON.parse(fs.readFileSync(F)))}catch(e){return{color:0,level:1,effect:0}}}
function save(s){try{fs.writeFileSync(F,JSON.stringify(s));return true}catch(e){return false}}
function stop(o){try{if(o&&o.timer)clearInterval(o.timer)}catch(e){}try{if(o&&o.remove)o.remove()}catch(e2){}}
function install(){
 if(global.HAMCO_LED&&global.HAMCO_LED.v===201)return global.HAMCO_LED;
 stop(global.HAMCO_LED);stop(global.HAMCO_TVPIP_LED);stop(global.HAMCO_LED_LOADER);stop(Pip.HAMCoLED);
 var C=[[1,.5,0],[1,0,0],[0,1,0],[0,0,1],[0,1,1],[.65,0,1],[1,.34,0],[1,1,1],[0,0,0]],FA=[[1,0,0],[1,.34,0],[0,1,0],[0,1,1],[0,0,1],[.65,0,1]],H1=[.18,.72,1,.48,.12],H2=[.12,.5,1,.78,.35,.1],SOS="101010001110111011100010101000000000";
 var S={v:201,s:load(),timer:0,k:0,sleep:0};
 function pwm(p,v){v=n(v,0,1,0);try{analogWrite(p,v,{soft:true,freq:200});return}catch(e){}try{p.write(v>.01?1:0)}catch(e2){}}
 function off(){pwm(LED_RED,0);pwm(LED_GREEN,0);pwm(LED_BLUE,0);try{LED_RED.reset();LED_GREEN.reset();LED_BLUE.reset()}catch(e){}}
 function b(){var x=1;try{x=Math.pow(2,Pip.brightness/2)/1024}catch(e){}return n(x,0,1,1)*S.s.level}
 function rgb(r,g,bl,m){var x=b()*n(m,0,1,1);pwm(LED_RED,x*r);pwm(LED_GREEN,x*g);pwm(LED_BLUE,x*bl)}
 function frame(c,m){rgb(c[0],c[1],c[2],m)}
 function chosen(z,d){return C[z.color===0||z.color===8?d:z.color]}
 function restore(){off();try{Pip.updateBrightness()}catch(e){}}
 S.tick=function(){var z=this.s,k=this.k++,q,t,a,c,m,r;
  if(Pip.sleeping){if(!this.sleep)off();this.sleep=1;return}
  if(this.sleep){this.sleep=0;if(z.color===0&&z.effect===0){restore();return}}
  if(z.color===0&&z.effect===0)return;
  if(z.effect===0){frame(C[z.color],1);return}
  if(z.effect===1){frame(C[1+(((k/4)|0)%7)],1);return}
  if(z.effect===2){q=((k/12)|0)%6;t=(k%12)/12;a=FA[q];c=FA[(q+1)%6];rgb(a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t,a[2]+(c[2]-a[2])*t,1);return}
  if(z.effect===3){q=k%36;if(q>18)q=36-q;frame(chosen(z,6),.08+q*.051);return}
  if(z.effect===4){frame(C[1],((k/5)|0)%2?0:1);return}
  if(z.effect===5){if(k%3)return;if(Math.random()<.38){off();return}frame(C[1+((Math.random()*7)|0)],.35+Math.random()*.65);return}
  if(z.effect===6){q=k%32;if(q<10){frame(C[1],q%4<2?1:0);return}if(q<14){off();return}if(q<24){frame(C[3],q%4<2?1:0);return}off();return}
  if(z.effect===7){q=k%48;m=0;if(q<5)m=H1[q];else if(q>=8&&q<14)m=H2[q-8];frame(chosen(z,1),m);return}
  if(z.effect===8){r=Math.random();m=.48+r*.42;if(r<.12)m=.18+r;rgb(1,.2+Math.random()*.3,Math.random()*.035,m);return}
  if(z.effect===9){q=k%73;if(q===0||q===2||q===3||q===11){frame(C[7],q===3?.55:1);return}if(q===12){frame(chosen(z,4),.28);return}off();return}
  if(z.effect===10){r=Math.random();m=.35+r*.25;if(r<.1)m=.05;else if(r>.92)m=1;c=chosen(z,2);rgb(c[0]*.25,c[1],c[2]*.35,m);return}
  if(z.effect===11){q=((k/2)|0)%SOS.length;frame(chosen(z,6),SOS.charAt(q)==="1"?1:0);return}
  if(z.effect===12){q=k%40;t=q<20?q/20:(40-q)/20;rgb(.65*(1-t),t,1,.65+.35*t);return}
  if(z.effect===13){q=k%9;frame(chosen(z,7),q===0||q===2?1:0);return}
  if(z.effect===14){q=k%64;c=chosen(z,6);if(q<25){frame(c,.08+q*.036);return}if(q<34){frame(c,q%3===0?1:.15);return}if(q<38){off();return}if(q<42){frame(C[7],1);return}frame(c,.45);return}
  q=k%92;
  if(q<6){frame(C[1],1);return}
  if(q<12){off();return}
  if(q<18){frame(C[2],1);return}
  if(q<24){off();return}
  if(q<30){frame(C[3],1);return}
  if(q<36){off();return}
  if(q<42){frame(C[7],1);return}
  if(q<70){frame(C[2],(q-42)/28);return}
  if(q<84){frame(C[2],.72+((q%4)<2?.28:0));return}
  off()
 };
 S.apply=function(){this.k=0;this.sleep=0;if(this.s.color===0&&this.s.effect===0)restore();else this.tick()};
 S.set=function(c,l,e){this.s=state({color:c,level:l,effect:e});save(this.s);this.apply();return this.s};
 S.reload=function(){this.s=load();this.apply();return this.s};
 S.remove=function(){if(this.timer)clearInterval(this.timer);this.timer=0};
 S.timer=setInterval(function(){S.tick()},75);global.HAMCO_LED=S;S.apply();return S
}
function boot(){if(install())return;setTimeout(boot,250)}
boot();
}());

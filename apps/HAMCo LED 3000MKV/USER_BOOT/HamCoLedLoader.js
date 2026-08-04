(function(){
"use strict";
var fs=require("fs"),F="USER/HAMCO_LED.json";
function n(v,a,b,d){v=Number(v);return isNaN(v)?d:v<a?a:v>b?b:v}
function state(x){x=x||{};return{color:n(x.color===undefined?x.c:x.color,0,8,0)|0,level:n(x.level===undefined?x.l:x.level,.25,1,1),effect:n(x.effect===undefined?x.e:x.effect,0,5,0)|0}}
function load(){try{return state(JSON.parse(fs.readFileSync(F)))}catch(e){return{color:0,level:1,effect:0}}}
function save(s){try{fs.writeFileSync(F,JSON.stringify(s));return true}catch(e){return false}}
function stop(o){try{if(o&&o.timer)clearInterval(o.timer)}catch(e){}try{if(o&&o.remove)o.remove()}catch(e2){}}
function install(){
 if(typeof Pip==="undefined"||typeof LED_RED==="undefined"||typeof LED_GREEN==="undefined"||typeof LED_BLUE==="undefined")return null;
 if(global.HAMCO_LED&&global.HAMCO_LED.v===138)return global.HAMCO_LED;
 stop(global.HAMCO_LED);stop(global.HAMCO_TVPIP_LED);stop(global.HAMCO_LED_LOADER);stop(Pip.HAMCoLED);
 var C=[[1,.5,0],[1,0,0],[0,1,0],[0,0,1],[0,1,1],[.65,0,1],[1,.34,0],[1,1,1],[0,0,0]],FA=[[1,0,0],[1,.34,0],[0,1,0],[0,1,1],[0,0,1],[.65,0,1]];
 var S={v:138,s:load(),timer:0,k:0};
 function pwm(p,v){v=n(v,0,1,0);try{analogWrite(p,v,{soft:true,freq:200});return}catch(e){}try{p.write(v>.01?1:0)}catch(e2){}}
 function off(){pwm(LED_RED,0);pwm(LED_GREEN,0);pwm(LED_BLUE,0);try{LED_RED.reset();LED_GREEN.reset();LED_BLUE.reset()}catch(e){}}
 function b(){var x=1;try{x=Math.pow(2,Pip.brightness/2)/1024}catch(e){}return n(x,0,1,1)*S.s.level}
 function frame(c,m){var x=b()*n(m,0,1,1);pwm(LED_RED,x*c[0]);pwm(LED_GREEN,x*c[1]);pwm(LED_BLUE,x*c[2])}
 S.tick=function(){var z=this.s,k=this.k++,q,t,a,c;
  if(Pip.sleeping){off();return}
  if(z.color===0&&z.effect===0)return;
  if(z.effect===0){frame(C[z.color],1);return}
  if(z.effect===1){frame(C[1+(((k/4)|0)%7)],1);return}
  if(z.effect===2){q=((k/12)|0)%6;t=(k%12)/12;a=FA[q];c=FA[(q+1)%6];frame([a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t,a[2]+(c[2]-a[2])*t],1);return}
  if(z.effect===3){q=k%36;if(q>18)q=36-q;c=C[z.color===0||z.color===8?6:z.color];frame(c,.08+q*.051);return}
  if(z.effect===4){frame(C[1],((k/5)|0)%2?0:1);return}
  if(k%3)return;if(Math.random()<.38){off();return}frame(C[1+((Math.random()*7)|0)],.35+Math.random()*.65)
 };
 S.apply=function(){this.k=0;if(this.s.color===0&&this.s.effect===0){try{Pip.updateBrightness()}catch(e){}pwm(LED_BLUE,0)}else this.tick()};
 S.set=function(c,l,e){this.s=state({color:c,level:l,effect:e});save(this.s);this.apply();return this.s};
 S.reload=function(){this.s=load();this.apply();return this.s};
 S.remove=function(){if(this.timer)clearInterval(this.timer);this.timer=0};
 S.timer=setInterval(function(){S.tick()},75);global.HAMCO_LED=S;S.apply();return S
}
function boot(){if(install())return;setTimeout(boot,250)}
boot();
}());

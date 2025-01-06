(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();class _{constructor(e){this.content=e,this.dataTypes=["entero","real"],this.controlStructureKeywords=["si","sino","mientras","fin_si","fin_mientras"],this.operators=["+","-","*","/","%",">","<","=","!","&","|"],this.separators=[";",",","(",")"],this._index=0,this.currentChar=""}set index(e){this._index=e,this.currentChar=this.content.charAt(e)}get index(){return this._index}scan(){if(this.index>=this.content.length)return{value:"$",type:"Fin"};for(;/\s/.test(this.currentChar);)if(this.index++,this.index>=this.content.length)return{value:"$",type:"Fin"};let e="";if(this.currentChar==='"'){for(e+=this.currentChar,this.index++;this.currentChar!=='"'&&this.index<this.content.length;)e+=this.currentChar,this.index++;return this.currentChar!=='"'?{value:e,type:"error"}:(e+=this.currentChar,this.index++,{value:e,type:"error, el tipo cadena no es soportado"})}else if(/\d/.test(this.currentChar)){for(;/\d/.test(this.currentChar);)e+=this.currentChar,this.index++;if(this.currentChar==="."){for(e+=this.currentChar,this.index++;/\d/.test(this.currentChar);)e+=this.currentChar,this.index++;return{value:e,type:"real"}}if(/[\w]/.test(this.currentChar)){for(e+=this.currentChar;/\s/.test(this.currentChar);)e+=this.currentChar,this.index++;return{value:e,type:"error"}}return{value:e,type:"número"}}else if(/[a-zA-Z_]/.test(this.currentChar)){for(;/\w/.test(this.currentChar)&&(e+=this.currentChar,this.index++,!(this.index>=this.content.length)););let t;return this.controlStructureKeywords.includes(e)?t="palabra clave":this.dataTypes.includes(e)?t="data type":t="identificador",{value:e,type:t}}else if(this.operators.includes(this.currentChar)){let t=this.currentChar;const r=this.content.charAt(this.index+1),i=(...s)=>{s.includes(r)&&(t+=r,this.index++)};switch(this.currentChar){case"<":case">":case"=":case"!":i("=");break;case"+":case"-":case"*":case"/":case"%":i("=",this.currentChar);break;case"&":case"|":i(this.currentChar);break}return this.index++,{value:t,type:"operador"}}else return this.separators.includes(this.currentChar)?(e+=this.currentChar,this.index++,{value:e,type:"separador"}):(e+=this.currentChar,this.index++,{value:e,type:"error"})}}class g{constructor(e){this.scanner=e,this.message="",this.stack=[],this.token,this.simbolosDir={D:{1:["data type"]},D_R:{1:[","],2:[";"]},D_Q:{1:["="],2:[",",";"]},D_E:{1:["identificador","número","real"]},D_X:{1:["+","-"],2:[",",";"]},D_T:{1:["identificador","número","real"]},D_Y:{1:["*","/"],2:["+","-",",",";"]},D_F:{1:["identificador","número","real"]},A:{1:["identificador"]},A_E:{1:["identificador","número","real"]},A_X:{1:["+","-"],2:[";"]},A_T:{1:["identificador","número","real"]},A_Y:{1:["*","/"],2:["+","-",";"]},A_F:{1:["identificador","número","real"]},C:{1:["identificador","número","real"]},C_X:{1:["&&","||"],2:[")"]},C_T:{1:["identificador","número","real"]},C_Y:{1:["<",">","<=",">=","==","!="],2:["&&","||",")"]},C_F:{1:["identificador","número","real"]}}}parse(){for(this.stack=[],this.scanner.index=0,this.token=this.scanner.scan();this.token.type!=="Fin";)if(this.token.type==="data type"){if(!this.D())return!1;this.token=this.scanner.scan()}else if(this.token.type==="identificador"){if(!this.A())return!1;this.token=this.scanner.scan()}else if(this.token.type==="palabra clave"){if(!this.controlStructure())return!1}else return this.message="Error: Tipo de dato/identificador/palabra clave esperado",!1;if(this.stack.length>0){switch(this.stack[this.stack.length-1]){case"si":this.message="Error: fin_si esperado";break;case"mientras":this.message="Error: fin_mientras esperado";break}return!1}return!0}controlStructure(){const e=this.stack[this.stack.length-1]??"",t=this.token.value;if(t==="si"||t==="mientras")return this.stack.push(t),!!this.recognizeCondition();if(t==="sino"){if(e==="si")return this.token=this.scanner.scan(),!0;this.message="Error: si esperado"}else if(t==="fin_mientras"){if(e==="mientras")return this.stack.pop(),this.token=this.scanner.scan(),!0;this.message="Error: fin_mientras inesperado"}else if(t==="fin_si"){if(e==="si")return this.stack.pop(),this.token=this.scanner.scan(),!0;if(e==="sino")return this.stack.pop(),this.stack.pop(),this.token=this.scanner.scan(),!0;this.message="Error: fin_si inesperado"}return!1}recognizeCondition(){return this.token=this.scanner.scan(),this.token.value!=="("?(this.message="Error: Se esperaba un paréntesis de apertura después de la palabra clave de la estructura de control",!1):(this.token=this.scanner.scan(),this.C()?this.token.value!==")"?(this.message="Error: Se esperaba un paréntesis de cierre después de la condición",!1):(this.token=this.scanner.scan(),this.token.value==="$"?(console.log(this.stack),this.stack[this.stack.length-1]==="si"?this.message="Error: fin_si esperado":this.message="Error: fin_mientras esperado",!1):!0):!1)}D(){return this.simbolosDir.D[1].includes(this.token.type)?(this.token=this.scanner.scan(),this.token.type!=="identificador"?(this.message="Error: Identificador esperado despues de un tipo de dato",!1):(this.token=this.scanner.scan(),!(!this.D_Q()||!this.D_R()))):(this.message="Error: Tipo de dato esperado",!1)}D_R(){return this.simbolosDir.D_R[1].includes(this.token.value)?(this.token=this.scanner.scan(),this.token.type!=="identificador"?(this.message="Error: Identificador esperado después de la coma",!1):(this.token=this.scanner.scan(),!(!this.D_Q()||!this.D_R()))):this.simbolosDir.D_R[2].includes(this.token.value)?!0:(this.message="Error: Coma o punto y coma esperado después de un identificador",!1)}D_Q(){return this.simbolosDir.D_Q[1].includes(this.token.value)?(this.token=this.scanner.scan(),!!this.D_E()):this.simbolosDir.D_Q[2].includes(this.token.value)?!0:(this.message="Error: Punto y coma/signo igual/coma esperado",!1)}D_E(){return this.simbolosDir.D_E[1].includes(this.token.type)?!(!this.D_T()||!this.D_X()):(this.message="Error: Identificador/número esperado",!1)}D_X(){return this.simbolosDir.D_X[1].includes(this.token.value)?(this.token=this.scanner.scan(),!(!this.D_T()||!this.D_X())):this.simbolosDir.D_X[2].includes(this.token.value)?!0:(this.message="Error: Operador/punto y coma esperado",!1)}D_T(){return this.simbolosDir.D_T[1].includes(this.token.type)?!(!this.D_F()||!this.D_Y()):(this.message="Error: Identificador/número esperado",!1)}D_Y(){return this.simbolosDir.D_Y[1].includes(this.token.value)?(this.token=this.scanner.scan(),!(!this.D_F()||!this.D_Y())):this.simbolosDir.D_Y[2].includes(this.token.value)?!0:(this.message="Error: Operador/punto y coma esperado",!1)}D_F(){return this.simbolosDir.D_F[1].includes(this.token.type)?(this.token=this.scanner.scan(),!0):(this.message="Error: Identificador/número esperado",!1)}A(){return this.simbolosDir.A[1].includes(this.token.type)?(this.token=this.scanner.scan(),this.token.value!=="="?(this.message="Error: Signo igual esperado después de un identificador",!1):(this.token=this.scanner.scan(),!!this.A_E())):(this.message="Error: Identificador esperado",!1)}A_E(){return this.simbolosDir.A_E[1].includes(this.token.type)?!(!this.A_T()||!this.A_X()):(this.message="Error: Identificador/número esperado",!1)}A_X(){return this.simbolosDir.A_X[1].includes(this.token.value)?(this.token=this.scanner.scan(),!(!this.A_T()||!this.A_X())):this.simbolosDir.A_X[2].includes(this.token.value)?!0:(this.message="Error: Operador/punto y coma esperado",!1)}A_T(){return this.simbolosDir.A_T[1].includes(this.token.type)?!(!this.A_F()||!this.A_Y()):(this.message="Error: Identificador/número esperado",!1)}A_Y(){return this.simbolosDir.A_Y[1].includes(this.token.value)?(this.token=this.scanner.scan(),!(!this.A_F()||!this.A_Y())):this.simbolosDir.A_Y[2].includes(this.token.value)?!0:(this.message="Error: Operador/punto y coma esperado",!1)}A_F(){return this.simbolosDir.A_F[1].includes(this.token.type)?(this.token=this.scanner.scan(),!0):(this.message="Error: Identificador/número esperado",!1)}C(){return this.simbolosDir.C[1].includes(this.token.type)?!(!this.C_T()||!this.C_X()):(this.message="Error: Identificador/número esperado",!1)}C_X(){return this.simbolosDir.C_X[1].includes(this.token.value)?(this.token=this.scanner.scan(),!(!this.C_T()||!this.C_X())):this.simbolosDir.C_X[2].includes(this.token.value)?!0:(this.message="Error: Operador/paréntesis de cierre esperado",!1)}C_T(){return this.simbolosDir.C_T[1].includes(this.token.type)?!(!this.C_F()||!this.C_Y()):(this.message="Error: Identificador/número esperado",!1)}C_Y(){return this.simbolosDir.C_Y[1].includes(this.token.value)?(this.token=this.scanner.scan(),!(!this.C_F()||!this.C_Y())):this.simbolosDir.C_Y[2].includes(this.token.value)?!0:(this.message="Error: Operador o paréntesis de cierre esperado",!1)}C_F(){return this.simbolosDir.C_F[1].includes(this.token.type)?(this.token=this.scanner.scan(),!0):(this.message="Error: Identificador/número esperado",!1)}}class v{constructor(){this.variables={}}tokenizar(e){const t=[];let r="",i=0;const s=()=>{r&&(t.push(r),r="")};for(;i<e.length;){const a=e[i];/[a-zA-Z0-9_]/.test(a)?r+=a:["+","-","*","/","(",")","=",",","<",">"," "].includes(a)?(s(),a!==" "&&t.push(a)):a==="."&&r.match(/^\d+$/)||a==="-"&&t[i+1]===(r===""||t[t.length-1]==="(")?r+=a:(s(),r=a,s()),i++}return s(),t}parse(e){const t=this,r=()=>{let n=i();for(;e.length&&["+","-"].includes(e[0]);)e.shift()==="+"?n=["add",n,i()]:n=["subtract",n,i()];return n},i=()=>{let n=s();for(;e.length&&["*","/"].includes(e[0]);)e.shift()==="*"?n=["multiply",n,s()]:n=["divide",n,s()];return n},s=()=>{const n=/^-?\d+(\.\d+)?$/;if(e[0]==="("){e.shift();const c=r();if(e.shift()!==")")throw new Error(`Cerrar los paréntesis!!!!
`);return c}else{if(e[0]in t.variables)return["var",e.shift()];if(!n.test(e[0]))throw new Error(`Se esperaba un número, pero se encontró '${e[0]}'
`);return["num",parseFloat(e.shift())]}},a=()=>{const n=[];for(;e.length;){const c=e.shift(),d=e.shift();let l;if(d==="=")l=r(),n.push(["assign",c,l]);else if(["+=","-=","*=","/="].includes(d))switch(l=r(),d){case"+=":n.push(["assign_add",c,l]);break;case"-=":n.push(["assign_subtract",c,l]);break;case"*=":n.push(["assign_multiply",c,l]);break;case"/=":n.push(["assign_divide",c,l]);break}else throw new Error(`Se esperaba '=' o un operador de asignación incremental
`);if(e[0]===";")e.shift();else break}return n},h=()=>{if(e.shift(),e.shift()!=="<"||e.shift()!=="<")throw new Error(`Se esperaba '<<'
`);return["cout",r()]},u=[];for(;e.length;)if(e[0]==="cout")u.push(h());else if(/^[a-zA-Z_]\w*$/.test(e[0])&&e[1]==="="){const n=a();u.push(...n)}else u.push(r());return u}evaluate(e){const t=this,r=[],i=s=>{if(Array.isArray(s)){const a=s[0];switch(a){case"add":case"subtract":case"multiply":case"divide":const h=i(s[1]),u=i(s[2]);if(typeof h!="number"||typeof u!="number")throw new Error(`Operaciones aritméticas solo permiten números
`);switch(a){case"add":return h+u;case"subtract":return h-u;case"multiply":return h*u;case"divide":return h/u}break;case"assign":const n=s[1],c=i(s[2]);if(typeof c!="number")throw new Error(`Asignación solo permite números
`);return t.variables[n]=c,c;case"assign_add":case"assign_subtract":case"assign_multiply":case"assign_divide":const d=s[1],l=i(s[2]);if(typeof l!="number")throw new Error(`Asignación incremental solo permite números
`);if(!(d in t.variables))throw new Error(`Variable '${d}' no definida
`);switch(a){case"assign_add":t.variables[d]+=l;break;case"assign_subtract":t.variables[d]-=l;break;case"assign_multiply":t.variables[d]*=l;break;case"assign_divide":t.variables[d]/=l;break}return t.variables[d];case"var":if(!(s[1]in t.variables))throw new Error(`Variable '${s[1]}' no definida
`);return t.variables[s[1]];case"num":return s[1];case"cout":const f=i(s[1]);return typeof f=="number"?r.push({type:"cout",value:f}):typeof f=="string"&&f in t.variables?r.push({type:"cout",value:t.variables[f]}):r.push({type:"error",value:`Error: expresión '${f}' no válida.`}),null}}else return s};for(const s of e){const a=i(s);a!=null&&r.push({type:"result",value:a})}return r}validarExpresion(e){const t=/\/\s*$/,r=/\/\s*0/;if(t.test(e))throw new Error(`Expresión incompleta: no se puede terminar con una operación de división
`);if(r.test(e))throw new Error(`No se puede dividir entre cero
`)}interpret(e){this.validarExpresion(e);const t=this.tokenizar(e),r=this.parse(t);return this.evaluate(r)}}function b(){debugger;const o=new v,t=document.getElementById("expresionAritmetica-input").value.trim(),r=document.getElementById("expresionAritmetica-output");r.textContent="",r.placeholder="";const i=t.split(`
`);let s="";for(const a of i){const h=a.trim();if(h!=="")try{const u=o.interpret(h);for(const n of u)n.type==="cout"?s+=`${n.value}
`:n.type==="error"&&(r.textContent+=`Error para '${h}': ${n.value}
`)}catch(u){r.textContent+=`Error para '${h}': ${u.message}
`}}r.textContent+=s}const p=new _(""),m=new g(p);function y(){let o=p.scan();document.querySelectorAll(".code-editor")[1].value=`${o.value}

(${o.type})`}function k(){if(!m.parse()){document.querySelectorAll(".code-editor")[3].value=m.message;return}document.querySelectorAll(".code-editor")[3].value="La cadena es correcta"}document.getElementById("scanner-button").addEventListener("click",y);document.getElementById("scanner-input").addEventListener("input",function(o){p.content=o.target.value,p.index=0});document.getElementById("parser-button").addEventListener("click",k);document.getElementById("parser-input").addEventListener("input",function(o){p.content=o.target.value,p.index=0,m.message=""});document.getElementById("interpret-button").addEventListener("click",b);document.addEventListener("DOMContentLoaded",function(){var o=document.getElementById("parser-input");o.addEventListener("keydown",function(t){if(t.key==="Tab"){t.preventDefault();var r=this.selectionStart,i=this.selectionEnd;this.value=this.value.substring(0,r)+"	"+this.value.substring(i),this.selectionStart=this.selectionEnd=r+1}});var e=document.getElementById("scanner-input");e.addEventListener("keydown",function(t){if(t.key==="Tab"){t.preventDefault();var r=this.selectionStart,i=this.selectionEnd;this.value=this.value.substring(0,r)+"	"+this.value.substring(i),this.selectionStart=this.selectionEnd=r+1}})});

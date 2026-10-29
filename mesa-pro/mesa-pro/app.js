const K="mesapro.v1";
let S=load(),tab="partidas",open=null,armed=null,msg="",hf="";
function load(){try{const r=localStorage.getItem(K);if(r)return JSON.parse(r)}catch(e){}return{teams:[],matches:[],bo:3,pts:11}}
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
const $=s=>document.querySelector(s),uid=()=>Math.random().toString(36).slice(2,8);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const tn=id=>(S.teams.find(t=>t.id===id)||{name:"?"}).name;
const fmt=n=>n.toFixed(1).replace(".",",");

/* ---------- Regras de negócio ---------- */
// Recalcula sets, placar atual e vencedor a partir do registro de pontos (log).
// Set: primeiro a chegar em S.pts com 2 de vantagem. Partida: maioria dos sets (melhor de S.bo).
function calc(m){const need=Math.ceil(S.bo/2);let sets=[],cur=[0,0],w=[0,0],win=null;
 for(const s of m.log){cur[s]++;const o=1-s;
  if(cur[s]>=S.pts&&cur[s]-cur[o]>=2){sets.push(cur);w[s]++;cur=[0,0];if(w[s]>=need){win=s;break}}}
 return{sets,cur,w,win}}
// Classificação: vitória = 3 pts. Desempate: saldo de sets, saldo de pontos, nome.
function table(){const r={};
 S.teams.forEach(t=>r[t.id]={id:t.id,n:t.name,j:0,v:0,d:0,sp:0,sc:0,pp:0,pc:0,pt:0});
 S.matches.forEach(m=>{const c=calc(m);if(c.win===null||!r[m.a]||!r[m.b])return;const ids=[m.a,m.b];
  [0,1].forEach(i=>{const x=r[ids[i]];x.j++;x.sp+=c.w[i];x.sc+=c.w[1-i];
   c.sets.forEach(s=>{x.pp+=s[i];x.pc+=s[1-i]});if(c.win===i){x.v++;x.pt+=3}else x.d++})});
 return Object.values(r).sort((a,b)=>b.pt-a.pt||(b.sp-b.sc)-(a.sp-a.sc)||(b.pp-b.pc)-(a.pp-a.pc)||a.n.localeCompare(b.n))}
// Todos contra todos (método do círculo); número ímpar de equipes gera folga.
function gen(){const ids=S.teams.map(t=>t.id);if(ids.length%2)ids.push(null);
 const n=ids.length,ms=[];
 for(let r=0;r<n-1;r++){for(let i=0;i<n/2;i++){const a=ids[i],b=ids[n-1-i];if(a&&b)ms.push({id:uid(),a,b,r:r+1,log:[]})}
  ids.splice(1,0,ids.pop())}
 S.matches=ms}
function sim(m){const p=.35+Math.random()*.3;m.log=[];while(calc(m).win===null)m.log.push(Math.random()<p?0:1);m.fin=Date.now()+Math.random()*1000}
function demo(){S.teams=["2º DS","3º DS","1º A","1º B","2º Info"].map(name=>({id:uid(),name}));gen();
 S.matches.forEach((m,i)=>{if(i<S.matches.length*.6)sim(m)})}
const cur=()=>S.matches.find(x=>x.id===open);
function pt(i){const m=cur();if(!m||calc(m).win!==null)return;m.log.push(i);if(calc(m).win!==null)m.fin=Date.now();save();render()}
function undo(){const m=cur();if(!m||!m.log.length)return;m.log.pop();delete m.fin;save();render()}

/* ---------- Telas ---------- */
const empty=(t,p)=>`<div class="empty"><h2>${t}</h2><p>${p}</p></div>`;
function vTeams(){const lock=S.matches.some(m=>m.log.length),orph=S.matches.length&&S.teams.some(t=>!S.matches.some(m=>m.a===t.id||m.b===t.id));
 return `<div class="bar"><input id="tn" maxlength="24" placeholder="Nome da equipe (ex.: 2º DS)" aria-label="Nome da equipe"><button class="btn pri" data-a="add">Adicionar equipe</button></div>
 ${msg?`<p class="err">${msg}</p>`:""}
 ${S.teams.length?S.teams.map(t=>`<div class="tl"><span>${esc(t.name)}</span><button class="btn ${armed==="rm:"+t.id?"warn":""}" data-a="arm" data-k="rm:${t.id}">${armed==="rm:"+t.id?"Confirmar remoção":"Remover"}</button></div>`).join(""):empty("Nenhuma equipe cadastrada","Adicione ao menos 2 equipes ou carregue um exemplo para testar.")}
 ${orph?`<p class="err">Há equipes sem partidas. Gere os confrontos novamente.</p>`:""}
 <h2>Regras da partida</h2>
 <div class="bar"><label>Formato <select data-s="bo" ${lock?"disabled":""}>${[1,3,5].map(n=>`<option value="${n}" ${S.bo===n?"selected":""}>Melhor de ${n} ${n>1?"sets":"set"}</option>`).join("")}</select></label>
 <label>Set até <select data-s="pts" ${lock?"disabled":""}>${[7,11,15,21].map(n=>`<option value="${n}" ${S.pts===n?"selected":""}>${n} pontos</option>`).join("")}</select></label></div>
 <p class="hint">${lock?"As regras ficam bloqueadas depois que a primeira partida começa. ":""}Cada set termina com 2 pontos de vantagem. Vitória vale 3 pontos na classificação.</p>
 <h2>Campeonato</h2>
 <div class="bar"><button class="btn pri" ${S.teams.length<2?"disabled":""} data-a="${S.matches.length?"arm":"gen"}" data-k="gen">${armed==="gen"?"Confirmar: apaga os resultados":"Gerar confrontos (todos contra todos)"}</button>
 <button class="btn" data-a="demo">Carregar exemplo</button>
 <button class="btn ${armed==="reset"?"warn":""}" data-a="arm" data-k="reset">${armed==="reset"?"Confirmar: apagar tudo":"Reiniciar tudo"}</button></div>`}
function mc(m){const c=calc(m),st=c.win!==null?"done":m.log.length?"live":"todo",lab={done:"Finalizada",live:"Ao vivo",todo:"Agendada"}[st];
 const res=st==="todo"?"":`<div class="res">${c.w[0]} × ${c.w[1]}<small>${c.sets.map(s=>s.join("-")).join(", ")}${st==="live"&&(c.cur[0]||c.cur[1])?` · set atual ${c.cur[0]}-${c.cur[1]}`:""}</small></div>`;
 return `<article class="card m ${st}"><div class="vs"><b class="${c.win===0?"w":""}">${esc(tn(m.a))}</b><span>vs</span><b class="${c.win===1?"w":""}">${esc(tn(m.b))}</b></div>${res}<div class="row"><span class="chip ${st}">${lab}</span><button class="btn ${st==="todo"?"pri":""}" data-a="open" data-k="${m.id}">${st==="todo"?"Iniciar placar":st==="live"?"Continuar":"Ver placar"}</button></div></article>`}
function vMatches(){if(!S.matches.length)return empty("Nenhuma partida ainda","Cadastre ao menos 2 equipes na aba Equipes e gere os confrontos.");
 return [...new Set(S.matches.map(m=>m.r))].map(r=>`<h2>Rodada ${r}</h2><div class="list">${S.matches.filter(m=>m.r===r).map(mc).join("")}</div>`).join("")}
function vTable(){const t=table();if(!t.length)return empty("Classificação vazia","Cadastre equipes e finalize partidas para ver a tabela.");
 const rows=t.map((x,i)=>{const sb=x.pp-x.pc;return `<tr class="${i<3&&x.j?"top":""}"><td>${i+1}</td><td class="n">${esc(x.n)}</td><td><b>${x.pt}</b></td><td>${x.j}</td><td>${x.v}</td><td>${x.d}</td><td>${x.sp}-${x.sc}</td><td>${sb>0?"+":""}${sb}</td></tr>`}).join("");
 const p=t.filter(x=>x.j);let hl="";
 if(p.length){const at=[...p].sort((a,b)=>b.pp/b.j-a.pp/a.j)[0],df=[...p].sort((a,b)=>a.pc/a.j-b.pc/b.j)[0];
  hl=`<div class="hl"><div class="card"><p>Líder</p><strong>${esc(t[0].n)}</strong><p>${t[0].pt} pontos em ${t[0].j} jogos</p></div><div class="card"><p>Melhor ataque</p><strong>${esc(at.n)}</strong><p>${fmt(at.pp/at.j)} pontos marcados por jogo</p></div><div class="card"><p>Melhor defesa</p><strong>${esc(df.n)}</strong><p>${fmt(df.pc/df.j)} pontos sofridos por jogo</p></div></div>`}
 return `<div class="scroll"><table><thead><tr><th>#</th><th class="n">Equipe</th><th>Pts</th><th>J</th><th>V</th><th>D</th><th>Sets</th><th>Saldo de pontos</th></tr></thead><tbody>${rows}</tbody></table></div>
 <p class="hint">Desempate: saldo de sets, depois saldo de pontos, depois ordem alfabética.</p>${hl}`}
function vHist(){const done=S.matches.filter(m=>calc(m).win!==null&&(!hf||m.a===hf||m.b===hf)).sort((a,b)=>(b.fin||0)-(a.fin||0));
 let sum="";if(hf){let v=0,d=0;done.forEach(m=>{const w=calc(m).win;if((w===0?m.a:m.b)===hf)v++;else d++});sum=`<p class="hint">${esc(tn(hf))}: ${v} ${v===1?"vitória":"vitórias"} e ${d} ${d===1?"derrota":"derrotas"}.</p>`}
 return `<div class="bar"><label>Equipe <select data-s="hist"><option value="">Todas</option>${S.teams.map(t=>`<option value="${t.id}" ${hf===t.id?"selected":""}>${esc(t.name)}</option>`).join("")}</select></label></div>${sum}
 ${done.length?done.map(m=>{const c=calc(m),wn=c.win===0?m.a:m.b,ls=c.win===0?m.b:m.a;return `<div class="card hist"><b>${esc(tn(wn))}</b> venceu ${esc(tn(ls))} por ${Math.max(...c.w)} × ${Math.min(...c.w)}<div class="s">${c.sets.map(s=>s.join("-")).join(" · ")}</div></div>`}).join(""):empty("Nenhum confronto finalizado","Os resultados aparecem aqui assim que uma partida terminar.")}`}

function board(){const m=cur();if(!m)return"";const c=calc(m),need=Math.ceil(S.bo/2),fin=c.win!==null;
 const side=i=>`<section class="side ${c.win===i?"win":""}"><h3>${esc(tn(i?m.b:m.a))}</h3><div class="sw" aria-label="Sets vencidos: ${c.w[i]}">${Array.from({length:need},(_,k)=>`<i class="${k<c.w[i]?"on":""}"></i>`).join("")}</div><div class="pts" aria-live="polite">${fin?c.sets[c.sets.length-1][i]:c.cur[i]}</div><button class="add" data-a="pt" data-k="${i}" ${fin?"disabled":""}>+1 ponto</button></section>`;
 const info=fin?`Vitória de ${esc(tn(c.win?m.b:m.a))} por ${c.w[c.win]} × ${c.w[1-c.win]}`:`Set ${c.sets.length+1} · até ${S.pts} pontos com 2 de vantagem`;
 return `<div class="top2">${info}</div><div class="sides">${side(0)}${side(1)}</div><div class="foot"><div class="sets">${c.sets.map((s,i)=>`<span>Set ${i+1}: ${s[0]}-${s[1]}</span>`).join("")}</div><div><button class="btn" data-a="undo" ${m.log.length?"":"disabled"}>Desfazer último ponto</button> <button class="btn" data-a="close">Fechar placar</button></div><div class="keys">Teclado: ← ou A pontua à esquerda · → ou L pontua à direita · Z desfaz · Esc fecha</div></div>`}

function render(){const n=S.matches.length,d=S.matches.filter(m=>calc(m).win!==null).length;
 $("#prog").innerHTML=`<span>${d} de ${n} partidas concluídas</span><i style="--p:${n?d/n*100:0}%"></i>`;
 document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.v===tab)));
 $("#app").innerHTML=({equipes:vTeams,partidas:vMatches,tabela:vTable,hist:vHist})[tab]();
 $("#ov").innerHTML=open?board():"";$("#ov").hidden=!open}
function addTeam(){const v=$("#tn").value.trim();msg="";
 if(!v)msg="Digite o nome da equipe.";
 else if(S.teams.some(t=>t.name.toLowerCase()===v.toLowerCase()))msg="Já existe uma equipe com esse nome.";
 else{S.teams.push({id:uid(),name:v});save()}
 render();$("#tn").focus()}
function run(k){if(k==="gen")gen();else if(k==="reset")S={teams:[],matches:[],bo:3,pts:11};
 else if(k.startsWith("rm:")){const id=k.slice(3);S.teams=S.teams.filter(t=>t.id!==id);S.matches=S.matches.filter(m=>m.a!==id&&m.b!==id)}
 save()}
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a,k=b.dataset.k;
 if(a==="arm"){if(armed===k){armed=null;run(k)}else armed=k;render();return}
 armed=null;
 if(a==="tab"){tab=b.dataset.v;msg=""}
 else if(a==="add")return addTeam();
 else if(a==="gen"){run("gen");tab="partidas"}
 else if(a==="demo"){demo();save();tab="tabela"}
 else if(a==="open")open=k;
 else if(a==="close")open=null;
 else if(a==="undo")return undo();
 else if(a==="pt"){pt(+k);const f=$(`#ov [data-k="${k}"]`);if(f&&!f.disabled)f.focus();return}
 render()});
document.addEventListener("change",e=>{const s=e.target.dataset.s;if(!s)return;
 if(s==="hist")hf=e.target.value;else S[s]=+e.target.value;save();render()});
document.addEventListener("keydown",e=>{
 if(e.key==="Enter"&&e.target.id==="tn")return addTeam();
 if(!open||e.target.tagName==="SELECT")return;const k=e.key.toLowerCase();
 if(k==="arrowleft"||k==="a")pt(0);else if(k==="arrowright"||k==="l")pt(1);
 else if(k==="z"||k==="backspace")undo();else if(k==="escape"){open=null;render()}});
render();

(function(){
'use strict';
/* ===== Configuração (única fonte de verdade) ===== */
var CFG={
  // TODO CONFIRMAR COM O CLIENTE: número de WhatsApp que recebe os pedidos (DDI+DDD+número, só dígitos).
  whatsapp:'5534999089902',
  tel:'+553432163140',
  tz:'America/Sao_Paulo',
  // 0=domingo ... 6=sábado ; horários em minutos
  horario:{0:[480,1140],1:[450,1260],2:[450,1260],3:[450,1260],4:[450,1260],5:[450,1260],6:[450,1260]}
};
function wa(msg){return 'https://wa.me/'+CFG.whatsapp+'?text='+encodeURIComponent(msg);}
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}

/* ===== Links de WhatsApp com data-wa ===== */
function bindWa(){ $$('[data-wa]').forEach(function(a){ if(a.id==='v-cta')return; a.href=wa(a.getAttribute('data-wa')); a.target='_blank'; a.rel='noopener'; }); }

/* ===== Status de plantão (fuso de São Paulo) ===== */
function spNow(){
  var f=new Intl.DateTimeFormat('en-US',{timeZone:CFG.tz,weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false});
  var p={}; f.formatToParts(new Date()).forEach(function(x){p[x.type]=x.value;});
  var map={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
  var h=parseInt(p.hour,10)%24; return {d:map[p.weekday],m:h*60+parseInt(p.minute,10)};
}
function fmt(min){var h=Math.floor(min/60),m=min%60;return h+'h'+(m?(m<10?'0'+m:m):'');}
function statusText(n){
  var s=CFG.horario[n.d];
  if(n.m>=s[0]&&n.m<s[1]) return {state:'open',text:'Atendendo agora · até '+fmt(s[1])};
  if(n.m<s[0]) return {state:'closed',text:'Abrimos hoje às '+fmt(s[0])};
  var nd=(n.d+1)%7; return {state:'closed',text:'Fechado agora · abrimos amanhã às '+fmt(CFG.horario[nd][0])};
}
function updateStatus(){
  var el=$('#status'),tx=$('#status-text'); if(!el||!window.Intl)return;
  try{var r=statusText(spNow()); el.dataset.state=r.state; tx.textContent=r.text;}catch(e){}
}

/* ===== Termômetro ===== */
var range=$('#range'),liquid=$('#liquid'),top_=$('#liquidTop'),pct=$('#pct'),verdict=$('#verdict');
var VER={
  high:{t:'Tudo certo por enquanto',b:'Seu botijão está em boa fase. Guarde-o em pé, em local ventilado e longe de fontes de calor.',c:'Pedir mesmo assim',m:'Olá! Vim pelo site. Meu botijão ainda está cheio, mas quero combinar um próximo pedido.'},
  mid:{t:'Fique de olho',b:'Dá para seguir, mas se tem visita, festa ou muita gente em casa, vale garantir o próximo.',c:'Pedir agora',m:'Olá! Vim pelo site. Meu botijão está na metade e quero garantir o próximo.'},
  low:{t:'Hora de pedir',b:'Quanto antes você pede, menos chance de ficar sem gás no meio do preparo. Mande o pedido que a gente confirma valor e prazo.',c:'Pedir gás agora',m:'Olá! Vim pelo site. Meu botijão está acabando e preciso pedir gás.'}
};
function setLevel(v){
  v=Math.max(0,Math.min(100,v|0));
  var y=350-v*2.8; liquid.setAttribute('y',y); top_.setAttribute('y',y-2);
  top_.style.display=(v<=1)?'none':'';
  pct.textContent=v; range.value=v; range.setAttribute('aria-valuetext','Botijão com '+v+' por cento');
  var s=v>=70?'high':(v>=30?'mid':'low'), d=VER[s];
  verdict.dataset.s=s; $('#v-title').textContent=d.t; $('#v-body').textContent=d.b;
  var c=$('#v-cta'); c.textContent=d.c; c.href=wa(d.m); c.target='_blank'; c.rel='noopener';
  $$('.chip').forEach(function(b){var t=+b.dataset.set; b.setAttribute('aria-pressed',String((s==='high'&&t===100)||(s==='mid'&&t===50)||(s==='low'&&t===12)));});
}
if(range){
  range.addEventListener('input',function(){setLevel(+range.value);});
  $$('.chip').forEach(function(b){b.addEventListener('click',function(){setLevel(+b.dataset.set);});});
  setLevel(50);
}

/* ===== Pedido em 3 toques ===== */
var form=$('#order'); 
if(form){
  var qty=1, stepNow=1;
  var f={bairro:$('#bairro'),rua:$('#rua'),comp:$('#comp'),pag:$('#pag'),nome:$('#nome'),outro:$('#outro')};
  function tamanho(){var r=$('input[name=tam]:checked',form).value; if(r==='outro'){return (f.outro.value.trim()||'a combinar');} return r;}
  function mensagem(){
    var l=['Olá! Vim pelo site e quero pedir gás.','','Botijão: '+tamanho()+' x'+qty,'Bairro: '+(f.bairro.value.trim()||'—'),'Endereço: '+(f.rua.value.trim()||'—')+(f.comp.value.trim()?', '+f.comp.value.trim():''),'Pagamento: '+(f.pag.value.trim()||'a combinar')];
    if(f.nome.value.trim()) l.push('Nome: '+f.nome.value.trim());
    l.push('','Pode confirmar o valor e o prazo?'); return l.join('\n');
  }
  function refresh(){ $('#preview').textContent=mensagem(); $('#send').href=wa(mensagem()); $('#send').target='_blank'; $('#qval').textContent=qty; $('#qminus').disabled=qty<=1; $('#qplus').disabled=qty>=9; }
  function go(n){
    stepNow=n; $$('.step',form).forEach(function(s){s.hidden=(+s.dataset.step!==n);});
    $$('.order__tabs li').forEach(function(li){ if(+li.dataset.tab===n) li.setAttribute('aria-current','step'); else li.removeAttribute('aria-current'); });
    var lg=$('.step[data-step="'+n+'"] legend',form); if(lg) lg.focus({preventScroll:false});
  }
  function bad(el,msgId,cond){ el.setAttribute('aria-invalid',cond?'true':'false'); var m=$('#'+msgId); if(m) m.hidden=!cond; return cond; }
  $$('[data-next]',form).forEach(function(b){b.addEventListener('click',function(){
    var n=+b.dataset.next;
    if(n===3){ var e1=bad(f.bairro,'e-bairro',!f.bairro.value.trim()), e2=bad(f.rua,'e-rua',!f.rua.value.trim()); if(e1||e2){(e1?f.bairro:f.rua).focus();return;} }
    go(n);
  });});
  $$('[data-prev]',form).forEach(function(b){b.addEventListener('click',function(){go(+b.dataset.prev);});});
  $$('input[name=tam]',form).forEach(function(r){r.addEventListener('change',function(){ $('#outroWrap').hidden=(r.value!=='outro'||!r.checked); if(r.value==='outro'&&r.checked)f.outro.focus(); refresh(); });});
  $('#qminus').addEventListener('click',function(){qty=Math.max(1,qty-1);refresh();});
  $('#qplus').addEventListener('click',function(){qty=Math.min(9,qty+1);refresh();});
  form.addEventListener('input',refresh); form.addEventListener('submit',function(e){e.preventDefault();});
  refresh();
}

/* ===== Empresas ===== */
var emp=$('#emp');
if(emp){
  var en=$('#e-nome');
  function empMsg(){
    var l=['Olá! Vim pelo site e quero falar sobre abastecimento para a minha empresa.','','Empresa: '+(en.value.trim()||'—')];
    if($('#e-cnpj').value.trim()) l.push('CNPJ: '+$('#e-cnpj').value.trim());
    if($('#e-qtd').value.trim()) l.push('Botijões por semana: '+$('#e-qtd').value.trim());
    if($('#e-end').value.trim()) l.push('Endereço: '+$('#e-end').value.trim());
    return l.join('\n');
  }
  var es=$('#e-send');
  function er(){es.href=wa(empMsg());es.target='_blank';es.rel='noopener';}
  emp.addEventListener('input',er); er();
  es.addEventListener('click',function(ev){ if(!en.value.trim()){ev.preventDefault(); en.setAttribute('aria-invalid','true'); $('#e-enome').hidden=false; en.focus();} else {en.setAttribute('aria-invalid','false'); $('#e-enome').hidden=true;} });
  emp.addEventListener('submit',function(e){e.preventDefault();});
}

bindWa(); updateStatus(); setInterval(updateStatus,60000);
})();

/* ====== CONFIGURAÇÃO ====== */
var DESTINOS = {
  L: "https://averdadeoculta-five.vercel.app/",   // resultado mais próximo de Lula
  F: "https://jornadapatriota.vercel.app/",       // resultado mais próximo de Flávio Bolsonaro
  EMPATE: "https://averdadeoculta-five.vercel.app/" // resultado no meio do caminho
};
/* Texto do convite: descreve cada página como ela é. */
var CONVITE = {
  L: {h:"Você viu o que pensa. Agora veja o que os documentos dizem.",
      p:"De Lula a Flávio Bolsonaro: uma linha do tempo com a fonte de cada linha, separando o que foi alegado do que a Justiça decidiu. Quem conhece a história inteira não perde a discussão.",
      b:"Quero conhecer a história completa"},
  F: {h:"Antes de votar, veja o que está por trás do governo Lula.",
      p:"Processos, decisões judiciais e contas públicas em ordem cronológica, com data e fonte em cada linha, separando fato de interpretação. Decida com os documentos na mão.",
      b:"Quero ver os fatos"}
};
CONVITE.EMPATE = CONVITE.L;

/* Posições simplificadas, baseadas em declarações públicas e históricos de governo.
   1 = concorda, 0 = posição ambígua/mista, -1 = discorda. Revise antes de publicar. */
var Q = [
 {t:"O Estado deve ter papel central na economia, com mais investimento público.", L:1, F:-1},
 {t:"Privatizar empresas estatais é o melhor caminho para melhorar os serviços.", L:-1, F:1},
 {t:"Programas de transferência de renda, como o Bolsa Família, devem ser ampliados.", L:1, F:0},
 {t:"Reduzir impostos e o tamanho do Estado deve ser prioridade, mesmo com menos gasto social.", L:-1, F:1},
 {t:"Penas mais duras e acesso facilitado a armas ajudam a reduzir a violência.", L:-1, F:1},
 {t:"As regras ambientais devem ser mais rígidas, mesmo que limitem o agronegócio.", L:1, F:-1},
 {t:"O Brasil deve priorizar parcerias com o Sul global e os BRICS.", L:1, F:-1},
 {t:"As cotas e outras ações afirmativas devem ser mantidas ou ampliadas.", L:1, F:-1},
 {t:"O Estado deve regular as redes sociais e as big techs com mais rigor.", L:1, F:-1},
 {t:"Escolas cívico-militares são uma boa solução para a educação pública.", L:-1, F:1}
];
var ans = [], i = 0;
var app = document.getElementById("app"), bar = document.getElementById("bar");

function intro(){
  bar.style.width = "0";
  app.innerHTML =
   '<h1>Em 25 de outubro, o Brasil volta às urnas.</h1><div class="rule"></div>'+
   '<p>Depois de um primeiro turno apertado, Lula (PT) e Flávio Bolsonaro (PL) disputam a Presidência. Ninguém passou de 50% dos votos válidos, e cerca de um em cada cinco eleitores, algo perto de 33 milhões de pessoas, nem foi votar.</p>'+
   '<p>Este teste compara o que você pensa sobre 10 temas com as posições públicas de cada candidato. Seu voto é secreto, e aqui também: tudo acontece no seu navegador. Este teste não envia nem guarda nenhuma resposta.</p>'+
   '<div><button class="btn" id="go">Começar o teste (2 minutos)</button></div>'+
   '<footer>Teste de afinidade de ideias, sem valor científico. Não é pesquisa eleitoral nem enquete: não coleta nem divulga intenção de voto.</footer>';
  document.getElementById("go").onclick = function(){ ans=[]; i=0; ask(); };
}

function ask(){
  bar.style.width = (i/Q.length*100)+"%";
  app.innerHTML =
   '<p class="mute">Pergunta '+(i+1)+' de '+Q.length+'</p>'+
   '<h2>'+Q[i].t+'</h2>'+
   '<button class="opt" data-v="1">Concordo</button>'+
   '<button class="opt" data-v="0">Estou em dúvida</button>'+
   '<button class="opt" data-v="-1">Discordo</button>'+
   '<div><button class="skip" data-v="x">Prefiro não responder</button></div>';
  app.querySelectorAll("[data-v]").forEach(function(b){
    b.onclick = function(){
      ans[i] = b.dataset.v === "x" ? null : Number(b.dataset.v);
      i++; i < Q.length ? ask() : result();
    };
  });
}

function score(key){
  var s=0,n=0;
  Q.forEach(function(q,k){ if(ans[k]!==null && ans[k]!==undefined){ s += 1 - Math.abs(ans[k]-q[key])/2; n++; } });
  return n ? Math.round(100*s/n) : null;
}

function result(){
  bar.style.width = "100%";
  var l = score("L"), f = score("F");
  if(l===null){ app.innerHTML='<h2>Você pulou todas as perguntas.</h2><p>Sem respostas não há como comparar. Quer tentar de novo?</p><button class="btn" id="re">Refazer o teste</button>'; document.getElementById("re").onclick=intro; return; }
  var close = Math.abs(l-f) < 8;
  var lead = l>f ? "L" : "F";
  var nome = lead==="L" ? "Lula" : "Flávio Bolsonaro";
  var key = close ? "EMPATE" : lead;
  var dest = DESTINOS[key], cv = CONVITE[key];
  function row(name,p,isLead){
    return '<div class="who"><div class="row"><span class="name">'+name+'</span><span class="pct">'+p+'%</span></div>'+
           '<div class="track"><div class="fill'+(isLead&&!close?' lead':'')+'" data-w="'+p+'"></div></div></div>';
  }
  var veredito = close
    ? "Resultado: suas ideias ficam no meio do caminho entre Lula e Flávio Bolsonaro."
    : "Resultado: suas respostas ficaram mais próximas das posições de "+nome+".";
  app.innerHTML =
   '<h2>Seu mapa de afinidade</h2><div class="rule"></div>'+
   row("Lula",l,lead==="L")+row("Flávio Bolsonaro",f,lead==="F")+
   '<h2 style="font-size:1.5rem;margin-top:8px">'+veredito+'</h2>'+
   '<p class="mute">Isso mede concordância com ideias em 10 temas. Não é recomendação de voto: as pessoas votam também por trajetória, alianças e confiança.</p>'+
   '<div class="cta"><h2>'+cv.h+'</h2><p>'+cv.p+'</p>'+
   '<a class="btn" href="'+dest+'" target="_blank" rel="noopener">'+cv.b+'</a></div>'+
   '<div style="margin-top:20px"><button class="btn ghost" id="re">Refazer o teste</button></div>'+
   '<footer>As posições dos candidatos são uma simplificação feita a partir de declarações públicas e dos históricos de governo. Confira os planos de governo oficiais no DivulgaCandContas, do TSE. Teste de afinidade de ideias, sem valor científico: não é pesquisa eleitoral nem enquete, e este teste não enviou nem guardou nenhuma resposta.</footer>';
  setTimeout(function(){ document.querySelectorAll(".fill").forEach(function(e){ e.style.width = e.dataset.w+"%"; }); }, 80);
  document.getElementById("re").onclick = intro;
  window.scrollTo(0,0);
}
intro();
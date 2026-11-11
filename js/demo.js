/* Demonstração da Alentta. Tudo roda no navegador, com dados de exemplo; nada é enviado. */
(function () {
  'use strict';

  /* ---------- utilidades ---------- */
  var $ = function (id) { return document.getElementById(id); };
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 4200);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-toast]');
    if (b) toast(b.getAttribute('data-toast'));
  });

  /* ---------- abas ---------- */
  var nomesAba = ['colaborador', 'rh', 'psicologo'];
  function mostrar(nome) {
    if (nomesAba.indexOf(nome) < 0) nome = 'colaborador';
    nomesAba.forEach(function (n) {
      $('tab-' + n).setAttribute('aria-selected', n === nome ? 'true' : 'false');
      $('v-' + n).hidden = n !== nome;
    });
  }
  nomesAba.forEach(function (n) {
    $('tab-' + n).addEventListener('click', function () {
      mostrar(n);
      try { history.replaceState(null, '', '#' + n); } catch (e) { location.hash = n; }
    });
  });
  window.addEventListener('hashchange', function () { mostrar(location.hash.slice(1)); });
  mostrar(location.hash.slice(1));

  /* ================= COLABORADOR ================= */
  var ESCALA = ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'];
  /* Itens de exemplo, escritos para a demonstração. Na versão real entra um instrumento validado no Brasil.
     inv = item de proteção: responder "sempre" significa risco menor. */
  var TRABALHO = [
    { d: 'Ritmo e volume', t: 'Com que frequência você precisa trabalhar muito rápido para dar conta das tarefas?' },
    { d: 'Ritmo e volume', t: 'A quantidade de trabalho é maior do que dá para fazer no seu horário?' },
    { d: 'Autonomia', t: 'Você pode decidir como fazer o seu trabalho?', inv: true },
    { d: 'Autonomia', t: 'Você tem voz nas mudanças que afetam o seu trabalho?', inv: true },
    { d: 'Liderança', t: 'Sua liderança imediata ajuda quando o trabalho aperta?', inv: true },
    { d: 'Liderança', t: 'Você recebe retorno claro sobre o seu desempenho?', inv: true },
    { d: 'Respeito', t: 'Nos últimos 6 meses, você passou por gritos, humilhação ou piadas ofensivas no trabalho?' },
    { d: 'Respeito', t: 'Existe conflito ou clima ruim entre colegas na sua equipe?' },
    { d: 'Clareza', t: 'Você sabe exatamente o que esperam de você?', inv: true },
    { d: 'Jornada', t: 'O trabalho invade seu descanso, com mensagens fora do horário, horas extras ou folgas cortadas?' }
  ];
  /* PHQ-4 (Kroenke e colaboradores, 2009), de uso livre: 2 itens de ansiedade e 2 de humor. */
  var FREQ = ['Nenhuma vez', 'Vários dias', 'Mais da metade dos dias', 'Quase todos os dias'];
  var BEM = [
    { k: 'a', t: 'Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)' },
    { k: 'a', t: 'Não conseguir parar ou controlar as preocupações' },
    { k: 'h', t: 'Pouco interesse ou pouco prazer em fazer as coisas' },
    { k: 'h', t: 'Sentir-se para baixo, deprimido(a) ou sem esperança' }
  ];
  var SETORES = ['Atendimento', 'Logística', 'Financeiro', 'Comercial', 'Produção', 'Administrativo', 'Diretoria'];
  var HORARIOS = ['Qui, 14/11 · 18:30', 'Sex, 15/11 · 12:00', 'Sex, 15/11 · 19:00', 'Seg, 18/11 · 08:00'];

  var st;
  function zerar() {
    st = { etapa: 0, setor: '', aceite: false, i: 0, trab: [], bemI: 0, bem: [], seguranca: null, pulouBem: false, horario: '', telefone: '' };
    desenhar();
  }

  function marcarFluxo(f) {
    Array.prototype.forEach.call($('c-flow').children, function (li) {
      var n = Number(li.getAttribute('data-f'));
      li.className = n < f ? 'done' : (n === f ? 'on' : '');
    });
  }

  function explicar(titulo, itens) {
    var c = $('c-explica');
    c.innerHTML = '';
    c.appendChild(el('h3', null, titulo));
    var ul = el('ul');
    itens.forEach(function (t) { ul.appendChild(el('li', null, t)); });
    c.appendChild(ul);
  }

  function botao(texto, cls, fn, desativado) {
    var b = el('button', { class: 'btn ' + (cls || ''), type: 'button' }, texto);
    if (desativado) b.disabled = true;
    b.addEventListener('click', fn);
    return b;
  }

  function topo(tela, rotulo, atual, total) {
    tela.appendChild(el('div', { class: 'phone-top' }, '<span>' + rotulo + '</span><span>' + atual + ' de ' + total + '</span>'));
    var p = el('div', { class: 'progress' }, '<i></i>');
    p.style.setProperty('--p', Math.round(atual / total * 100) + '%');
    tela.appendChild(p);
  }

  function desenhar() {
    var tela = $('c-tela');
    tela.innerHTML = '';
    var e = st.etapa;

    if (e === 0) {
      marcarFluxo(0);
      tela.appendChild(el('p', { class: 'q-domain' }, 'Empresa Exemplo + Alentta'));
      tela.appendChild(el('h2', null, 'Queremos ouvir você sobre o seu trabalho'));
      tela.appendChild(el('p', { class: 'muted' }, 'São 10 perguntas rápidas. Não pedimos seu nome nem CPF. A empresa recebe só a soma das respostas do seu setor, e apenas se ele tiver 5 ou mais respostas.'));
      var lab = el('label', { for: 'c-setor', style: 'display:grid;gap:6px;font-weight:600;font-size:.9063rem' }, 'Seu setor');
      var sel = el('select', { id: 'c-setor' });
      sel.appendChild(el('option', { value: '' }, 'Escolha'));
      SETORES.forEach(function (s) { sel.appendChild(el('option', { value: s }, s)); });
      sel.value = st.setor;
      lab.appendChild(sel);
      tela.appendChild(lab);
      var ck = el('label', { class: 'check', for: 'c-aceite' });
      var inp = el('input', { type: 'checkbox', id: 'c-aceite' });
      inp.checked = st.aceite;
      ck.appendChild(inp);
      ck.appendChild(el('span', null, 'Entendi como minhas respostas são usadas e quero participar.'));
      tela.appendChild(ck);
      var go = botao('Começar', '', function () { st.etapa = 1; st.i = 0; desenhar(); }, !(st.setor && st.aceite));
      var rb = el('div', { class: 'row-btns' }); rb.appendChild(go); tela.appendChild(rb);
      function atualizar() { st.setor = sel.value; st.aceite = inp.checked; go.disabled = !(st.setor && st.aceite); }
      sel.addEventListener('change', atualizar); inp.addEventListener('change', atualizar);
      explicar('Etapa 1: convite e aceite', [
        'O convite chega por WhatsApp ou por QR code no mural. O link é o mesmo para todos os colaboradores da empresa.',
        'O setor é a única informação de grupo que pedimos. Idade, sexo e cargo ficam de fora para ninguém ser identificado por exclusão.',
        'O aceite registra que a pessoa foi informada, como pede a LGPD para dado de saúde.'
      ]);
      return;
    }

    if (e === 1) {
      marcarFluxo(1);
      var q = TRABALHO[st.i];
      topo(tela, 'Sobre o seu trabalho', st.i + 1, TRABALHO.length);
      tela.appendChild(el('span', { class: 'q-domain' }, q.d));
      tela.appendChild(el('p', { class: 'q-text' }, q.t));
      var opts = el('div', { class: 'opts' });
      ESCALA.forEach(function (o, v) {
        var b = el('button', { class: 'opt' + (st.trab[st.i] === v ? ' on' : ''), type: 'button' }, o);
        b.addEventListener('click', function () {
          st.trab[st.i] = v;
          if (st.i < TRABALHO.length - 1) st.i++; else st.etapa = 2;
          desenhar();
        });
        opts.appendChild(b);
      });
      tela.appendChild(opts);
      if (st.i > 0) {
        var rb1 = el('div', { class: 'row-btns' });
        rb1.appendChild(botao('Voltar', 'ghost', function () { st.i--; desenhar(); }));
        tela.appendChild(rb1);
      }
      tela.appendChild(el('p', { class: 'phone-note' }, '<span aria-hidden="true">●</span> Anônimo. Entra na média do setor ' + st.setor + '.'));
      explicar('Etapa 2: perguntas sobre o trabalho', [
        'Cada pergunta mede um fator de risco psicossocial do trabalho: ritmo, autonomia, liderança, respeito, clareza e jornada.',
        'Aqui a pergunta é sobre a organização do trabalho, não sobre a saúde da pessoa. É isso que a NR-1 pede para o inventário de riscos.',
        'Na versão real, as perguntas vêm de um instrumento validado no Brasil, com 25 a 40 itens e cerca de 8 minutos.'
      ]);
      return;
    }

    if (e === 2) {
      marcarFluxo(2);
      tela.appendChild(el('span', { class: 'q-domain' }, 'Parte opcional'));
      tela.appendChild(el('h2', null, 'Se quiser, conte como você está'));
      tela.appendChild(el('p', { class: 'muted' }, 'São 5 perguntas. Essas respostas não vão para a empresa: só a psicóloga da Alentta vê, para oferecer uma conversa se for bom para você.'));
      var ck2 = el('label', { class: 'check', for: 'c-aceite-saude', style: 'padding:12px;border-radius:12px;background:var(--brand-soft)' });
      var inp2 = el('input', { type: 'checkbox', id: 'c-aceite-saude' });
      ck2.appendChild(inp2);
      ck2.appendChild(el('span', null, '<b>Autorizo</b> a psicóloga da Alentta a ver estas respostas para me oferecer atendimento. A empresa não recebe nada delas.'));
      tela.appendChild(ck2);
      var rb2 = el('div', { class: 'row-btns' });
      var resp = botao('Responder', '', function () { st.etapa = 21; st.bemI = 0; desenhar(); }, true);
      inp2.addEventListener('change', function () { resp.disabled = !inp2.checked; });
      rb2.appendChild(resp);
      rb2.appendChild(botao('Pular', 'ghost', function () { st.pulouBem = true; st.etapa = 3; desenhar(); }));
      tela.appendChild(rb2);
      explicar('Etapa 3: como você está', [
        'Esta parte é a triagem individual, separada da avaliação da empresa. Ela é voluntária e confidencial.',
        'Tem aceite próprio e destacado, como a LGPD pede para dado de saúde que a NR-1 não exige. Pular não tem consequência nenhuma.',
        'Usa o PHQ-4, questionário curto e de uso livre que rastreia ansiedade e humor nas últimas 2 semanas. Triagem não é diagnóstico: quem decide o que fazer é a psicóloga, conversando com a pessoa.'
      ]);
      return;
    }

    if (e === 21) {
      marcarFluxo(2);
      var total = BEM.length + 1;
      topo(tela, 'Como você está', st.bemI + 1, total);
      tela.appendChild(el('p', { class: 'muted', style: 'font-size:.875rem' }, 'Nas últimas 2 semanas, com que frequência você se sentiu incomodado(a) por:'));
      if (st.bemI < BEM.length) {
        tela.appendChild(el('p', { class: 'q-text' }, BEM[st.bemI].t));
        var o2 = el('div', { class: 'opts' });
        FREQ.forEach(function (o, v) {
          var b = el('button', { class: 'opt' + (st.bem[st.bemI] === v ? ' on' : ''), type: 'button' }, o);
          b.addEventListener('click', function () { st.bem[st.bemI] = v; st.bemI++; desenhar(); });
          o2.appendChild(b);
        });
        tela.appendChild(o2);
      } else {
        tela.appendChild(el('p', { class: 'q-text' }, 'Você pensou que seria melhor estar morto(a) ou em se machucar de alguma forma?'));
        var o3 = el('div', { class: 'opts' });
        [['Não', false], ['Sim', true]].forEach(function (par) {
          var b = el('button', { class: 'opt' + (st.seguranca === par[1] ? ' on' : ''), type: 'button' }, par[0]);
          b.addEventListener('click', function () { st.seguranca = par[1]; st.etapa = 3; desenhar(); });
          o3.appendChild(b);
        });
        tela.appendChild(o3);
      }
      tela.appendChild(el('p', { class: 'phone-note' }, '<span aria-hidden="true">●</span> Só a psicóloga vê. Precisa de ajuda agora? Ligue 188 (CVV).'));
      explicar('Etapa 3: triagem confidencial', [
        'Ansiedade: soma dos 2 primeiros itens. Humor: soma dos 2 seguintes. Cada soma vai de 0 a 6; 3 ou mais sugere conversar com um profissional.',
        'A última pergunta é de segurança. Resposta "sim" dispara o protocolo de crise: contatos de emergência na tela e ligação da psicóloga no mesmo dia.',
        'O CVV 188 aparece em todas as telas desta parte.'
      ]);
      return;
    }

    if (e === 3) {
      marcarFluxo(3);
      tela.appendChild(el('span', { class: 'q-domain' }, 'Seu resultado · só você vê'));
      /* fatores do trabalho */
      var dom = {};
      TRABALHO.forEach(function (q, k) {
        var v = st.trab[k]; if (v === undefined) return;
        var risco = q.inv ? 4 - v : v;
        (dom[q.d] = dom[q.d] || []).push(risco);
      });
      tela.appendChild(el('p', { style: 'font-weight:600' }, 'Como o seu trabalho aparece nas suas respostas'));
      var bars = el('div', { class: 'bars' });
      Object.keys(dom).forEach(function (d) {
        var arr = dom[d], m = arr.reduce(function (a, b) { return a + b; }, 0) / arr.length, pct = Math.round(m / 4 * 100);
        var cor = pct >= 60 ? 'var(--crit)' : pct >= 40 ? 'var(--warn)' : 'var(--good)';
        var rot = pct >= 60 ? 'pesa bastante' : pct >= 40 ? 'atenção' : 'tranquilo';
        bars.appendChild(el('div', { class: 'bar' }, '<div class="bar-top"><span>' + d + '</span><span style="color:' + cor + ';font-weight:600">' + rot + '</span></div><div class="bar-track"><i style="width:' + Math.max(pct, 4) + '%;background:' + cor + '"></i></div>'));
      });
      tela.appendChild(bars);

      var ans = (st.bem[0] || 0) + (st.bem[1] || 0), hum = (st.bem[2] || 0) + (st.bem[3] || 0);
      var crise = st.seguranca === true, indicar = !st.pulouBem && (ans >= 3 || hum >= 3);
      st.prioridade = crise ? 'crise' : indicar ? 'indicado' : 'livre';

      if (crise) {
        var box = el('div', { class: 'alertbox crit' });
        box.innerHTML = '<b>Você não precisa passar por isso sozinho(a).</b><span>Se estiver em perigo agora, ligue <b>188</b> (CVV, 24 horas, gratuito) ou <b>192</b> (SAMU).</span><span>Deixe um telefone e a psicóloga da Alentta liga para você ainda hoje. Só ela vê esse número.</span>';
        var tel = el('input', { id: 'c-tel', type: 'tel', inputmode: 'tel', placeholder: '(71) 9 0000-0000', style: 'min-height:46px;padding:10px 12px;border:1.5px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);font:400 1rem var(--font-body)' });
        tel.setAttribute('aria-label', 'Telefone para a psicóloga ligar');
        box.appendChild(tel);
        box.appendChild(botao('Quero que me liguem hoje', '', function () {
          st.telefone = tel.value.trim();
          if (!st.telefone) { tel.focus(); toast('Escreva um telefone para a psicóloga ligar.'); return; }
          st.horario = 'Ligação hoje'; st.etapa = 5; desenhar();
        }));
        tela.appendChild(box);
      } else if (indicar) {
        tela.appendChild(el('div', { class: 'alertbox info' }, '<b>Pelo que você contou, pode ajudar conversar com uma psicóloga.</b><span>É por vídeo, gratuito para você, e a empresa não fica sabendo quem agendou.</span>'));
        var rb3 = el('div', { class: 'row-btns' });
        rb3.appendChild(botao('Escolher horário', '', function () { st.etapa = 4; desenhar(); }));
        rb3.appendChild(botao('Agora não', 'ghost', function () { toast('Tudo bem. O convite fica aberto no seu link por 30 dias.'); }));
        tela.appendChild(rb3);
      } else {
        tela.appendChild(el('div', { class: 'alertbox good' }, '<b>Obrigado por participar.</b><span>' + (st.pulouBem ? 'Você pulou a parte sobre como está, e tudo bem.' : 'Suas respostas não indicam necessidade de atendimento agora.') + ' Se quiser conversar com uma psicóloga mesmo assim, é só pedir.</span>'));
        var rb4 = el('div', { class: 'row-btns' });
        rb4.appendChild(botao('Quero conversar', 'ghost', function () { st.etapa = 4; desenhar(); }));
        tela.appendChild(rb4);
      }
      explicar('Etapa 4: resultado', [
        'A pessoa vê o próprio resultado na hora. Isso dá sentido a ter respondido e aumenta a adesão no ano seguinte.',
        crise ? 'Neste caso a fila da psicóloga recebe um alerta vermelho de "ligar agora". A empresa não é avisada.' :
          indicar ? 'A triagem indicou conversa. A pessoa decide se agenda; se recusar, ninguém fica sabendo.' :
            'Sem indicação, o convite para conversar continua disponível a qualquer momento.',
        'No painel do RH, esta resposta só soma: +1 na participação do setor ' + st.setor + ' e, se houver agendamento, +1 em "agendaram".'
      ]);
      return;
    }

    if (e === 4) {
      marcarFluxo(4);
      tela.appendChild(el('span', { class: 'q-domain' }, 'Agendar conversa'));
      tela.appendChild(el('h2', null, 'Escolha um horário'));
      tela.appendChild(el('p', { class: 'muted' }, 'Psic. Marina Lopes · 30 minutos por vídeo. Você recebe o link por WhatsApp e um lembrete 1 hora antes.'));
      var lista = el('div', { class: 'opts' });
      HORARIOS.forEach(function (h) {
        var b = el('button', { class: 'slot' + (st.horario === h ? ' on' : ''), type: 'button' }, '<span>' + h + '</span><span class="pill good">Livre</span>');
        b.addEventListener('click', function () { st.horario = h; st.etapa = 5; desenhar(); });
        lista.appendChild(b);
      });
      tela.appendChild(lista);
      var rb5 = el('div', { class: 'row-btns' });
      rb5.appendChild(botao('Voltar', 'ghost', function () { st.etapa = 3; desenhar(); }));
      tela.appendChild(rb5);
      explicar('Etapa 5: agendamento', [
        'Horários fora do expediente aparecem primeiro, para a pessoa não precisar pedir para sair.',
        'Se a sessão for no horário de trabalho, a pessoa pode pedir uma declaração de comparecimento só com data e hora, entregue a ela. É ela quem decide se leva ao RH.',
        'A sala de vídeo é a mesma tecnologia de teleconsulta que a Eloá já usa.'
      ]);
      return;
    }

    if (e === 5) {
      marcarFluxo(5);
      var crise2 = st.horario === 'Ligação hoje';
      tela.appendChild(el('span', { class: 'q-domain' }, crise2 ? 'Pedido recebido' : 'Agendado'));
      tela.appendChild(el('h2', null, crise2 ? 'A psicóloga vai ligar para você hoje' : 'Pronto, está marcado'));
      tela.appendChild(el('div', { class: 'alertbox ' + (crise2 ? 'crit' : 'good') }, crise2 ?
        '<span>Vamos ligar para <b>' + st.telefone.replace(/</g, '&lt;') + '</b>. Enquanto isso, se precisar, ligue <b>188</b> (CVV) ou <b>192</b> (SAMU).</span>' :
        '<b>' + st.horario + '</b><span>Psic. Marina Lopes · por vídeo. O link chega por WhatsApp.</span>'));
      tela.appendChild(el('p', { class: 'muted' }, 'Você pode remarcar ou cancelar pelo mesmo link. A empresa vê apenas que houve mais uma sessão marcada, sem o seu nome.'));
      var rb6 = el('div', { class: 'row-btns' });
      rb6.appendChild(botao('Ver o que o RH enxerga', 'ghost', function () { mostrar('rh'); try { history.replaceState(null, '', '#rh'); } catch (x) {} window.scrollTo(0, 0); }));
      tela.appendChild(rb6);
      explicar('Fim do fluxo do colaborador', [
        'Abra a aba RH: a sua resposta aparece só como número dentro do setor ' + st.setor + ' e do funil de cuidado.',
        'Abra a aba Psicólogo: o pedido entra na fila por prioridade' + (crise2 ? ', em vermelho, com o telefone.' : '.'),
        'Use "Recomeçar" para testar outro caminho, por exemplo responder "sim" na pergunta de segurança.'
      ]);
    }
  }
  $('c-reiniciar').addEventListener('click', zerar);
  zerar();

  /* ================= RH ================= */
  var FATORES = ['Ritmo e volume', 'Autonomia', 'Liderança', 'Respeito', 'Clareza', 'Jornada'];
  var MAPA = [
    { s: 'Atendimento', n: 41, r: 46, v: [72, 48, 51, 34, 38, 66] },
    { s: 'Logística', n: 33, r: 38, v: [55, 31, 69, 44, 36, 47] },
    { s: 'Produção', n: 30, r: 52, v: [49, 57, 42, 21, 33, 41] },
    { s: 'Comercial', n: 24, r: 28, v: [58, 22, 35, 18, 29, 52] },
    { s: 'Administrativo', n: 21, r: 25, v: [31, 27, 30, 12, 24, 22] },
    { s: 'Financeiro', n: 14, r: 16, v: [29, 22, 25, 9, 20, 30] },
    { s: 'Diretoria', n: 4, r: 9, v: null }
  ];
  function nivel(x) { return x >= 60 ? 'hi' : x >= 40 ? 'md' : 'lo'; }
  (function () {
    var t = $('rh-heat');
    var h = '<thead><tr><th>Setor</th><th>Respostas</th>';
    FATORES.forEach(function (f) { h += '<th>' + f + '</th>'; });
    h += '</tr></thead><tbody>';
    MAPA.forEach(function (m) {
      h += '<tr><td><b>' + m.s + '</b></td><td class="num">' + m.n + ' de ' + m.r + '</td>';
      if (!m.v) {
        FATORES.forEach(function () { h += '<td class="cell"><span class="c na" title="Menos de 5 respostas">oculto</span></td>'; });
      } else {
        m.v.forEach(function (x) { h += '<td class="cell"><span class="c ' + nivel(x) + '">' + x + '</span></td>'; });
      }
      h += '</tr>';
    });
    t.innerHTML = h + '</tbody>';
  })();

  (function () {
    var F = [['Convidados pela triagem', 31], ['Agendaram', 23], ['Compareceram', 17], ['Seguem em acompanhamento', 12], ['Encaminhados à rede', 2]];
    var box = $('rh-funnel');
    F.forEach(function (f) {
      box.appendChild(el('div', { class: 'funnel-row' }, '<span>' + f[0] + '</span><span class="track"><i style="width:' + Math.round(f[1] / F[0][1] * 100) + '%"></i></span><b>' + f[1] + '</b>'));
    });
  })();

  (function () {
    var P = [
      ['Ritmo e volume', 'Atendimento', 'Rever dimensionamento: 2 vagas e escala nos picos de segunda-feira', 'Gerente de Operações', '15/12/2026', 'warn', 'Em andamento'],
      ['Jornada', 'Atendimento', 'Proibir mensagens de trabalho após 19h no grupo da equipe', 'RH', '20/11/2026', 'good', 'Concluída'],
      ['Liderança', 'Logística', 'Formação de líderes em feedback e gestão de conflitos (8 h)', 'RH + Alentta', '31/01/2027', 'warn', 'Em andamento'],
      ['Respeito', 'Logística', 'Divulgar o canal anônimo de denúncia e o fluxo de apuração', 'CIPA', '30/11/2026', 'good', 'Concluída'],
      ['Autonomia', 'Produção', 'Reunião quinzenal da equipe para decidir ajustes de processo', 'Supervisor de Produção', '10/01/2027', 'info', 'Não iniciada'],
      ['Ritmo e volume', 'Comercial', 'Rever metas do trimestre com participação do time', 'Diretoria Comercial', '05/11/2026', 'crit', 'Atrasada']
    ];
    var h = '<thead><tr><th>Fator</th><th>Setor</th><th>Ação</th><th>Responsável</th><th>Prazo</th><th>Situação</th></tr></thead><tbody>';
    P.forEach(function (p) {
      h += '<tr><td>' + p[0] + '</td><td>' + p[1] + '</td><td>' + p[2] + '</td><td>' + p[3] + '</td><td class="num">' + p[4] + '</td><td><span class="pill ' + p[5] + '">' + p[6] + '</span></td></tr>';
    });
    $('rh-plano').innerHTML = h + '</tbody>';
  })();

  /* ================= PSICÓLOGO ================= */
  var FILA = [
    { id: 'A-1042', nome: 'Ana P.', emp: 'Empresa Exemplo · Atendimento', tri: 'PHQ-4: 10 · ansiedade 5 · humor 5', seg: true, pill: ['crit', 'Ligar agora'], quando: 'Pediu ligação há 20 min', queixa: 'Triagem com resposta positiva na pergunta de segurança. Pediu ligação hoje.' },
    { id: 'B-2210', nome: 'Carlos M.', emp: 'Empresa Exemplo · Logística', tri: 'PHQ-4: 7 · ansiedade 4 · humor 3', seg: false, pill: ['warn', 'Até 72 h'], quando: 'Triagem ontem, ainda sem horário', queixa: 'Relata conflito frequente com a liderança e insônia há 3 semanas.' },
    { id: 'C-0871', nome: 'Juliana R.', emp: 'Transportes Modelo · Comercial', tri: 'PHQ-4: 6 · ansiedade 4 · humor 2', seg: false, pill: ['good', 'Agendada 14:00'], quando: 'Primeira sessão hoje', queixa: 'Pressão por metas; crises de ansiedade antes de reuniões.' },
    { id: 'D-3305', nome: 'Rafael S.', emp: 'Indústria Teste · Produção', tri: 'Pediu conversa sem triagem', seg: false, pill: ['info', 'Pedido livre'], quando: 'Pedido há 2 dias', queixa: 'Luto recente; quer apoio para voltar ao trabalho.' }
  ];
  var AGENDA = [
    ['09:00', 'Lucas T. · 3ª sessão', 'good', 'Realizada'],
    ['10:00', 'Fernanda A. · 2ª sessão', 'crit', 'Faltou'],
    ['11:00', 'Ligação: Ana P.', 'crit', 'Prioridade'],
    ['14:00', 'Juliana R. · 1ª sessão', 'info', 'Próxima'],
    ['15:00', 'Marcos V. · 4ª sessão', 'info', 'Confirmada'],
    ['16:00', 'Livre', 'good', 'Aberto'],
    ['18:30', 'Paula C. · 1ª sessão', 'info', 'Confirmada']
  ];
  var fila = $('p-fila');
  function abrir(p) {
    Array.prototype.forEach.call(fila.children, function (c) { c.classList.toggle('on', c.getAttribute('data-id') === p.id); });
    $('p-nome').textContent = 'Prontuário · ' + p.nome;
    $('p-sub').textContent = p.emp + ' · registro ' + p.id;
    $('p-triagem').className = 'alertbox ' + (p.seg ? 'crit' : 'info');
    $('p-triagem').innerHTML = '<b>Triagem</b><span>' + p.tri + (p.seg ? ' · <b>pergunta de segurança positiva: seguir protocolo de crise</b>' : '') + '</span>';
    $('p-queixa').value = p.queixa;
    $('p-evol').value = '';
  }
  FILA.forEach(function (p) {
    var b = el('button', { class: 'qitem', type: 'button', 'data-id': p.id },
      '<div class="mini-row"><b>' + p.nome + '</b><span class="pill ' + p.pill[0] + '">' + p.pill[1] + '</span></div><small>' + p.emp + '</small><small>' + p.tri + '</small><small>' + p.quando + '</small>');
    b.addEventListener('click', function () { abrir(p); });
    fila.appendChild(b);
  });
  AGENDA.forEach(function (a) {
    $('p-agenda').appendChild(el('div', { class: 'agenda-row' }, '<b>' + a[0] + '</b><span>' + a[1] + '</span><span class="pill ' + a[2] + '">' + a[3] + '</span>'));
  });
  abrir(FILA[0]);
})();

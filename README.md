# SST Mental

Saúde mental no trabalho para empresas: avaliação de riscos psicossociais da NR-1,
triagem individual confidencial, psicólogo por vídeo e painel do RH.
Uma empresa da **Eloá Group** (mesmo grupo da Eloá e da NutriObjetivo).

## O que tem aqui hoje (11/11/2026)

- `index.html`: site comercial (NR-1, como funciona, sigilo, planos com simulador, dúvidas, pedido de proposta).
- `demo.html` + `js/demo.js`: demonstração navegável das três telas, com dados de exemplo e nada enviado:
  - **Colaborador**: convite, perguntas sobre o trabalho, triagem opcional (PHQ-4 + pergunta de segurança),
    resultado com os três caminhos (sem indicação, indicado, crise) e agendamento.
  - **RH**: participação, mapa de calor por setor (setor com menos de 5 respostas fica oculto),
    funil de cuidado só com totais, plano de ação e documentos para a fiscalização.
  - **Psicólogo**: fila por prioridade, agenda, prontuário.
- `css/site.css` e `css/demo.css`: identidade visual (tokens no topo, claro e escuro).

Para ver: abrir `index.html` no navegador. Não tem build.

## No ar

- Endereço: https://almir2015666-cpu.github.io/sstmental/ (GitHub Pages, repositório público `almir2015666-cpu/sstmental`).
- **Publicar = `git push`** no ramo `main`. O GitHub atualiza o site em 1 a 2 minutos.
- Commits com o e-mail privado do GitHub (`...@users.noreply.github.com`), porque o repositório é público.
- O site está **fora do Google** (`<meta name="robots" content="noindex">` no `index.html`) até o domínio `sstmental.com.br` (livre em 11/11/2026) estar registrado e apontado para cá. Tirar essa linha nessa hora.
- **Formulário de contato:** preencher `CONTATO` no começo do script do `index.html` (WhatsApp com DDI, por exemplo `5571999999999`, e/ou e-mail). Sem isso, ele avisa que ainda não envia.
- Domínio próprio: registrar `sstmental.com.br` no registro.br, criar o arquivo `CNAME` com o domínio e apontar o DNS para o GitHub Pages.
- Nome: **SST Mental** (escolhido em 11/11/2026; antes era o provisório "Alentta"). Logo = "Pessoa acolhida" (escolhida em 11/11/2026): círculo na cor da marca, pessoa em `--brand-ink` e arco âmbar (`--accent`, reserva #E3A13B) envolvendo, como mãos que amparam. "SST" em negrito e "Mental" em peso 500 (`.wm-l`).

## Fotos

Fotos do Pexels (licença livre para uso comercial, sem atribuição obrigatória), otimizadas em `img/`:
`equipe-sorrindo.jpg` (pexels 3860641), `psicologa-video.jpg` (6266980), `colaborador-celular.jpg` (7504898),
`reuniao-equipe.jpg` (5945809). O Unsplash bloqueia download automático; por isso o Pexels.

A página inicial usa `css/home.css`. A demonstração usa `css/site.css` + `css/demo.css`, com as mesmas cores.
`index.html#tela-colaborador` e `#tela-psicologo` abrem a vitrine direto na aba.

## Regras que não mudam

- O RH nunca vê resposta individual, nome de quem está em atendimento nem prontuário.
- Resultado de grupo só com 5 ou mais respostas.
- Triagem não é diagnóstico; pergunta de segurança positiva = protocolo de crise (CVV 188, SAMU 192, ligação no mesmo dia).
- Os itens do questionário da demonstração foram escritos para a demo. A versão real usa instrumento validado no Brasil.

## Próximo passo técnico

Aplicativo web (PWA) no mesmo conjunto da Eloá (React + TypeScript + Cloudflare Workers + D1 + R2),
em banco próprio, reaproveitando sala de vídeo, prontuário com guarda, conferência de CRP, WhatsApp e push.

# Alentta

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

# Portfólio do Natã Campos de Oliveira: instruções para agentes

Site estático publicado em https://natacamposoliveira.github.io (GitHub Pages, ramo `main`).
Identidade: centro de distribuição (papelão, aço, laranja de sinalização). Fontes Unbounded + Manrope.
Animações com GSAP 3.13 (ScrollTrigger, SplitText) e Lenis, via jsDelivr.

## Regra principal: todo projeto novo atualiza o site inteiro

Quando o Natã passar um projeto novo, avaliar e atualizar **todas** as partes abaixo, não só a página do caso:

1. **Esteira** (`index.html`, `#iso .box`): incluir caixas para habilidades novas que o projeto demonstra,
   ou atualizar o texto (`data-d`) e o filtro (`data-f`) das caixas existentes. Não repetir habilidade.
2. **Rota** (`index.html`, `#rota`): trabalho fica em cima da estrada (`.place.w`), projetos embaixo (`.place.p`).
   Cada lugar tem `data-i` (ordem cronológica) e um `<template id="t-...">` com os detalhes.
   - Empregos são um lugar por empresa (com todos os cargos no painel). Projetos não são empregos.
   - O caminhão **sempre vai até o último lugar** antes de a página descer; a rota cresce sozinha pelo maior `data-i`.
     Ao inserir um lugar no meio, renumerar `data-i` dos seguintes.
   - Cada lugar tem um desenho SVG próprio ligado ao tema (com animação quando o caminhão chega).
3. **Casos** (`index.html`, `#casos`): cartão de resumo com `data-tags` para os filtros; criar botão de filtro novo
   quando surgir um tema novo.
4. **Página do caso** (`casos/<nome>.html`): resumo (problema, o que eu fiz, resultado), números,
   mídia, como funciona, papel do Natã. Simuladores e detalhes ficam só aqui, não na página inicial.
   Ligar "caso anterior/próximo".
5. **SEO**: atualizar `sitemap.xml`, metadados da página e, se fizer sentido, `knowsAbout` no JSON-LD de `index.html`.
6. **LinkedIn**: no "Em destaque" fica **só o link do portfólio**. Avaliar se o projeto entra em Projetos,
   Competências ou Publicações do perfil (edição pelo notebook do Natã, com o kit de `career-os/03-linkedin/remoto`).

## Regras de conteúdo
- Veracidade: nada de métrica, cargo ou resultado inventado. Usar só o que está nos materiais do Natã.
- Clientes e empresas de terceiros: ocultar nomes de clientes; dados em imagens/vídeos sempre fictícios.
- ControlPDV é privado: nunca citar.
- Didático para recrutador: frases curtas, resumo primeiro, detalhes em seções que abrem.

## Antes de publicar
- Testar em 1440×900, 1366×768, 1362×640, zoom 150% (960×600) e 200% (720×450), iPhone e Android de 320 px:
  nada sobreposto, sem rolagem horizontal, caminhão chega ao último lugar.
- Rodar `./scripts/versionar.sh` (atualiza o `?v=` do CSS/JS para o navegador não usar versão antiga em cache).
- Commit e push em `main`; conferir no endereço publicado.

## Pendências para o próximo projeto
- **Caixas da esteira mais 3D:** hoje parecem ter só dois lados (efeito "fantasma"). Mostrar os três lados visíveis (tampa, frente e lateral) com sombreados distintos, como caixa de papelão real. Fazer junto com a inclusão do próximo projeto.

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

## Estado atual
- Lugares da rota (data-i): 0 ASAM (formação), 1 Tenda, 2 UNIP (formação), 3 Cogra, 4 Estruturação de compras (projeto), 5 Senac (formação), 6 IQF (projeto), 7 Saúde do estoque/ESA (projeto), 8 Bluesoft, 9 Consulting Hub (projeto), 10 Gestão de Consultores (projeto), 11 Ninho Impact (projeto), 12 Precificação na reforma tributária (projeto), 13 Próximo destino.
- Formação: lugares `.place.p.e` (embaixo da estrada, etiqueta verde, legenda "Formação"), no ano de início. UNIP: Ciências Contábeis, 3 de 4 anos cursados, não concluído (nunca escrever "formado"). Senac: em andamento, conclusão prevista para dez./2026 (atualizar quando ele se formar). ASAM: curso profissionalizante de 2017, só formação, não emprego. Cursos: nenhum (os treinamentos em vídeo do sistema da Bluesoft não entram, decisão do Natã).
- Ordem dos casos: Precificação na reforma → Ninho Impact → Gestão de Consultores → Consulting Hub → Saúde do estoque → IQF → Estruturação de compras (ligar anterior/próximo ao incluir um novo).
- Cogra, ordem real dos projetos do Natã: normas e processos (blueprint, SLA, alçadas) → portal de chamados (Teams + Forms + SharePoint, crédito) → ESA (out./2025, o último). Normas, processos e chamados formam um caso só: `casos/estruturacao-compras.html` (2022–2025).
- Tom dos textos (pedido do Natã): relatar o que ele fez, cordial e factual. Nunca criticar empresas, colegas ou áreas (nada de "compras só executava", "cobrava um minuto depois"); nada de chavões ou contexto inventado ("empresa em crescimento"); nada que diminua o feito ("em um dos projetos, sozinho"). Revisar com a skill linkedin-humanizer (regras de tom) antes de publicar texto novo.
- Saúde do estoque (ESA): só a metodologia de out./2025 na Cogra (Excel/VBA). A fase Python/Streamlit de 2026 NÃO entra. Faixas e pesos dos níveis não são publicados (pedido do Natã). Projeto individual.
- Precificação na reforma tributária (`casos/precificacao-reforma.html`): projeto PRÓPRIO do Natã; nunca citar a Bluesoft nem o treinamento de onde veio a ideia. Exceção à regra das amostras: o simulador completo fica no site, a pedido dele, com o visual do portfólio (fórmulas em `assets/js/site.js`, iguais à planilha Simulador_Precificacao_Tributaria_3.0, conferidas centavo por centavo). Alíquotas de CBS/IBS são estimativas editáveis. Pode ir para o "Em destaque" do LinkedIn depois do portfólio. Vídeo tutorial (10min14s) pendente.
- Demonstrações públicas ficam em `casos/<nome>/demo.html` e são só AMOSTRAS: poucas telas estáticas, sem regras/algoritmo no código; o resto leva ao vídeo e ao WhatsApp (pedido do Natã: não ensinar a copiar). A recriação completa usada para gravar o vídeo fica fora do repositório. Sem link de tela cheia.
- Vídeos e pôsteres: ao regravar, trocar o nome do arquivo (ex.: -v2) para não ficar preso em cache.
- Nunca citar a quantidade de casos ("6 casos"): o portfólio continua crescendo. Capa de link atual: `assets/og-v5.png` (2400×1254, fundo liso, pensada para o cartão de ~450 px do "Em destaque": só nome, título grande, desenhos e caminhão; nada de texto miúdo) em todas as páginas; fonte em `career-os/03-linkedin/assets/capa-e-banner.html`. Não usar GIF: o LinkedIn converte GIF em vídeo e o laranja vira vermelho e o texto perde nitidez (testado em 06/11/2026).
- Projetos com colegas: mostrar só o que é do Natã e não destacar nomes de colegas (o portfólio é dele). Nunca atribuir a ele o que outros fizeram.
- O portfólio vende o que o Natã sabe fazer: nada de bastidores internos da empresa (apresentar à diretoria, adoção, próximos passos internos).
- Consulting Hub: o Gerador de Apontamentos não aparece no site nem no vídeo (pedido do Natã).
- Caixas da esteira já mostram tampa, frente e lateral (108 px); com mais caixas, conferir o espaçamento.

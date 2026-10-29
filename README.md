# 🏓 Mesa Pro — Gerenciador de Interclasse de Vôlei de Mesa

> Sistema web para organizar o Interclasse escolar: cadastro de equipes, confrontos, placar digital, classificação automática e histórico de resultados.

**Projeto Interclasse · 2º ano de Desenvolvimento de Sistemas · Colégio Sinerge**
Professor: Ricardo Varjão · Modalidade: **vôlei de mesa**

🔗 **Demonstração online:** _(cole aqui o link do GitHub Pages)_

---

## 📌 Problema

Em muitos Interclasses, a pontuação é anotada em papel ou planilha. Isso gera erros de contagem, demora para montar a classificação e dificulta a consulta dos resultados pelos alunos.

## 🎯 Objetivo

Oferecer uma ferramenta simples e confiável que marque os pontos, decida o vencedor de cada set e partida pelas regras oficiais escolhidas e monte a classificação sozinha.

## 👥 Quem usa

| Público | Uso |
|---|---|
| Árbitros e mesários | Marcam os pontos no placar digital |
| Organizadores e professores | Cadastram equipes, geram confrontos e acompanham o campeonato |
| Alunos e jogadores | Consultam classificação e histórico |

---

## ✨ Funcionalidades

**Essenciais**
- [x] Cadastro e remoção de equipes
- [x] Geração automática de confrontos todos contra todos, organizados em rodadas
- [x] Placar digital com +1 ponto, desfazer e atalhos de teclado
- [x] Detecção automática do vencedor do set e da partida
- [x] Tabela de classificação com critérios de desempate

**Extras**
- [x] Histórico de confrontos com filtro por equipe e campanha (vitórias/derrotas)
- [x] Destaques: líder, melhor ataque e melhor defesa
- [x] Regras configuráveis (melhor de 1, 3 ou 5 sets; set até 7, 11, 15 ou 21 pontos)
- [x] Dados salvos no navegador (`localStorage`)
- [x] Tema claro e escuro automático, layout responsivo para celular
- [x] Botão "Carregar exemplo" para testes e demonstração

---

## 📏 Regras de negócio

- **Set:** termina quando uma equipe atinge o limite de pontos **com 2 pontos de vantagem**.
- **Partida:** vence quem ganhar a maioria dos sets (ex.: melhor de 3 → 2 sets).
- **Classificação:** vitória = **3 pontos**; derrota = 0.
- **Desempate:** 1º saldo de sets, 2º saldo de pontos, 3º ordem alfabética.
- **Confrontos:** método do círculo (round-robin). Com número ímpar de equipes, uma folga por rodada.

## ⌨️ Atalhos do placar

| Tecla | Ação |
|---|---|
| `←` ou `A` | +1 ponto para a equipe da esquerda |
| `→` ou `L` | +1 ponto para a equipe da direita |
| `Z` ou `Backspace` | Desfazer último ponto |
| `Esc` | Fechar placar |

---

## 🛠️ Tecnologias

| Tecnologia | Finalidade |
|---|---|
| HTML5 | Estrutura das telas |
| CSS3 (variáveis, grid, flexbox) | Visual, responsividade e tema claro/escuro |
| JavaScript (puro) | Regras de negócio e interface |
| `localStorage` | Guardar os dados sem banco de dados |
| Git e GitHub | Versionamento e trabalho em equipe |
| GitHub Pages | Publicação do sistema |

## 🗂️ Estrutura do projeto

```
mesa-pro/
├── index.html   # estrutura da página
├── style.css    # estilos e temas
├── app.js       # regras de negócio e telas
├── README.md
└── .gitignore
```

## 🧠 Como o código funciona

- Cada partida guarda apenas um **registro de pontos** (`log`), por exemplo `[0, 0, 1, 0, ...]`.
- A função `calc()` lê esse registro e calcula sets, placar atual e vencedor. Por isso o "desfazer" é simples e seguro: basta remover o último item.
- `table()` percorre as partidas finalizadas e monta a classificação.
- `gen()` cria os confrontos; `render()` desenha a tela atual.

## ▶️ Como executar

1. Baixe ou clone o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/mesa-pro.git
   ```
2. Abra a pasta no **VS Code** e use a extensão **Live Server** (*Open with Live Server*), ou abra o `index.html` no navegador.

Não precisa instalar nada nem ter internet (a fonte é opcional; há fontes de reserva).

## ✅ Como testar

1. Aba **Equipes** → *Carregar exemplo*.
2. Aba **Partidas** → abra uma partida agendada e pontue até o fim do set (ex.: 11-9). Confira que o set encerra sozinho.
3. Teste 10-10: o set só termina com 2 pontos de vantagem (12-10).
4. Use *Desfazer* depois do ponto final e veja a partida voltar a "Ao vivo".
5. Aba **Classificação** → confira pontos, saldo de sets e saldo de pontos.
6. Recarregue a página: os dados devem continuar salvos.

## 🚀 Próximos passos

- [ ] Fase eliminatória (semifinal e final)
- [ ] Gráficos de desempenho por equipe
- [ ] Cadastro de jogadores e estatísticas individuais
- [ ] Exportar classificação em PDF/CSV
- [ ] Banco de dados online para consulta por vários aparelhos

## 🤝 Equipe

| Integrante | Responsabilidade inicial |
|---|---|
| (nome 1) | Interface e estilos (`style.css`) |
| (nome 2) | Regras de pontuação e classificação (`calc()`, `table()`) |
| (nome 3) | Confrontos, histórico e testes (`gen()`, histórico) |

## 🤖 Uso de IA

Ferramentas de IA foram usadas como apoio no desenvolvimento, conforme permitido no enunciado. Todos os integrantes devem compreender e saber explicar o código.

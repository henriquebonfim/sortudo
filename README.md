# Sortudo (A Matemática da Mega-Sena)

[![Test E2E](https://github.com/henriquebonfim/sortudo/actions/workflows/production.yml/badge.svg)](https://github.com/henriquebonfim/sortudo/actions/workflows/production.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Sortudo** é uma aplicação interativa baseada em dados que visualiza a improbabilidade estatística de ganhar na Mega-Sena. Com análises de dados, histórico de sorteios e um gerador de combinações, o projeto educa sobre a matemática dos jogos de azar e suas baixas probabilidades.

---

## 🚀 Principais Recursos

- **📊 Dashboard de Análise Interativo:** Explore mais de 30 anos de história da loteria com gráficos sobre a erosão do prêmio, distribuição geográfica e tendências de frequência.
- **🎲 Gerador de Sorte:** Um gerador de combinações baseado em física que simula a "sorte" necessária para vencer, destacando a aleatoriedade do sorteio.
- **🔍 Busca Histórica:** Verifique qualquer combinação de 6 números para ver se ela já foi sorteada na história da Mega-Sena.
- **📉 Narrativa Matemática Interativa (Scrollytelling):** Uma jornada curada enquanto você rola a página, explicando conceitos como a Lei dos Grandes Números e a distribuição de Poisson em um contexto visual na seção "Matemática do Improvável".

---

## 🛠️ Tech Stach

### Core

- **Runtime:** [Bun](https://bun.sh/) (Runtime JavaScript rápido, _tudo-em-um_)
- **Framework:** [React 18](https://reactjs.org/) com [TypeScript](https://www.typescriptlang.org/)
- **Ferramenta de Build:** [Vite](https://vitejs.dev/)
- **Roteamento:** [React Router 7](https://reactrouter.com/)

### UI & Estilização

- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com efeitos de [Glassmorphism](https://ui.glass/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Componentes:** Primitivos do [Radix UI](https://www.radix-ui.com/)

### Testes & Qualidade

- **Unitário/Integração:** [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Testes E2E:** [Playwright](https://playwright.dev/)
- **Linting/Formatação:** [ESLint](https://eslint.org/) (com limites estritos) & [Prettier](https://prettier.io/)
- **Segurança de Tipos:** [Zod](https://zod.dev/) para validação de dados

---

## 🏗️ Arquitetura

O projeto utiliza uma organização **baseada em funcionalidades**, que separa a lógica por contexto de uso, facilitando a manutenção sem a complexidade de camadas estritas:

1.  **`src/features/`**: Domínios de produto (Analytics, Generator, Search, Home, About), com páginas e componentes por feature.
2.  **`src/app/`**: Roteamento, bootstrap e orquestração global via `AppProvider`.
3.  **`src/store/`**: Estado global e coordenação entre domínio de dados, analytics, busca e geração.
4.  **`src/workers/`**: Processamento pesado fora da thread principal (analytics, parser e search).
5.  **`src/shared/` e `src/lib/`**: UI reutilizável, utilitários, schemas e helpers transversais.

Documentação técnica completa:

- [docs/architecture.md](./docs/architecture.md) — visão de arquitetura, system design, práticas de código, runbook e roadmap técnico.

---

## 🚦 Primeiros Passos

### Pré-requisitos

- [Bun](https://bun.sh/docs/installation) instalado em sua máquina.

### Instalação

```bash
# Clone o repositório
git clone https://github.com/henriquebonfim/sortudo.git
cd sortudo

# Instale as dependências
bun install
```

### Desenvolvimento

```bash
# Busque os dados mais recentes da loteria e inicie o servidor de desenvolvimento
bun run dev
```

### Testes

```bash
# Executa eslint, knip, prettier e verificação de types
bun run codebase:smells

# Execute os testes unitários, integração, e os testes de ponta a ponta (Playwright)
bun run codebase:tests
```

---

## 🧹 Qualidade de Código

Mantemos altos padrões para a saúde do código:

- **Formatação:** `bun run prettier` (Integrado com `lint-staged` no pre-commit).
- **Linting:** `bun run lint` (Verifica tanto o estilo de código quanto violações arquiteturais).
- **CI/CD:** Fluxos de trabalho automatizados para staging, produção e release.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

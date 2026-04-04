# Sortudo? (Lucky?) 🍀 — Mega-Sena Insights

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Sortudo?** é uma ferramenta de auditoria cidadã projetada para desmistificar a matemática por trás das loterias. Usando dados históricos reais da Mega-Sena, o projeto demonstra visualmente as probabilidades e o impacto financeiro de apostar a longo prazo.

> "A sorte é um erro de cálculo. A matemática não é cruel — só honesta."

---

## ✨ Características

-   **📊 Painel de Dados**: Importe os resultados oficiais da Caixa (XLSX) e visualize estatísticas de frequência.
-   **💸 Calculadora de Perdas**: Descubra quanto você já gastou historicamente e o que esse dinheiro teria rendido em Tesouro Selic ou Ibovespa.
-   **🔍 Buscador de Combinações**: Verifique se seus números da "sorte" já saíram alguma vez nos 2.800+ concursos.
-   **🏗️ Arquitetura DDD**: Código limpo, testável e desacoplado, seguindo padrões de Domain-Driven Design.

## 🏗️ Requisitos Técnicos

O projeto utiliza tecnologias modernas focadas em performance e experiência do usuário:

-   **Frontend**: React + TypeScript + Vite
-   **Estilização**: Tailwind CSS + shadcn/ui
-   **Animações**: Framer Motion
-   **Persistência**: IndexedDB (Local-first storage)
-   **Processamento**: Web Workers

---

## 🚀 Como Começar

### Pré-requisitos
-   Node.js (v18+)
-   Bun (recomendado) ou npm/yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/henriquebonfim/sortudo.git

# Entre na pasta
cd sortudo

# Instale as dependências
bun install

# Inicie o servidor de desenvolvimento
bun dev
```

---

## 📂 Arquitetura (DDD)

A base de código é organizada em camadas para garantir escalabilidade:

-   `src/domain`: Entidades, interfaces de repositório e serviços de domínio (as regras do jogo).
-   `src/application`: Serviços de aplicação que orquestram fluxos de dados e comandos.
-   `src/infrastructure`: Implementações técnicas (storage, workers, api clients).
-   `src/features`: Fatias verticais de funcionalidades complexas.

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Sinta-se à vontade para abrir uma Issue ou enviar um Pull Request.

1. Faça um Fork do projeto
2. Crie uma Branch para sua feature (`git checkout -b feature/minha-feature`)
3. Faça commit das suas alterações (`git commit -m 'feat: Adiciona nova funcionalidade'`)
4. Faça Push para a Branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

Desenvolvido com ❤️ e matemática por [Henrique Bonfim](https://github.com/henriquebonfim).

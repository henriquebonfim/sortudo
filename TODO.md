# A Sorte Não Está com Você — Plano de Voo (Produção)

> Atualizado em 2026-04-05 · Todos os débitos técnicos críticos foram resolvidos.
> `[x]` = Tarefa Completa.

---

## 🏗️ A. Arquitetura e Estrutura (Padrão 2026)

- [x] **Redução de Overengineering:** DDD removido em favor de uma estrutura modular baseada em funcionalidades.
- [x] **Validação de Dados:** Zod agora protege a entrada de dados do JSON de estatísticas.
- [ ] **Organização de UI:** Mover componentes atômicos (Button, Card, Input) para `src/components/ui`.
- [x] **Linting & Formatting:** Prettier integrado com Husky para commits limpos.

---

## 🧪 B. Garantia de Qualidade

- [x] **Smoke Tests:** Playwright cobrindo o fluxo principal de ponta a ponta.
- [x] **Math Coverage:** Testes unitários para lógica de probabilidade.
- [ ] **Error Boundaries:** Implementar uma barreira global de erro para falhas de renderização inesperadas.

---

## 🎨 C. Design & Polimento

- [x] **Internacionalização (Pt-Br):** README e documentação traduzidos.
- [ ] **SEO & Acessibilidade:** Adicionar meta-tags básicas no `index.html` e garantir labels em todos os botões.
- [ ] **Feedback de Interação:** Garantir que o "Gerador" tenha feedback tátil/visual claro ao gerar números.

---

## 🚀 D. Checklist de Deploy

- [x] **Build Pipeline:** `fetch:json` roda no pré-build para garantir dados novos.
- [ ] **Robots.txt & Sitemap:** Adicionar para indexação correta.
- [ ] **Favicon & PWA:** Configurar manifesto básico.

# Changelog

## [Unreleased]

### Added
- feat(design-system): production-ready typed 2-layer token system (primitives + semantic)
- feat(design-system): `motion.ts` — centralized spring, duration, delay, ease and variant presets
- feat(design-system): `tokens.css` — CSS custom property layer extending shadcn variables
- feat(design-system): typed component interfaces for Button, StatCard, BallBadge, SectionHeader
- feat(design-system): `chart-styles.ts` — shared recharts tooltip/cursor constants for analytics
- feat(design-system): barrel export `index.ts` for single import point

### Fixed
- fix(BallBadge): undefined CSS variable `--accent-cold` → `--cold`; hardcoded `#fff` → `hsl(var(--primary-foreground))`
- fix(NumberInput): undefined CSS variables `--accent-hot` → `--hot`, `--accent-gold` → `--primary`
- fix(shared-animations): hardcoded `hsl(240 25% 12%)` and `hsl(38 92% 50% / 0.3)` in tooltipStyle replaced with CSS variables
- fix(chart.constants): all hardcoded hex values replaced with `primitives.color.chart.*` references
- fix(TrueNetEVChart): hardcoded tooltip and activeDot hex values replaced with chart-styles constants
- fix(PoissonSplittingChart): hardcoded tooltip hex values replaced with chart-styles constants
- fix(JackpotErosionWaterfall): hardcoded data colors and tooltip hex values replaced
- fix(LLNConvergenceChart): hardcoded tooltip hex values replaced with chart-styles constants
- fix(index.css): incorrect `@import` order fixed; added `--font-mono`, `--font-display`, `--font-body` CSS vars; `prefers-reduced-motion` media query added

### Changed
- refactor(StatCard): imports design system StatCardProps and statCardVariantStyles; spring consolidated; aria-label support added
- refactor(FeatureCard): spring.standard from design system replaces inline spring literal
- refactor(MathSection): spring.gentle from design system replaces inline spring literal
- refactor(CombinatorialSection): spring.gentle from design system replaces inline spring literal
- refactor(HeroSection): spring.gentle from design system replaces inline spring literal
- refactor(shared-animations): fadeUp now uses spring.standard token
- refactor(DataDashboard): `variant="gold"` → `variant="brand"` (canonical name)
- refactor(BubbleChart): `variant="gold"` → `variant="brand"` (canonical name)
- refactor(tailwind.config): typed with `satisfies Config`, imports primitives for shadow/font config

## 1.0.0 (2026-03-25)


### Features

* add odds visualizer component to home and dashboard ([ee2c1ba](https://github.com/henriquebonfim/sortudo/commit/ee2c1ba1caa2464503f576e285dedfba97d8559b))
* implement infographics ([2bacfd7](https://github.com/henriquebonfim/sortudo/commit/2bacfd732ed66e7faa8703936e89922d9a036d72))
* update all imports to follow absolute paths ([cd83784](https://github.com/henriquebonfim/sortudo/commit/cd83784bbb4ba4f2f907b6bd5f7080ec8b3bc82b))


### Bug Fixes

* adjust adsense id and fix CI building step ([eb5f8a4](https://github.com/henriquebonfim/sortudo/commit/eb5f8a4961281c9b437f6f7a7af3ef1c2060c93c))

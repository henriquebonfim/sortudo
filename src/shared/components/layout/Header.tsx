import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Dices, Home, Info, Menu, Search, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Início', path: '/', icon: Home },
  { label: 'Gerador', path: '/gerador', icon: Dices },
  { label: 'Buscar', path: '/buscar', icon: Search },
  { label: 'Sobre', path: '/sobre', icon: Info },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isDados = location.pathname.startsWith('/dados');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-glass" role="banner">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="Sortudo? — Página Inicial"
        >
          <TrendingUp className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
          <span className="font-display font-bold text-lg text-foreground ">
            Sor<span className="underline decoration-primary">tudo</span>
            <span className="text-gradient-gold">?</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          className="hidden md:flex items-center gap-0.5 flex-1 justify-center"
          aria-label="Navegação principal"
        >
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-medium
                  transition-colors duration-150 group
                  ${
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon
                  className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-primary' : 'opacity-60 group-hover:opacity-80'}`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {item.label}

                {/* Active underline indicator */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop right: CTA ── */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Link
            to="/dados"
            aria-current={isDados ? 'page' : undefined}
            className={`
              flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold
              transition-all duration-200 cursor-pointer
              ${
                isDados
                  ? 'bg-primary/20 border border-primary/40 text-primary'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
              }
            `}
          >
            <BarChart3 className="w-3.5 h-3.5" strokeWidth={2} />
            Relatório
          </Link>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Mobile nav ── */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-border"
            style={{ background: 'hsl(228 30% 7% / 0.97)', backdropFilter: 'blur(20px)' }}
            aria-label="Navegação mobile"
          >
            <div className="container py-3 flex flex-col gap-1">
              {[...navItems, { label: 'Relatório', path: '/dados', icon: BarChart3 }].map(
                (item, i) => {
                  const isActive =
                    item.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path);
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={`
                        flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-200
                        ${
                          isActive
                            ? 'nav-pill-active'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }
                      `}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <item.icon className="w-4 h-4" strokeWidth={isActive ? 2.2 : 1.8} />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                }
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

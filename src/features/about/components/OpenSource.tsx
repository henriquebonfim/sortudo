import { Code2, Globe } from "lucide-react";

export function OpenSource() {
  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="font-display font-bold text-xl text-foreground mb-3">
        <Code2 className="inline mr-2 h-5 w-5 text-primary" />
        Open Source
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Este projeto é completamente aberto. Contribuições são bem-vindas!
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="https://github.com/henriquebonfim/sortudo"
          target="_blank"
          rel="noopener noreferrer"
          className="pill-btn pill-btn-inactive flex items-center gap-2"
        >
          <Globe className="h-4 w-4" /> Código Fonte
        </a>
      </div>
    </div>
  );
}

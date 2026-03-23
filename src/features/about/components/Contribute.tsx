export function Contribute() {
  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="font-display font-bold text-xl text-foreground mb-3">Como contribuir</h2>
      <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
        <li>Fork o repositório no GitHub</li>
        <li>Clone e instale as dependências: <code className="font-mono text-primary">npm install</code></li>
        <li>Copie <code className="font-mono text-primary">.env.example</code> para <code className="font-mono text-primary">.env</code></li>
        <li>Rode o dev server: <code className="font-mono text-primary">npm run dev</code></li>
        <li>Abra um Pull Request com suas mudanças</li>
      </ol>
    </div>
  );
}

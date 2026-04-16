import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/shared/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center bg-destructive/5 rounded-xl border border-destructive/20 border-dashed m-4">
            <h2 className="text-2xl font-bold text-destructive mb-2">Ops! Algo deu errado.</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Não conseguimos processar os dados deste gráfico ou seção. Tente recarregar a página.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => window.location.reload()} variant="outline">
                Recarregar
              </Button>
              <Button onClick={this.handleReset}>Voltar ao Início</Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-black/80 text-red-400 text-xs text-left overflow-auto max-w-full rounded border border-white/10">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

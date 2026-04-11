import { parseExcelToGames } from '@/lib/lottery/parser';
import { Button } from '@/shared/components/ui/Button';
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { cn } from '@/shared/utils/cn';
import { useLotteryStore } from '@/store/lottery';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Database,
  FileCheck,
  Loader2,
  Upload,
} from 'lucide-react';
import * as React from 'react';

interface XlsxUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
}

type Step = 'idle' | 'validating' | 'preview' | 'applying' | 'error';

export function XlsxUploadModal({ open, onClose, onSuccess }: XlsxUploadModalProps) {
  const [step, setStep] = React.useState<Step>('idle');
  const [file, setFile] = React.useState<File | null>(null);
  const [previewData, setPreviewData] = React.useState<{
    total: number;
    first: string;
    last: string;
    delta: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [isDragging, setIsDragging] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const loadFromFile = useLotteryStore((state) => state.loadFromFile);
  const currentTotal = useLotteryStore((state) => state.games.length);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      setStep('idle');
      setFile(null);
      setPreviewData(null);
      setErrorMessage('');
    }
  }, [open]);

  const handleFile = async (f: File) => {
    if (!f.name.toLowerCase().endsWith('.xlsx')) {
      setErrorMessage('Por favor, selecione um arquivo .xlsx válido.');
      setStep('error');
      return;
    }

    setFile(f);
    setStep('validating');

    try {
      const buffer = await f.arrayBuffer();
      const games = parseExcelToGames(new Uint8Array(buffer));

      if (games.length === 0) {
        throw new Error('Nenhum jogo encontrado no arquivo.');
      }

      setPreviewData({
        total: games.length,
        first: games[0].date,
        last: games[games.length - 1].date,
        delta: games.length - currentTotal,
      });
      setStep('preview');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Falha ao validar arquivo.');
      setStep('error');
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const onConfirm = async () => {
    if (!file) return;
    setStep('applying');
    try {
      await loadFromFile(file);
      onSuccess(previewData?.total || 0);
      onClose();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Falha ao aplicar dados.');
      setStep('error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="max-w-md">
      <DialogHeader>
        <DialogTitle>Atualizar Banco de Dados</DialogTitle>
        <DialogDescription>
          Carregue o <a className='text-primary underline' target='_blank' rel='noopener noreferrer' href="https://loterias.caixa.gov.br/Paginas/Mega-Sena.aspx#:~:text=Resultados%20da%20Mega%2DSena%20por%20ordem%20crescente.">  Arquivo Oficial  </a> da Mega-Sena (.xlsx) para atualizar as estatísticas.
        </DialogDescription>
      </DialogHeader>

      <DialogBody>
        <AnimatePresence mode="wait">
          {step === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'group relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 transition-all cursor-pointer',
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/5'
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={onSelect}
                accept=".xlsx"
                className="hidden"
              />
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Upload size={32} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">Arraste seu arquivo aqui</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ou clique para procurar no seu computador
                </p>
              </div>
            </motion.div>
          )}

          {(step === 'validating' || step === 'applying') && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 gap-4"
            >
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Loader2 className="animate-spin" size={32} />
                </div>
              </div>
              <p className="text-sm font-medium animate-pulse">
                {step === 'validating'
                  ? 'Validando estrutura dos dados...'
                  : 'Integrando dados ao dashboard...'}
              </p>
            </motion.div>
          )}

          {step === 'preview' && previewData && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-start gap-3">
                <FileCheck className="text-emerald-400 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Arquivo Validado</p>
                  <p className="text-xs text-muted-foreground">{file?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-muted/5 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Database size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Total de Jogos
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className="text-xl font-display font-bold">
                      {previewData.total.toLocaleString()}
                    </p>
                    {previewData.delta > 0 && (
                      <span className="text-[10px] font-bold text-emerald-400 mb-1">
                        +{previewData.delta}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/5 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Último Sorteio
                    </span>
                  </div>
                  <p className="text-lg font-display font-bold">
                    {previewData.last.split('-').reverse().join('/')}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/5 p-4 flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Início
                  </p>
                  <p className="text-xs font-mono">
                    {previewData.first.split('-').reverse().join('/')}
                  </p>
                </div>
                <div className="text-muted-foreground">
                  <ArrowRight size={14} />
                </div>
                <div className="text-center flex-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Fim
                  </p>
                  <p className="text-xs font-mono">
                    {previewData.last.split('-').reverse().join('/')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 flex flex-col items-center text-center gap-4"
            >
              <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-rose-500">Falha na Validação</p>
                <p className="text-xs text-muted-foreground mt-1">{errorMessage}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep('idle')}>
                Tentar novamente
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogBody>

      <DialogFooter>
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={step === 'applying' || step === 'validating'}
        >
          {step === 'preview' ? 'Descartar' : 'Cancelar'}
        </Button>
        {step === 'preview' && (
          <Button
            onClick={onConfirm}
            leftIcon={<FileCheck size={16} />}
          >
            Aplicar Dados
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}

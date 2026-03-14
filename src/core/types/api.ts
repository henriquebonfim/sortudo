export interface MetaResponse {
  total_concursos: number;
  data_primeiro: string;
  data_ultimo: string;
  total_ganhadores_sena: number;
  pct_sem_ganhador: number;
  media_premio_sena: number;
  maior_premio: number;
  media_sorteios_entre_ganhadores: number;
}

export interface FrequenciasResponse {
  frequencias: Record<string, number>;
  min: { numero: number; freq: number };
  max: { numero: number; freq: number };
  media: number;
  desvio_padrao: number;
}

export interface TimelineConcurso {
  id: number;
  data: string;
  estimativa: number;
  ganhadores_sena: number;
  acumulado: boolean;
}

export interface TimelineResponse {
  concursos: TimelineConcurso[];
}

export interface Concurso {
  id: number;
  data: string;
  bolas: number[];
  ganhadores_sena: number;
  ganhadores_quina: number;
  ganhadores_quadra: number;
  premio_sena: number;
  premio_quina: number;
  acumulado: boolean;
}

export interface ConcursosResponse {
  data: Concurso[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface EstadosResponse {
  estados: Record<string, number>;
  total: number;
}

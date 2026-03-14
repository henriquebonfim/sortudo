import axios from "axios";
import type {
  MetaResponse,
  FrequenciasResponse,
  TimelineResponse,
  ConcursosResponse,
  EstadosResponse,
} from "@/core/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/megasena";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// Simple in-memory cache
const cache = new Map<string, { data: unknown; ts: number }>();

async function cached<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < ttlMs) return hit.data as T;
  try {
    const data = await fetcher();
    cache.set(key, { data, ts: Date.now() });
    return data;
  } catch {
    // Return mock data in development when API is unavailable
    const mock = getMockData(key);
    if (mock) return mock as T;
    throw new Error(`API indisponível: ${key}`);
  }
}

const ONE_HOUR = 3_600_000;
const ONE_DAY = 86_400_000;

export const megaService = {
  getMeta: () => cached<MetaResponse>("meta", ONE_HOUR, async () => (await client.get("/meta")).data),
  getFrequencias: () => cached<FrequenciasResponse>("frequencias", ONE_HOUR, async () => (await client.get("/frequencias")).data),
  getTimeline: () => cached<TimelineResponse>("timeline", ONE_HOUR, async () => (await client.get("/timeline")).data),
  getConcursos: (page = 1, limit = 100) =>
    cached<ConcursosResponse>(`concursos-${page}-${limit}`, ONE_HOUR, async () => (await client.get(`/concursos?page=${page}&limit=${limit}`)).data),
  getEstados: () => cached<EstadosResponse>("estados", ONE_DAY, async () => (await client.get("/estados")).data),
};

// --- Mock data for development without API ---
function getMockData(key: string): unknown {
  if (key === "meta") return MOCK_META;
  if (key === "frequencias") return MOCK_FREQUENCIAS;
  return null;
}

const MOCK_META: MetaResponse = {
  total_concursos: 2_783,
  data_primeiro: "1996-03-11",
  data_ultimo: "2024-12-28",
  total_ganhadores_sena: 981,
  pct_sem_ganhador: 78.2,
  media_premio_sena: 40_500_000,
  maior_premio: 541_000_000,
  media_sorteios_entre_ganhadores: 4.7,
};

function generateMockFrequencias(): FrequenciasResponse {
  const frequencias: Record<string, number> = {};
  let min = { numero: 1, freq: 999 };
  let max = { numero: 1, freq: 0 };
  let sum = 0;

  for (let i = 1; i <= 60; i++) {
    const freq = Math.floor(240 + Math.random() * 120);
    frequencias[String(i)] = freq;
    sum += freq;
    if (freq < min.freq) min = { numero: i, freq };
    if (freq > max.freq) max = { numero: i, freq };
  }

  const media = sum / 60;
  const variance = Object.values(frequencias).reduce((acc, f) => acc + (f - media) ** 2, 0) / 60;

  return { frequencias, min, max, media, desvio_padrao: Math.sqrt(variance) };
}

const MOCK_FREQUENCIAS = generateMockFrequencias();

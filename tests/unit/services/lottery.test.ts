import { fetchLotteryData } from '@/services/lottery';
import { afterEach, describe, expect, it, vi } from 'vitest';

function mockFetchResponse(body: unknown, ok = true): Response {
  return {
    ok,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('fetchLotteryData', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('normalizes legacy portuguese draw fields', async () => {
    const payload = {
      concursos: [
        {
          id: 3020,
          data: '2026-02-10',
          bolas: [1, 2, 3, 4, 5, 6],
          ganhadoresSena: 1,
          valorSena: 1_250_000,
          ganhadoresQuina: 100,
          valorQuina: 31_000,
          ganhadoresQuadra: 6_000,
          valorQuadra: 800,
          acumulado: true,
          arrecadacao_total: 4_200_000,
          estimativa_premio: 6_900_000,
          cidadeUF: ['SP', 'RJ'],
          valorAcumuladoSena: 8_100_000,
          acumulado_sorteio_especial_mega_da_virada: 35_000_000,
        },
      ],
      sync_at: '2026-02-11T10:00:00.000Z',
    };

    const fetchMock = vi.fn().mockResolvedValue(mockFetchResponse(payload));
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchLotteryData();

    expect(fetchMock).toHaveBeenCalledWith('/data.json');
    expect(result.games).toHaveLength(1);
    expect(result.games[0]).toMatchObject({
      id: 3020,
      date: '2026-02-10',
      numbers: [1, 2, 3, 4, 5, 6],
      jackpotWinners: 1,
      jackpotPrize: 1_250_000,
      quinaWinners: 100,
      quinaPrize: 31_000,
      quadraWinners: 6_000,
      quadraPrize: 800,
      accumulated: true,
      totalRevenue: 4_200_000,
      prizeEstimate: 6_900_000,
      locations: ['SP', 'RJ'],
      accumulatedJackpot: 8_100_000,
      megaViradaAccumulated: 35_000_000,
    });

    expect(result.metadata).toEqual({
      totalGames: 1,
      firstGameDate: '2026-02-10',
      lastGameDate: '2026-02-10',
      lastUpdate: '2026-02-11T10:00:00.000Z',
    });
    expect(result.stats).toBeNull();
  });

  it('filters invalid mapped draws before returning games', async () => {
    const payload = {
      draws: [
        {
          id: 3021,
          date: '2026-02-11',
          numbers: [7, 8, 9, 10, 11, 12],
        },
        {
          id: 0,
          date: '2026-02-12',
          numbers: [1, 2, 3, 4, 5, 6],
        },
      ],
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetchResponse(payload)));

    const result = await fetchLotteryData();

    expect(result.games).toHaveLength(1);
    expect(result.games[0]).toMatchObject({ id: 3021, date: '2026-02-11' });
  });

  it('prefers explicit metadata when payload metadata exists', async () => {
    const payload = {
      games: [
        {
          id: 3022,
          date: '2026-02-13',
          numbers: [13, 14, 15, 16, 17, 18],
        },
      ],
      metadata: {
        totalGames: 999,
        firstGameDate: '2000-01-01',
        lastGameDate: '2000-12-31',
        lastUpdate: '2026-01-01T00:00:00.000Z',
      },
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetchResponse(payload)));

    const result = await fetchLotteryData();

    expect(result.metadata).toEqual(payload.metadata);
  });

  it('handles non-array draw collections without crashing', async () => {
    const payload = {
      draws: { invalid: true },
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetchResponse(payload)));

    const result = await fetchLotteryData();

    expect(result.games).toEqual([]);
    expect(result.metadata).toBeNull();
    expect(result.stats).toBeNull();
  });

  it('throws when the static data request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetchResponse({}, false)));

    await expect(fetchLotteryData()).rejects.toThrow('Failed to load static data');
  });
});

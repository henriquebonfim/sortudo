import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { SyncService } from '../../src/application/services/SyncService';
import { REAL_DRAWS } from '../fixtures/real-data';

describe('SyncService (Unit Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset global fetch mock
    global.fetch = vi.fn();
  });

  it('fetchLatestData should fetch, map and calculate statistics correctly', async () => {
    const mockData = {
      draws: REAL_DRAWS.slice(0, 10),
      sync_at: '2024-03-25T12:00:00Z'
    };

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await SyncService.fetchLatestData();

    expect(global.fetch).toHaveBeenCalledWith('/data.json');
    expect(result.draws).toHaveLength(10);
    expect(result.stats).toBeDefined();
    expect(result.metadata).toBeDefined();
    expect(result.metadata?.totalDraws).toBe(10);
    expect(result.stats?.typeComparison).toBeDefined();
  });

  it('fetchLatestData should throw error when fetch fails', async () => {
    // Suppress console.error for expected test error
    vi.spyOn(console, 'error').mockImplementation(() => {});

    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(SyncService.fetchLatestData()).rejects.toThrow('Failed to load static data');
  });

  it('fetchLatestData should handle malformed JSON gracefully via Zod validation', async () => {
    // Suppress console.error for expected validation failure
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // Missing required fields like 'numbers'
    const malformedData = {
      draws: [
        { id: 1, date: '2024-03-25' } 
      ]
    };

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => malformedData,
    });

    // mapper should log warning and filter out invalid draws
    const result = await SyncService.fetchLatestData();
    expect(result.draws).toHaveLength(0); // Should be suppressed
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';

const xlsxMocks = vi.hoisted(() => ({
  read: vi.fn(),
  sheetToJson: vi.fn(),
}));

vi.mock('xlsx', () => ({
  read: xlsxMocks.read,
  utils: {
    sheet_to_json: xlsxMocks.sheetToJson,
  },
}));

import { parseExcelToGames } from '@/workers/parser/engine';

describe('parser engine', () => {
  beforeEach(() => {
    xlsxMocks.read.mockReset();
    xlsxMocks.sheetToJson.mockReset();
  });

  it('throws when workbook has no sheets', () => {
    xlsxMocks.read.mockReturnValue({ SheetNames: [], Sheets: {} });

    expect(() => parseExcelToGames(new ArrayBuffer(16))).toThrow('The file is empty.');
  });

  it('throws when workbook sheet is missing', () => {
    xlsxMocks.read.mockReturnValue({ SheetNames: ['Results'], Sheets: {} });

    expect(() => parseExcelToGames(new ArrayBuffer(16))).toThrow(
      'Could not find a valid worksheet.'
    );
  });

  it('parses, normalizes, and sorts draws from caixa-like rows', () => {
    xlsxMocks.read.mockReturnValue({
      SheetNames: ['Results'],
      Sheets: {
        Results: {
          A1: { v: 'header' },
          A3: { v: 'row' },
        },
      },
    });

    xlsxMocks.sheetToJson.mockReturnValue([
      [
        'Concurso',
        'Data do Sorteio',
        'Bola 1',
        'Bola 2',
        'Bola 3',
        'Bola 4',
        'Bola 5',
        'Bola 6',
        'Ganhadores 6',
        'Rateio 6',
        'Ganhadores 5',
        'Rateio 5',
        'Ganhadores 4',
        'Rateio 4',
        'Arrecadacao',
        'Acumulado 6',
        'Estimativa',
        'Cidade UF',
        'Observacao',
        'Mega da Virada',
      ],
      [
        2,
        '02/01/2024',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        0,
        'R$ 0,00',
        120,
        'R$ 1.234,56',
        2200,
        'R$ 123,45',
        'R$ 1.000.000,00',
        'R$ 0,00',
        'R$ 2.000.000,00',
        'Canal Eletronico',
        '',
        'R$ 0,00',
      ],
      [
        1,
        '01/01/2024',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        1,
        'R$ 3.000.000,00',
        10,
        'R$ 8.000,00',
        500,
        'R$ 800,00',
        'R$ 900.000,00',
        'R$ 5.000.000,00',
        'R$ 7.000.000,00',
        'Sao Paulo/SP; Rio de Janeiro/RJ',
        'Nota importante',
        'R$ 9.000.000,00',
      ],
    ]);

    const draws = parseExcelToGames(new ArrayBuffer(16));

    expect(draws).toHaveLength(2);
    expect(draws.map((d) => d.id)).toEqual([1, 2]);

    expect(draws[0]).toMatchObject({
      id: 1,
      date: '2024-01-01',
      numbers: [10, 11, 12, 13, 14, 15],
      accumulated: true,
      locations: ['SP', 'RJ'],
      notes: 'Nota importante',
      totalRevenue: 900000,
      accumulatedJackpot: 5000000,
      megaViradaAccumulated: 9000000,
    });

    expect(draws[1]).toMatchObject({
      id: 2,
      date: '2024-01-02',
      numbers: [1, 2, 3, 4, 5, 6],
      accumulated: false,
      locations: ['ONLINE'],
    });
    expect(draws[1].accumulatedJackpot).toBeUndefined();
  });
});

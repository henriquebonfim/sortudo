import { describe, it, expect } from 'vitest';
import { parseCaixaExcel } from '@/infrastructure/parser/caixa-excel-parser';

const OFFICIAL_HEADERS = [
  "Concurso", "Data do Sorteio", "Bola1", "Bola2", "Bola3", "Bola4", "Bola5", "Bola6", "Ganhadores 6 acertos",
  "Cidade / UF", "Rateio 6 acertos", "Ganhadores 5 acertos", "Rateio 5 acertos", "Ganhadores 4 acertos",
  "Rateio 4 acertos", "Acumulado 6 acertos", "Arrecadação Total", "Estimativa prêmio",
  "Acumulado Sorteio Especial Mega da Virada", "Observação"
];

describe('Caixa Excel Parser', () => {
  it('should parse a valid array of data correctly', () => {
    const data = [
      OFFICIAL_HEADERS,
      [2600, '01/01/2024', 1, 2, 3, 4, 5, 6, 1, 'CIDADE', 'R$ 1.000.000,00', 10, 'R$ 50.000,00', 100, 'R$ 1.000,00', 'R$ 5.000.000,00', 'R$ 30.000.000,00', 'R$ 10.000.000,00', 'R$ 0,00', '']
    ];
    const results = parseCaixaExcel(data);
    expect(results.length).toBe(1);
    const res = results[0];
    expect(res.id).toBe(2600);
    expect(res.date).toBe('2024-01-01');
    expect(res.numbers).toEqual([1, 2, 3, 4, 5, 6]);
    expect(res.jackpotPrize).toBe(1000000);
    expect(res.jackpotWinners).toBe(1);
    expect(res.accumulated).toBe(true);
  });

  it('should handle Excel serial numbers for dates', () => {
    const data = [
      OFFICIAL_HEADERS,
      [2600, 45292, 1, 2, 3, 4, 5, 6, 0, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, '']
    ];
    const results = parseCaixaExcel(data);
    expect(results[0]?.date).toBe('2024-01-01');
  });

  it('should return empty array for invalid data', () => {
    expect(parseCaixaExcel([])).toEqual([]);
    expect(parseCaixaExcel([OFFICIAL_HEADERS, ['not a number', '01/01/2024']])).toEqual([]);
  });
  
  it('should sort numbers even if they are out of order in Excel', () => {
    const data = [
      OFFICIAL_HEADERS,
      [2600, '01/01/2024', 50, 10, 30, 20, 40, 60, 0, '', 0, 0, 0, 0, 0, 0, 0, 0, 0, '']
    ];
    const results = parseCaixaExcel(data);
    expect(results[0]?.numbers).toEqual([10, 20, 30, 40, 50, 60]);
  });

  it('should parse "Dezena" headers correctly (official Caixa format)', () => {
    const DEZENA_HEADERS = [
      "Concurso", "Data do Sorteio", "Dezena1", "Dezena2", "Dezena3", "Dezena4", "Dezena5", "Dezena6", "Ganhadores 6 acertos"
    ];
    const data = [
      DEZENA_HEADERS,
      [2600, '01/01/2024', 10, 20, 30, 40, 50, 60, 0]
    ];
    const results = parseCaixaExcel(data);
    expect(results[0]?.numbers).toEqual([10, 20, 30, 40, 50, 60]);
  });

  it('should normalize "Canal Eletronico" correctly', () => {
    const data = [
      OFFICIAL_HEADERS,
      [2600, '01/01/2024', 1, 2, 3, 4, 5, 6, 1, 'CANAL ELETRÔNICO', 0, 0, 0, 0, 0, 0, 0, 0, 0, '']
    ];
    const results = parseCaixaExcel(data);
    expect(results[0]?.locations).toEqual(['Canal Eletrônico']);
  });

  it('should handle multiple cities separated by semicolon', () => {
    const data = [
      OFFICIAL_HEADERS,
      [2600, '01/01/2024', 1, 2, 3, 4, 5, 6, 2, 'CIDADE1/SP; CIDADE2/RJ', 0, 0, 0, 0, 0, 0, 0, 0, 0, '']
    ];
    const results = parseCaixaExcel(data);
    expect(results[0]?.locations).toEqual(['CIDADE1/SP', 'CIDADE2/RJ']);
  });
});

import { describe, it, expect } from "vitest";
import {
  formatCurrency,
  formatCompactCurrency,
  calculatePercentage,
  round,
  formatNumber,
  getYear,
  getDecade,
} from "../../src/lib/formatters";

describe("formatters", () => {
  describe("formatCurrency", () => {
    it("formats thousands", () => {
      expect(formatCurrency(1000).replace(/\s/g, ' ')).toMatch(/1\.000,00/);
    });
    
    it("formats zero", () => {
      expect(formatCurrency(0).replace(/\s/g, ' ')).toMatch(/0,00/);
    });
  });

  describe("formatCompactCurrency", () => {
    it("formats billions", () => {
      expect(formatCompactCurrency(1_500_000_000)).toBe("R$ 1.5B");
    });
    it("formats millions", () => {
      expect(formatCompactCurrency(2_500_000)).toBe("R$ 2.5M");
    });
    it("formats thousands", () => {
      expect(formatCompactCurrency(3_500)).toBe("R$ 4k"); // 3.5k rounds to 4k per toFixed(0)
    });
    it("formats small numbers", () => {
      expect(formatCompactCurrency(500)).toBe("R$ 500");
    });
  });

  describe("calculatePercentage", () => {
    it("handles zero total", () => {
      expect(calculatePercentage(50, 0)).toBe(0);
    });
    it("calculates correctly", () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(1, 3)).toBe(33.3);
    });
  });

  describe("round", () => {
    it("rounds to 1 decimal by default", () => {
      expect(round(1.55)).toBe(1.6);
    });
    it("rounds to specified decimals", () => {
      expect(round(1.555, 2)).toBe(1.56);
    });
  });

  describe("formatNumber", () => {
    it("formats with pt-BR locale", () => {
      expect(formatNumber(1000).replace(/\s/g, ' ')).toBe("1.000");
    });
  });

  describe("getYear", () => {
    it("extracts year", () => {
      expect(getYear("2024-05-10")).toBe(2024);
    });
  });

  describe("getDecade", () => {
    it("extracts decade", () => {
      expect(getDecade("1996-03-11")).toBe("Década de 90");
      expect(getDecade("2005-01-01")).toBe("Década de 00");
      expect(getDecade("2015-01-01")).toBe("Década de 10");
      expect(getDecade("2024-01-01")).toBe("Década de 20");
    });
  });
});

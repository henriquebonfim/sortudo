import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OddsVisualizerChart } from '../../src/features/analytics-dashboard/charts/odds-visualizer/OddsVisualizerChart';

describe('OddsVisualizerChart', () => {
  it('renders the title correctly', () => {
    render(<OddsVisualizerChart />);
    expect(screen.getByText('A Escala da Improbabilidade')).toBeInTheDocument();
  });

  it('renders all comparison items', () => {
    render(<OddsVisualizerChart />);
    expect(screen.getByText('Ganhar na Mega-Sena')).toBeInTheDocument();
    expect(screen.getByText('Ser atingido por um raio')).toBeInTheDocument();
    expect(screen.getByText('Morrer por um meteorito')).toBeInTheDocument();
    expect(screen.getByText('Ataque fatal de tubarão')).toBeInTheDocument();
  });

  it('renders the educational insight', () => {
    render(<OddsVisualizerChart />);
    expect(screen.getByText(/O Viés do Otimismo:/)).toBeInTheDocument();
  });
});

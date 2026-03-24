import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { OddsStorySection } from '../../src/features/home/components/OddsStorySection';

describe('OddsStorySection', () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('renders the section title', () => {
    renderWithRouter(<OddsStorySection />);
    expect(screen.getByText(/A Ilusão da/)).toBeInTheDocument();
    expect(screen.getByText('Proporção')).toBeInTheDocument();
  });

  it('renders the educational text', () => {
    renderWithRouter(<OddsStorySection />);
    expect(screen.getByText(/O cérebro humano evoluiu para entender/)).toBeInTheDocument();
  });

  it('renders the call to action button', () => {
    renderWithRouter(<OddsStorySection />);
    const link = screen.getByRole('link', { name: /Explorar os Dados Completos/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dados');
  });
});

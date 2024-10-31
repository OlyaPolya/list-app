import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders h1 title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Список персонажей сериала "Rick and Morty"/i);
  expect(linkElement).toBeInTheDocument();
});

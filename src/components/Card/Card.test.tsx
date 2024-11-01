import React from 'react';
import {render,  screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import { fakeData } from '../../services/fakeData';
import Card from './Card';

const fakeDataCard = fakeData.results[0];

test('renders button', () => {
	render(<Card character={fakeDataCard} onDelete={(id: number) => () => console.log('onDelete', id)} onEditName={(id: number, name: string) => () => console.log('onEditName', id, name)} />);

  const button = screen.getByText('Delete')
  expect(button).toBeInTheDocument();
});

test('match snapshot', () => {
	render(<Card character={fakeDataCard} onDelete={(id: number) => () => console.log('onDelete', id)} onEditName={(id: number, name: string) => () => console.log('onEditName', id, name)} />);

  expect(screen).toMatchSnapshot();
});


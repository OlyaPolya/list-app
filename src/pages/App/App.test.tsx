import React from 'react';
import { HttpResponse} from 'msw'
import {render,  screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App';
import { fakeData } from '../../services/fakeData';

const unmockedFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn(() => {
    return Promise.resolve({
      json: () => Promise.resolve(fakeData),
    } as HttpResponse)
  });

})

afterEach(() => {
  global.fetch = unmockedFetch;
});

test('renders h1 title', () => {
	render(<App />);

  const headerText = screen.getByText(/Список персонажей сериала "Rick and Morty"/i);
  expect(headerText).toBeInTheDocument();
});

test('show characters from api', async () => {
  render(<App />);

  expect(await screen.findByText('Rick Sanchez Test')).toBeVisible()
})

import React, {  useEffect,  useState } from 'react';
import './App.scss';
import API_URL from '../../services/constants';
import { ApiResultsType } from '../../services/types';
import Card from '../../components/Card/Card';

import { throttle } from '../../services/helpers';

function App() {
  const [characters, setCharacters] = useState<ApiResultsType[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [totalCharacters, setTotalCharacters] = useState(0);


  useEffect(() => {
    async function fetchCharacters() {
      try {
        let response = await fetch(API_URL)
        const data = await response.json();
        setTotalCharacters(data.info.count);
        setCharacters(data.results);
        setNextPage(data.info.next);
        setIsDataLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    if (characters.length === 0) {
        fetchCharacters();
    };

    window.addEventListener('scroll', throttle(checkPosition, 1000));
    window.addEventListener('resize', throttle(checkPosition, 1000));

    return () => {
      window.removeEventListener('scroll', throttle(checkPosition, 1000));
      window.removeEventListener('resize', throttle(checkPosition, 1000));
    };
  },[characters.length]);

  function checkPosition(): void {
    const bodyHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    const screenHeight = document.documentElement.clientHeight;
    const quarterOfScreenHeight = screenHeight / 4;
    const userHaveScrolled = window.scrollY;
    const threshold = bodyHeight - quarterOfScreenHeight;
    const bottomPosition = userHaveScrolled + screenHeight;

    if (bottomPosition >= threshold) {
      if (nextPage !== null && !isDataLoading) {
        getNextPageCharacters();
        setIsDataLoading(true);
      };
    }
  };

  async function  getNextPageCharacters() {
    if (nextPage === null || isDataLoading) {
      return;
    }
    try {
      const response = await fetch(nextPage)
      const data = await response.json();
      if (data.results) {
        const newCharacters = characters;
        newCharacters.push(...data.results);
        setCharacters(newCharacters);
        setNextPage(data.info.next);
        setIsDataLoading(false);
      }

    } catch (e) {
      console.error(e);
    }
}

  const renderCharactersCount = () => {
    if (totalCharacters > 0) {
      return (
        <p>Всего персонажей: {totalCharacters}</p>
      );
    }
  };

  const deleteCharacter = (id: number) => () => {
    if (characters.length === 0) {
      return;
    }
    const newCharacters = characters.filter((character) => character.id !== id);
    setCharacters([ ...characters, ...newCharacters ]);
  }

  const editCharacterName = (id: number, newName: string) => () => {
    if (characters.length === 0) {
      return;
    }
    const newCharacters = characters.map((character) => {
      if (character.id === id) {
        return { ...character, name: newName };
      }
      return character;
    });
    setCharacters([ ...characters, ...newCharacters ]);
  }

  const renderCharactersList = () => {
    if (characters.length > 0) {
      return (
        <ul>
          {characters.map((character) => (
            <Card key={character.id} character={character} onDelete={deleteCharacter} onEditName={editCharacterName}/>
          ))}
        </ul>
      );
    }
  }

  return (
    <div className="wrapper">
      <header className="header">
        <h1 className='header__title'>Список персонажей сериала "Rick and Morty"</h1>
      </header>
      <main>
        {renderCharactersCount()}
        {renderCharactersList()}
        {isDataLoading && <p>Загрузка...</p>}

      </main>
      <footer></footer>
    </div>
  );
}

export default App;

import React, {  useEffect,  useState } from 'react';
import './App.scss';
import API_URL from '../../services/constants';
import { ApiResultsType } from '../../services/types';
import Card from '../../components/Card/Card';
import { throttle } from '../../services/helpers';

function App() {
  const [characters, setCharacters] = useState<ApiResultsType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fetching, setFetching] = useState(true);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const DELAY = 200;

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const response = await fetch(`${API_URL}${currentPage}`)
        const data = await response.json();
        setTotalCharacters(data.info.count);
        setCharacters([...characters, ...data.results]);
        setTotalPages(data.info.pages);
        setCurrentPage(prevState => prevState + 1);

      } catch (e) {
        console.error(e);
        setFetching(false);
      }
    }

    if (fetching && (currentPage === 1 || currentPage <= totalPages)) {
     fetchCharacters();
    }


  }, [characters, currentPage, fetching, totalPages]);

  useEffect(() => {
    window.addEventListener('scroll', throttle(checkPosition, DELAY));

    return function cleanup() {
      window.removeEventListener('scroll', throttle(checkPosition, DELAY));
    }
  }, []);

  const checkPosition = (): void =>  {
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
      setFetching(true);
    }
  };


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
    setCharacters(newCharacters);
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
    setCharacters(newCharacters);
  }

  const renderCharactersList = () => {
    if (characters.length > 0) {
      return (
        <ul className='cards-list'>
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
        {fetching && <div className='loader-container'><span className="loader"></span></div>}

      </main>
      <footer></footer>
    </div>
  );
}

export default App;

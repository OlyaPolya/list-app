import { useState } from 'react';
import { ApiResultsType, CardType } from '../../services/types';

function Card({ character, onDelete, onEditName }: CardType)  {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [newName, setNewName] = useState(character.name);

  const cancelEdit = () => {
    setIsEditFormOpen(false);
    setNewName(character.name);
  };

  return (
    <li key={character.id} className='card'>
      <img src={character.image} alt={`${character.name}`} className='card__image'></img>
      <div className='card__info'>
        <h3 className='card__title'>{character.name}</h3>
        <p className='card__text'>gender: <span className='card__text--bold'>{character.gender}</span></p>
        <p className='card__text'>species: <span className='card__text--bold'>{character.species}</span></p>
      </div>
      <div className='card__action'>
        <button onClick={onDelete(character.id)} className='card__button'>Delete</button>
        {!isEditFormOpen && <button onClick={() => setIsEditFormOpen(true)} className='card__button'>Edit Name</button>}
        {isEditFormOpen && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setIsEditFormOpen(false);
            }}
          >
            <input
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
            />
            <button type="submit" onClick={onEditName(character.id, newName)} className='card__button'>Сохранить</button>
            <button type="reset" onClick={cancelEdit} className='card__button'>Отмена</button>
          </form>
        )}
      </div>
    </li>
  );
}

export default Card;

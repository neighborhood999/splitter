import React from 'react';
import Alice from '../images/Alice.png';
import Bob from '../images/Bob.png';
import Carol from '../images/Carol.png';

const avatars = [Alice, Bob, Carol];

const Character = ({ character, index, withdraw }) => (
  <div key={character.address} className="column col-4">
    <div className="card mt-2">
      <div className="card-header">
        <div className="card-title">
          <figure
            className="avatar avatar-xl"
            style={{ backgroundColor: '#9bafbc' }}
          >
            <img src={avatars[index]} alt={character.name} />
          </figure>
        </div>
        <div className="card-subtitle text-gray">{character.name}</div>
      </div>
      <div className="card-body">
        <span>
          Balance:{' '}
          <strong>
            <var>{character.balance}</var> <sup>Eth</sup>
          </strong>
        </span>
      </div>
      <div className="card-footer">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => withdraw(character.address)}
        >
          withdraw
        </button>
      </div>
    </div>
  </div>
);

export default Character;

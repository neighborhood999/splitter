import React from 'react';
import Alice from '../images/Alice.png';
import Bob from '../images/Bob.png';
import Carol from '../images/Carol.png';

const avatars = [Alice, Bob, Carol];

const CharacterList = ({ isLoading, characters, withdraw }) => (
  <div className="columns text-center">
    {isLoading === true ? (
      <div className="column">
        <div className="loading loading-lg" style={{ minHeight: '20rem' }} />
      </div>
    ) : (
      characters.map((c, index) => (
        <div key={c.address} className="column col-4">
          <div className="card mt-2">
            <div className="card-header">
              <div className="card-title">
                <figure
                  className="avatar avatar-xl"
                  style={{ backgroundColor: '#9bafbc' }}
                >
                  <img src={avatars[index]} alt={c.name} />
                </figure>
              </div>
              <div className="card-subtitle text-gray">{c.name}</div>
            </div>
            <div className="card-body">
              <span>
                Balance:{' '}
                <strong>
                  <var>{c.balance}</var> <sup>Eth</sup>
                </strong>
              </span>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => withdraw(c.address)}
              >
                withdraw
              </button>
            </div>
          </div>
        </div>
      ))
    )};
  </div>
);

export default CharacterList;

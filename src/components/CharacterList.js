import React, { lazy } from 'react';

const Spinner = () => (
  <div className="column">
    <div className="loading loading-lg" style={{ minHeight: '20rem' }} />
  </div>
);
const Character = lazy(() => import('./Character'));

const CharacterList = ({ characters, withdraw }) => (
  <React.Suspense fallback={<Spinner />} maxDuration={200}>
    <div className="columns text-center">
      {characters.map((c, index) => (
        <Character
          key={c.address}
          index={index}
          character={c}
          withdraw={withdraw}
        />
      ))}
    </div>
  </React.Suspense>
);

export default CharacterList;

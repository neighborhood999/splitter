import React from 'react';

const contract = {
  isLoading: true,
  contractBalance: 0
};

const context = React.createContext(contract);

const { Consumer } = context;

export const withSplit = Component => props => (
  <Consumer>
    {value => <Component {...props} splitter={value} />}
  </Consumer>
);


export default context;

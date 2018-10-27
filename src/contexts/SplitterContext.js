import React from 'react';

const contract = {
  isLoading: true,
  contractBalance: 0
};

const SplitterContext = React.createContext(contract);

export default SplitterContext;

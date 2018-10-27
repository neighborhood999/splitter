import React from 'react';
import { withSplit } from '../contexts/SplitterContext';

const ContractBalanceHeader = ({ splitter }) => (
  <div className="card-header">
    <div className="card-title">
      <h3>Split Value</h3>
      <span>
        Contract Balance:{' '}
        {!splitter.state.isLoading && (
          <strong>
            <var>{splitter.state.contractBalance}</var> <sup>Eth</sup>
          </strong>
        )}
      </span>
    </div>
  </div>
);

export default withSplit(ContractBalanceHeader);

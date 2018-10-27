import React from 'react';
import { withSplit } from '../contexts/SplitterContext';

const SplitCardBody = ({ splitter }) => (
  <div className="card-body">
    <div className="input-group">
      <input
        className="form-input"
        type="number"
        placeholder="amount"
        onChange={splitter.setAmount}
        ref={splitter.amountInput}
      />
      <select className="form-select" onChange={splitter.setUnit}>
        <option value="wei">Wei</option>
        <option value="ether">Ether</option>
      </select>
      <button className="btn" onClick={splitter.split}>
        Split
      </button>
    </div>
  </div>
);

export default withSplit(SplitCardBody);

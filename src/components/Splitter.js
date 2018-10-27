import React, { Component } from 'react';
import SplitterContext from '../contexts/SplitterContext';

class Splitter extends Component {
  static contextType = SplitterContext;

  render() {
    const { isLoading, contractBalance } = this.context;
    const { setUnit, setAmount, split, amountInput } = this.props;

    return (
      <div className="columns text-center" style={{ marginTop: '2rem' }}>
        <div className="column col-4 col-mx-auto">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <h3>Split Value</h3>
                <span>
                  Contract Balance:{' '}
                  {!isLoading && (
                    <strong>
                      <var>{contractBalance}</var> <sup>Eth</sup>
                    </strong>
                  )}
                </span>
              </div>
            </div>
            <div className="card-body">
              <div className="input-group">
                <input
                  className="form-input"
                  type="number"
                  placeholder="amount"
                  onChange={setAmount}
                  ref={amountInput}
                />
                <select className="form-select" onChange={setUnit}>
                  <option value="wei">Wei</option>
                  <option value="ether">Ether</option>
                </select>
                <button className="btn" onClick={split}>
                  Split
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Splitter;

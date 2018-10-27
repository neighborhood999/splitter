import React from 'react';
import SplitCardHead from './SplitCardHead';
import SplitCardBody from './SplitCardBody';
import { withSplit } from '../contexts/SplitterContext';

const SendBalance = () => (
  <div className="columns text-center" style={{ marginTop: '2rem' }}>
    <div className="column col-4 col-mx-auto">
      <div className="card">
        <SplitCardHead />
        <SplitCardBody />
      </div>
    </div>
  </div>
);

export default withSplit(SendBalance);

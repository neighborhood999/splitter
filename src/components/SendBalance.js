import React from 'react';
import SplitCardHead from './SplitCardHead';
import SplitCardBody from './SplitCardBody';
import { withSplit } from '../contexts/SplitterContext';

const Spinner = () => (
  <div className="column">
    <div className="loading loading-lg" style={{ minHeight: '20rem' }} />
  </div>
);

const SendBalance = () => (
  <React.Suspense fallback={<Spinner />}>
  <div className="columns text-center" style={{ marginTop: '2rem' }}>
    <div className="column col-4 col-mx-auto">
      <div className="card">
        <SplitCardHead />
        <SplitCardBody />
      </div>
    </div>
  </div>
  </React.Suspense>
);

export default withSplit(SendBalance);

import Loader from '@components/loader/loader';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

const App = React.lazy(() => import("@scripts/app"));

ReactDOM.render(
    <Suspense fallback={<Loader />}><App /></Suspense>,
    document.getElementById('root')
);
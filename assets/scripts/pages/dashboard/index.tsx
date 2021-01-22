import Layout from '@components/layout';
import React from 'react';

export default class Dashboard extends React.Component {
    render = (): JSX.Element => {
        return (
            <Layout title="Dashboard">
                <div className="container card card-body mt-5 round">
                    <p>Bienvenido</p>
                </div>
            </Layout>
        );
    };
}

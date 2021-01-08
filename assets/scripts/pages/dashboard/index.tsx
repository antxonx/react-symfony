import Layout from '@scripts/components/layout';
import React from 'react';

export default class Dashboard extends React.Component {
    render(): JSX.Element {
        return (
            <Layout title="dashboard">
                <div>
                    <p>Welcome to the dashboard!</p>
                </div>
            </Layout>
        );
    }
}

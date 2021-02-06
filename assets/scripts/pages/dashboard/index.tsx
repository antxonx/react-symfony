import Layout from '@components/layout';
import Card from 'antd/es/card';
import 'antd/es/card/style/css';
import React from 'react';

export default class Dashboard extends React.Component {
    render = (): JSX.Element => {
        return (
            <Layout title="Dashboard">
                <div className="container mt-5">
                    <Card className="round">
                        <p>Bienvenido</p>
                    </Card>
                </div>
            </Layout>
        );
    };
}

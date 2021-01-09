import React from 'react';
import axios from '@services/axios';
import { UserI } from '@scripts/services/authentication';
import { Router } from '@scripts/router';
import Layout from '@scripts/components/layout';
import Loader from '@scripts/components/loader';

interface MeStateI {
    user: UserI | null;
}

export default class Me extends React.Component<{}, MeStateI>{

    public constructor (props: {}) {
        super(props);
        this.state = {
            user: null
        };
    }

    componentDidMount = () => {
        axios.get((new Router(process.env.BASE_ROUTE)).apiGet("user_profile"))
            .then(res => {
                this.setState({ user: res.data });
            })
            .catch(err => {
                console.error(err);
                console.error(err.response.data.message);
            });
    };

    render(): JSX.Element {
        return (
            <Layout title="perfil">
                {this.state.user ? (
                    <>
                    <p>Welcome {this.state.user.username}</p>
                    </>
                ) : (
                        <Loader/>
                    )}
            </Layout>
        );
    }
}
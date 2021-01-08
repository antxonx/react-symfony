import React from 'react';
import axios from '@services/axios';
import { UserI } from '@scripts/services/authentication';

interface MeStateI {
    user: UserI|null
}

export default class Me extends React.Component <{}, MeStateI>{

    public constructor (props: {}) {
        super(props);
        this.state = {
            user: null
        }
    }

    componentDidMount = () => {
        axios.get("/api/user/me")
        .then(res => {
            this.setState({ user: res.data })
        })
        .catch(err => {
            console.error(err);
            console.error(err.response.data.message);
        });
    }

    render(): JSX.Element {
        return (
            <div>
                {this.state.user ? (
                    <p>Welcome {this.state.user.username}</p>
                ) : (
                    <p>...</p>
                )}
            </div>
        );
    }
}
import React from 'react';
import Axios from 'axios';

export default class Me extends React.Component <{

}, {
    user: {
        username: string; 
        roles: string[];
    }|null
}>{

    public constructor (props: {}) {
        super(props);
        this.state = {
            user: null
        }
    }

    getUserInfo() {
        Axios.get("/api/user/me")
        .then(res => {
            this.setState({ user: res.data })
        })
        .catch(err => {
            console.error(err);
            console.error(err.response.data.message);
        });
    }

    render(): JSX.Element {
        this.getUserInfo();
        return (
            <div>
                {this.state.user ? (
                    <p>Welcome {this.state.user.username}</p>
                ) : (
                    <p>Not auth</p>
                )}
            </div>
        );
    }
}
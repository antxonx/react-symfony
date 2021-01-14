import { Router } from '@scripts/router';
import Authentication from '@scripts/services/authentication';
import React from 'react';

export default class Logout extends React.Component {

    componentDidMount = () => {
        Authentication.logOut();
        window.location.href = "/";
    }

    render = (): JSX.Element => {
        return <></>
    }
}
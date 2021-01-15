import Authentication from '@services/authentication';
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
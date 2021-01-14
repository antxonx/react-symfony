import React from "react";
import { NavLink } from 'react-router-dom';
import { Router } from '@scripts/router';

export default class Nav extends React.Component<{ router: Router; }, {}> {

    constructor (props: { router: Router; }) {
        super(props);
    }

    render(): JSX.Element {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink
                    exact
                    className="navbar-brand"
                    to={this.props.router.get("home")}
                >
                    Sistema
                        </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                    <ul></ul>
                    <ul className="navbar-nav">
                        <li className="nav-item" key="dashboard">
                            <NavLink
                                exact
                                className="nav-link"
                                to={this.props.router.get("home")}
                            >Dashboard</NavLink>
                        </li>
                        <li className="nav-item" key="profile">
                            <NavLink
                                exact
                                className="nav-link"
                                to={this.props.router.get("profile")}
                            >Perfil</NavLink>
                        </li>
                        <li className="nav-item" key="logout">
                            <NavLink
                                exact
                                className="nav-link"
                                to={(new Router(process.env.BASE_URL)).get("logout")}
                            >Salir</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
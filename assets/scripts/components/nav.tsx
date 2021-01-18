import React from "react";
import 'bootstrap';
import { NavLink } from 'react-router-dom';
import { Router } from '@scripts/router';


interface NavPropsI {
    router: Router;
    username: string;
    roles: string[];
}
export default class Nav extends React.Component<NavPropsI, {}> {

    constructor (props: NavPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <nav className="navbar navbar-expand-lg navbar-light">
                <NavLink
                    exact
                    className="navbar-brand"
                    to={this.props.router.get("dashboard")}
                >Sistema</NavLink>
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
                                to={this.props.router.get("dashboard")}
                                children="Dashboard"
                            />
                        </li>
                        {this.props.roles.includes("ROLE_ADMIN") ? (
                            <li className="nav-item" key="users">
                                <NavLink
                                    exact
                                    className="nav-link"
                                    to={this.props.router.get("users")}
                                    children="Usuarios"
                                />
                            </li>
                        ) : <></>}

                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="dropdowUserMenu" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.props.username}
                            </a>
                            <div className="dropdown-menu" aria-labelledby="dropdowUserMenu">
                                <NavLink
                                    exact
                                    className="dropdown-item"
                                    to={this.props.router.get("profile")}
                                    children="Perfil"
                                />
                                <NavLink
                                    exact
                                    className="dropdown-item"
                                    to={(new Router(process.env.BASE_URL)).get("logout")}
                                    children="Salir"
                                />
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    };
}
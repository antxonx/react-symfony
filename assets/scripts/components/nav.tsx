import React from "react";
import 'bootstrap';
import { NavLink } from 'react-router-dom';
import { Router } from '@scripts/router';
import Authentication from "@services/authentication";


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
                        {
                            Authentication.isImpersonating() && (
                                <li className="nav-item" key="unimpersonate">
                                    <a
                                        className="nav-link"
                                        children="Desimpersonar"
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            Authentication.unsetIpersonation();
                                            window.location.href = this.props.router.get("dashboard");
                                        }}
                                    />
                                </li>
                            )
                        }
                        <li className="nav-item" key="dashboard">
                            <NavLink
                                exact
                                className="nav-link"
                                to={this.props.router.get("dashboard")}
                                children="Inicio"
                            />
                        </li>
                        {
                            this.props.roles.includes("ROLE_ADMIN") && (
                                <li className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdown-toggle"
                                        href="#"
                                        id="dropdowSystemMenu"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                    >
                                        Sistema
                                </a>
                                    <div className="dropdown-menu" aria-labelledby="dropdowSystemMenu">
                                        <NavLink
                                            exact
                                            className="dropdown-item"
                                            to={this.props.router.get("users")}
                                            children="Usuarios"
                                        />
                                        {
                                            this.props.roles.includes("ROLE_DEV") && (
                                                <>
                                                    <div className="dropdown-divider"></div>
                                                    <NavLink
                                                        exact
                                                        className="dropdown-item"
                                                        to={this.props.router.get("logger")}
                                                        children="Registro"
                                                    />
                                                </>
                                            )
                                        }
                                    </div>
                                </li>
                            )
                        }
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                id="dropdowUserMenu"
                                role="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
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
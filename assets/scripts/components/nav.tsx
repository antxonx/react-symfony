import React from "react";
import { NavLink } from 'react-router-dom';
import { Router } from '@scripts/router';
import Authentication from "@services/authentication";
import { useMediaQuery } from 'react-responsive';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
interface NavPropsI {
    router: Router;
}

export default function Nav(props: React.PropsWithChildren<NavPropsI>) {
    const roles = Authentication.getRoles();
    const isMobile = useMediaQuery({ query: `(max-width: 900px)` });
    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{
            height: "54px",
        }}>
            <NavLink
                exact
                className="navbar-brand"
                to={props.router.get("dashboard")}
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
            
            <div 
            className={"collapse navbar-collapse justify-content-between" + (isMobile?" navbar-overall": "")}
            id="navbarNav"
            >
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
                                        window.location.href = props.router.get("dashboard");
                                    }}
                                />
                            </li>
                        )
                    }
                    <li className="nav-item" key="dashboard">
                        <NavLink
                            exact
                            className="nav-link"
                            to={props.router.get("dashboard")}
                            children="Inicio"
                        />
                    </li>
                    {
                        roles.includes("ROLE_ADMIN") && (
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
                                        to={props.router.get("users")}
                                        children="Usuarios"
                                    />
                                    {
                                        roles.includes("ROLE_DEV") && (
                                            <>
                                                <div className="dropdown-divider"></div>
                                                <NavLink
                                                    exact
                                                    className="dropdown-item"
                                                    to={props.router.get("logger")}
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
                            {Authentication.getUsername()}
                        </a>
                        <div className="dropdown-menu" aria-labelledby="dropdowUserMenu">
                            <NavLink
                                exact
                                className="dropdown-item"
                                to={props.router.get("profile")}
                                children="Perfil"
                            />
                            <NavLink
                                exact
                                className="dropdown-item"
                                to={props.router.get("logout")}
                                children="Salir"
                            />
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
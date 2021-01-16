import '@fortawesome/fontawesome-free/js/all.min.js';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Router } from '@scripts/router';
import '@styles/app.scss';

const Profile = React.lazy(() => import('@pages/profile'));
const Error404 = React.lazy(() => import('@pages/error404'));
const Logout = React.lazy(() => import('@pages/logout'));
const Dashboard = React.lazy(() => import('@pages/dashboard'));
const Login = React.lazy(() => import('@pages/login'));

import Authentication, { TokenPayloadI } from '@services/authentication';

import Loader from '@components/loader/loader';
const Nav = React.lazy(() => import('@components/nav'));

interface AppStateI {
    loggedIn: boolean | null;
    payload: TokenPayloadI | null;
}

class App extends React.Component<{}, AppStateI>{

    protected router: Router;

    constructor (props: {}) {
        super(props);
        this.state = {
            loggedIn: null,
            payload: null,
        };
        this.router = new Router(process.env.BASE_ROUTE);
    }

    checkLogin = async () => {
        let loggedIn = await Authentication.isLoggedIn();
        this.setState({
            loggedIn: loggedIn,
            payload: Authentication.getPayload(),
        });
        if (this.state.payload && this.state.loggedIn) {
            let diff = (this.state.payload.exp - Math.floor(Date.now() / 1000) - 300);
            diff = (diff < 0) ? 0 : diff;
            console.log(this.state.payload.exp);
            console.log(diff);
            setTimeout(() => {
                Authentication.refreshToken();
                this.setState({
                    payload: Authentication.getPayload(),
                });
            }, diff * 1000);
        }
    };

    componentDidMount = () => {
        this.checkLogin();
    };

    handleLoggedInChange = (logged: boolean) => {
        this.setState({
            loggedIn: logged
        });
    };

    render = (): JSX.Element => {
        return (
            <>
                <BrowserRouter>
                    {this.state.loggedIn == null ? (
                        <Loader />
                    ) : (this.state.loggedIn ? (
                        <Suspense fallback={<Loader />}>
                            <Nav
                                router={this.router}
                                username={this.state.payload!.username}
                                roles={this.state.payload!.roles}
                            ></Nav>
                            <Switch>
                                <Route
                                    exact
                                    path={this.router.get("profile")}
                                    component={Profile}
                                />
                                <Route
                                    exact
                                    path={this.router.get("dashboard")}
                                    component={Dashboard}
                                />
                                <Route
                                    exact
                                    path={this.router.get("logout")}
                                    component={Logout}
                                />
                                <Route component={Error404} />

                            </Switch>
                        </Suspense>
                    ) : (
                            <Suspense fallback={<Loader />}>
                                <Redirect to={this.router.get("login")} />
                                <Switch>
                                    <Route exact path={this.router.get("dashboard")}>
                                        <Redirect to={this.router.get("login")} />
                                    </Route>
                                    <Route>
                                        <Login
                                            logged={this.state.loggedIn}
                                            onloggedinchange={this.handleLoggedInChange}
                                        />
                                    </Route>
                                </Switch>
                            </Suspense>
                        ))}
                </BrowserRouter>
            </>
        );
    };
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, NavLink, Redirect, Route, Switch } from 'react-router-dom';
import '@styles/app.scss';
import Router from '@scripts/router';

import Dashboard from '@pages/dashboard';
import Me from '@pages/me';
import Login from '@pages/login';

import Authentication from '@services/authentication';
import Head from './components/head';
import Nav from './components/nav';

class App extends React.Component<{}, { loggedIn: boolean | null; }>{

    protected router: Router;

    constructor (props: {}) {
        super(props);
        this.state = {
            loggedIn: null
        };
        this.router = new Router(process.env.BASE_ROUTE);
    }

    async checkLogin() {
        let loggedIn = await Authentication.isLoggedIn();
        this.setState({
            loggedIn: loggedIn
        });
    }

    componentDidMount() {
        this.checkLogin();
    }

    handleLoggedInChange = (logged: boolean) => {
        this.setState({
            loggedIn: logged
        });
    }

    render(): JSX.Element {
        return (
            <>
                <Head>
                    <meta property="og:title" content="Sistema" />
                    <title>Sistema</title>
                </Head>
                <BrowserRouter>
                    <div>
                        {this.state.loggedIn == null ? (
                            <div>
                                ....
                            </div>
                        ) : (this.state.loggedIn ? (
                            <>
                                <Nav router={this.router}></Nav>
                                <Switch>
                                    <Route exact path={this.router.get("me")} component={Me} />
                                    <Route exact path={this.router.get("home")} component={Dashboard} />
                                    <Route exact path={this.router.get("login")}>
                                            <Login logged={this.state.loggedIn} onloggedinchange={this.handleLoggedInChange} />
                                        </Route>
                                </Switch>
                            </>
                        ) : (
                                <>
                                    <Redirect to={this.router.get("login")} />
                                    <Switch>
                                        <Route exact path={this.router.get("login")}>
                                            <Login logged={this.state.loggedIn} onloggedinchange={this.handleLoggedInChange} />
                                        </Route>
                                    </Switch>
                                </>
                            ))}

                    </div>
                </BrowserRouter>
            </>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
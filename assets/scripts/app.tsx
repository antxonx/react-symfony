import '@fortawesome/fontawesome-free/js/all.min.js';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Router } from '@scripts/router';
import parse from 'html-react-parser';
import '@styles/app.scss';

const Profile = React.lazy(() => import('@pages/profile'));
const Error404 = React.lazy(() => import('@pages/error404'));
const Logout = React.lazy(() => import('@pages/logout'));
const Dashboard = React.lazy(() => import('@pages/dashboard'));
const Login = React.lazy(() => import('@pages/login'));
const Users = React.lazy(() => import('@pages/users'));
const Logger = React.lazy(() => import('@pages/logger'));

import Authentication from '@services/authentication';

import Loader from '@components/loader/loader';
import Toast, { ToastData } from '@components/alerts/toast';
import ToastContainer from '@components/alerts/toastContainer';
import ErrorBoundary from '@components/error';
import NavigationContainer from '@components/navigation';
import Nav from '@components/nav';

interface AppStateI {
    loggedIn: boolean | null;
    toasts: ToastData[];
}

export interface ToastEventsI {
    add: (toast: ToastData) => void;
}

class App extends React.Component<{}, AppStateI>{

    protected router: Router;

    constructor (props: {}) {
        super(props);
        this.state = {
            loggedIn: null,
            toasts: [],
        };
        this.router = new Router(process.env.BASE_ROUTE);
    }

    refreshToken = () => {
        const payload = Authentication.getPayload();
        let time = (payload!.exp - Math.floor(Date.now() / 1000)) - 300;
        time = (time < 0) ? 0 : time;
        setTimeout(async () => {
            await Authentication.refreshToken();
            this.refreshToken();
        }, time * 1000);
    };

    componentDidMount = () => {
        let loggedIn = Authentication.isLoggedIn();
        this.setState({
            loggedIn: loggedIn,
        });
        if (loggedIn) {
            this.refreshToken();
        }
    };

    handleLoggedInChange = (logged: boolean) => {
        this.setState({
            loggedIn: logged
        });
    };

    addToast = (toast: ToastData) => {
        let toastList = this.state.toasts;
        toastList.push(toast);
        this.setState({
            toasts: toastList,
        });
        setTimeout(() => {
            this.removeToast(toast.id);
        }, 2000);
    };

    removeToast = (id: string) => {
        let toastList = this.state.toasts;
        const index = toastList.findIndex((toast) => {
            return toast.id === id;
        });
        toastList[ index ].show = false;
        this.setState({
            toasts: toastList,
        });
        setTimeout(() => {
            toastList.splice(index, 1);
            this.setState({
                toasts: toastList,
            });
        }, 200);
    };

    render = (): JSX.Element => {
        const roles = Authentication.getRoles();
        return (
            <ErrorBoundary>
                <BrowserRouter>
                    {
                        this.state.loggedIn == null
                            ? <Loader />
                            : (
                                this.state.loggedIn
                                    ? (
                                        <>
                                            <Nav
                                                router={this.router}
                                            ></Nav>
                                            <Suspense fallback={<Loader />}>
                                                <NavigationContainer toast={{ add: this.addToast }}>
                                                    <Route
                                                        exact
                                                        path={this.router.get("dashboard")}
                                                        component={Dashboard}
                                                    />
                                                    {roles.includes("ROLE_ADMIN") && (
                                                        <Route
                                                            exact
                                                            path={this.router.get("users")}

                                                        >
                                                            <Users
                                                                toasts={{
                                                                    add: this.addToast
                                                                }}
                                                            />
                                                        </Route>
                                                    )}
                                                    {roles.includes("ROLE_DEV") && (
                                                        <Route
                                                            exact
                                                            path="/logger"
                                                        >
                                                            <Logger toasts={{
                                                                add: this.addToast,
                                                            }} />
                                                        </Route>
                                                    )}
                                                    <Route
                                                        exact
                                                        path={this.router.get("profile")}
                                                    >
                                                        <Profile
                                                            toasts={{
                                                                add: this.addToast,
                                                            }}
                                                        />
                                                    </Route>
                                                    <Route
                                                        exact
                                                        path={this.router.get("logout")}
                                                        component={Logout}
                                                    />
                                                    <Route component={Error404} />
                                                </NavigationContainer>
                                            </Suspense>
                                        </>
                                    )
                                    : (
                                        <>
                                            <Redirect to={this.router.get("login")} />
                                            <Suspense fallback={<Loader />}>
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
                                        </>
                                    )
                            )
                    }
                </BrowserRouter>
                <ToastContainer>
                    {
                        this.state.toasts.map((toast) => {
                            toast.show = (toast.show === undefined) ? true : toast.show;
                            return (
                                <Toast key={toast.id} type={toast.type} title={toast.title} show={toast.show}>
                                    {parse(toast.message)}
                                </Toast>
                            );
                        })
                    }
                </ToastContainer>
            </ErrorBoundary>
        );
    };
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
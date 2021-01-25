import { ToastEventsI } from '@scripts/app';
import React from 'react';
import { Switch, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

export default function NavigationContainer(props: React.PropsWithChildren<{ toast: ToastEventsI; }>): JSX.Element {
    let location = useLocation();
    return (

        <SwitchTransition mode="out-in">
            <CSSTransition
                key={location.key}
                classNames="fade"
                timeout={300}
                addEndListener={(node, done) => {
                    node.addEventListener("transitionend", done, false);
                }}
            >
                <Switch location={location}>
                    {props.children}
                </Switch>
            </CSSTransition>
        </SwitchTransition>
    );
}
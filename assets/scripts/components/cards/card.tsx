import React from 'react';

interface CardPropsI {
    round?: boolean;
}

export default function Card(props: React.PropsWithChildren<CardPropsI>): JSX.Element {
    return (
        <div className={"card" + (props.round ? " round" : "")}>
            <div className="card-body">
                {props.children}
            </div>
        </div>
    );
}
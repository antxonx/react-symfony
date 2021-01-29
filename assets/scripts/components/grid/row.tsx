import React from 'react';

interface RowPropsI {
    extraClass?: string;
    style?: React.CSSProperties;
}

export default function _Row(props: React.PropsWithChildren<RowPropsI>): JSX.Element {
    return (
        <div
            className={"row" + (props.extraClass ? " " + props.extraClass : "")}
            style={props.style}
        >
            {props.children}
        </div>
    );
}
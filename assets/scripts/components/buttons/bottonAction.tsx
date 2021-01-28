import React from 'react';

interface ButtonActionPropsI {
    type: "tel" | "mailto";
    content: string;
}

export default function ButtonAction(props: React.PropsWithChildren<ButtonActionPropsI>): JSX.Element {
    return (
        <a
            className="button-action ww-100 text-center"
            href={`${props.type}:${props.content || props.children}`}
        >
            {props.content || props.children}
        </a>
    );
}
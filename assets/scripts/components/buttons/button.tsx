import React from 'react';

export enum buttonSizes {
    SMALL,
    MEDIUM,
    LARGE
};

interface ButtonPropsI {
    name?: string;
    size?: buttonSizes;
    color?: 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'secondary' | 'light' | 'dark' | 'link' | 'antxony';
    content?: string;
    extraClass?: string;
    onClick?: () => void;
}

export default function Button(props: React.PropsWithChildren<ButtonPropsI>): JSX.Element {
    return (
        <button
            type="button"
            name={props.name}
            onClick={() => {
                props.onClick && props.onClick();
            }}
            className={"btn round"
                + (props.color ? ` btn-${props.color}`: "btn-light")
                + (props.extraClass ? " " + props.extraClass : "")
                + (() => {
                    switch (props.size) {
                        case buttonSizes.LARGE: return " btn-large";
                        case buttonSizes.SMALL: return " btn-sm";
                        default: return "";
                    }
                })()
            }
        >
            {props.content || props.children}
        </button>
    );
}
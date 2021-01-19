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

interface ButtonStateI {
    size: string;
    color: string;
}

export default class Button extends React.Component<ButtonPropsI, ButtonStateI> {
    constructor (props: ButtonPropsI) {
        super(props);
        let buttonClass: string;
        switch (this.props.size) {
            case buttonSizes.LARGE:
                buttonClass = " btn-lg";
                break;
            case buttonSizes.SMALL:
                buttonClass = " btn-sm";
                break;
            default:
                buttonClass = "";
        }
        this.state = {
            size: buttonClass,
            color: (this.props.color || "btn-light")
        };
    }

    handleClick = () => {
        this.props.onClick && this.props.onClick();
    };

    render = (): JSX.Element => {
        return (
            <button
                type="button"
                name={this.props.name}
                onClick={this.handleClick}
                className={"btn round" + this.state.size + " btn-" + this.state.color + (this.props.extraClass ? " " + this.props.extraClass : "")}
            >
                {this.props.content || this.props.children}
            </button>
        );
    };
}
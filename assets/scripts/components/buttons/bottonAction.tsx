import React from 'react';

interface ButtonActionPropsI {
    type: "tel" | "mailto";
    content: string;
}

export default class ButtonAction extends React.Component<ButtonActionPropsI, {}> {
    constructor (props: ButtonActionPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <a
                className="button-action ww-100 text-center"
                href={`${this.props.type}:${this.props.content || this.props.children}`}
            >
                {this.props.content || this.props.children}
            </a>
        );
    };
}
import React from 'react';

interface ButtonCloseI {
    onClick: () => void;
    float?: string;
}

export default class ButtonClose extends React.Component<ButtonCloseI, {}> {
    constructor (props: ButtonCloseI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <button
                className={"btn text-muted" + (this.props.float ? " float-" + this.props.float : "")}
                onClick={this.props.onClick}
            >
                <i className="fas fa-times"></i>
            </button>
        );
    };
}
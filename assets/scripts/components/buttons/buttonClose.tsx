import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface ButtonCloseI {
    onClick: () => void;
    float?: string;
    extraClass?: string;
}

export default class ButtonClose extends React.Component<ButtonCloseI, {}> {
    constructor (props: ButtonCloseI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <button
                className={
                    "btn text-muted" +
                    (this.props.float ? " float-" + this.props.float : "") +
                    (this.props.extraClass ? " " + this.props.extraClass : "")
                }
                onClick={this.props.onClick}
            >
                <FontAwesomeIcon icon={['fas', 'times']} />
            </button>
        );
    };
}
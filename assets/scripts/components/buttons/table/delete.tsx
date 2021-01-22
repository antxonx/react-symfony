import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface ButtonDeletePropsI<PT> {
    id: PT;
    extra?: JSX.Element;
    onClick: (id: PT, extra: JSX.Element) => void;
}

export default class ButtonDelete<T> extends React.Component<ButtonDeletePropsI<T>, {}> {
    constructor (props: ButtonDeletePropsI<T>) {
        super(props);
    }

    handleClick = () => {
        this.props.onClick(this.props.id, this.props.extra || <></>);
    };

    render = (): JSX.Element => {
        return (
            <button
                type="button"
                className="btn btn-sm btn-outline-dark border-0 w-100 round"
                onClick={this.handleClick}
            >
                <FontAwesomeIcon icon={['fas', 'trash-alt']} />
            </button>
        );
    };
}
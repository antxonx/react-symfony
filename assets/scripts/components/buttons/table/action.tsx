import React from 'react';

interface ActionPropsI<PT> {
    id: PT;
    color: 'success' | 'danger' | 'info' | 'primary' | 'secondary' | 'light' | 'dark';
    icon: JSX.Element;
    onClick: (id: PT) => void;
}

export default class Action<T> extends React.Component<ActionPropsI<T>, {}> {
    constructor (props: ActionPropsI<T>) {
        super(props);
    }

    handleClick = () => {
        this.props.onClick(this.props.id);
    };

    render = (): JSX.Element => {
        return (
            <button
                type="button"
                className={`btn btn-sm btn-outline-${this.props.color} border-0 w-100 round`}
                onClick={this.handleClick}
            >
                {this.props.icon}
            </button>
        );
    };
}
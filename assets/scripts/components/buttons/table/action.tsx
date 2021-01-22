import React from 'react';
import parser from 'html-react-parser';
interface ActionPropsI<PT> {
    id: PT;
    color: 'success' | 'danger' | 'info' | 'primary' | 'secondary' | 'light' | 'dark';
    content: JSX.Element;
    loading?: boolean;
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

        // const child = (
        //     this.props.loading
        //         ? (
        //             <span
        //                 className="spinner-border spinner-border-sm"
        //                 role="status"
        //                 aria-hidden="true"
        //             >
        //             </span>
        //         )
        //         : this.props.content
        // );

        return (
            <>
                <button
                    className={`btn btn-sm btn-outline-${this.props.color} border-0 w-100 round`}
                    disabled={this.props.loading}
                    onClick={this.handleClick}
                >
                    {
                        this.props.loading
                            ? (
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                >
                                </span>
                            )
                            : this.props.content

                    }
                </button>
            </>
        );
    };
}
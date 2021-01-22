import React from 'react';

interface RowPropsI {
    extraClass?: string;
    style?: React.CSSProperties;
}

export default class Row extends React.Component<RowPropsI, {}> {
    constructor (props: RowPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <div
                className={"row" + (this.props.extraClass ? " " + this.props.extraClass : "")}
                style={this.props.style}
            >
                {this.props.children}
            </div>
        );
    };
}
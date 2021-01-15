import React from 'react';

interface RowPropsI {
    extraClass?: string;
}

export default class Row extends React.Component<RowPropsI, {}> {
    constructor (props: RowPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <div className={"row" + (this.props.extraClass ? " " + this.props.extraClass : "")}>
                {this.props.children}
            </div>
        );
    };
}
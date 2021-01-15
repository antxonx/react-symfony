import React from 'react';

interface ColumnPropsI {
    size: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    extraClass?: string;
}

export default class Column extends React.Component<ColumnPropsI, {}> {
    constructor (props: ColumnPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <div className={"col-md-" + this.props.size + (this.props.extraClass ? " " + this.props.extraClass : "")}>
                {this.props.children}
            </div>
        );
    };
}
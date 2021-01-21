import React from 'react';

interface ColumnPropsI {
    size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    extraClass?: string;
}

export default class Column extends React.Component<ColumnPropsI, {}> {
    constructor (props: ColumnPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        let className = ((this.props.size) ? `col-md-${this.props.size}` : 'col');
        this.props.extraClass && (className += ` ${this.props.extraClass}`);
        return (
            <div className={className}>
                {this.props.children}
            </div>
        );
    };
}
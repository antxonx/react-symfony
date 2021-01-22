import React from 'react';

interface TablePropsI {
    extraClass?: string;
}
export default class Table extends React.Component<TablePropsI, {}> {

    render = (): JSX.Element => {
        return (
            <table className={
                "table table-sm table-striped2 w-100 table-hover2 table-bordered2 mobile"
                + (this.props.extraClass
                    ? " " + this.props.extraClass
                    : "")
            }>
                {this.props.children}
            </table>
        );
    };
}
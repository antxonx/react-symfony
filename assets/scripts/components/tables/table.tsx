import React from 'react';

export default class Table extends React.Component {
    render = (): JSX.Element => {
        return (
            <table className="table table-sm table-striped2 w-100 table-hover2 table-bordered2 mobile">
                {this.props.children}
            </table>
        );
    };
}
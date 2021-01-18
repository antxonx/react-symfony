import React from 'react';

interface TheadPropsI {
    cells: ThPropsI[];
}

export interface ThPropsI {
    name?: string;
    [ key: string ]: any;
}

export default class Thead extends React.Component<TheadPropsI, {}> {

    render = (): JSX.Element => {

        return (
            <thead>
                <tr>
                    {this.props.cells.map(cell => <th key={cell.name || cell.children} {...cell} />)}
                </tr>
            </thead>
        );
    };
}
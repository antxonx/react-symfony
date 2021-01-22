import React from 'react';
import { ThPropsI } from '@components/tables';

interface TheadPropsI {
    cells: ThPropsI[];
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
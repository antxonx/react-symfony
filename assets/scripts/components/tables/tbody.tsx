import React from 'react';
import { TbodyRows } from '@components/tables';

interface TbodyPropsI {
    className?: string;
    idStart?: string;
    rows: TbodyRows[];
}

export default class Tbody extends React.Component<TbodyPropsI, {}> {
    constructor (props: TbodyPropsI) {
        super(props);
    }
    render = (): JSX.Element => {
        return (
            <tbody className={this.props.className}>
                {this.props.rows.map(row => {
                    let rowCopy = { ...row };
                    rowCopy.cells = [];
                    return (
                        <tr
                            key={row.id}
                            {...rowCopy}
                            id={(this.props.idStart || "row-") + row.id}
                        >
                            {row.cells.map(cell => <td key={cell.name} {...cell} />)}
                        </tr>
                    );
                })}
            </tbody>
        );
    };
}
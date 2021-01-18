import React from 'react';
import { TbodyRows } from '@components/tables';

interface TbodyPropsI {
    rows: TbodyRows[];
}



export default class Tbody extends React.Component<TbodyPropsI, {}> {
    constructor (props: TbodyPropsI) {
        super(props);
    }
    render = (): JSX.Element => {
        return (
            <tbody>
                {this.props.rows.map(row => {
                    let rowCopy = { ...row };
                    rowCopy.cells = [];
                    return (
                        <tr key={row.id} {...rowCopy} id={"user-row-" + row.id}>
                            {row.cells.map(cell => <td key={cell.name} {...cell} />)}
                        </tr>
                    );
                })}
            </tbody>
        );
    };
}
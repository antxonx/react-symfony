import React from 'react';
import { TbodyRows } from '@components/tables';

interface TbodyPropsI {
    className?: string;
    idStart?: string;
    rows: TbodyRows[];
}

export default function Tbody(props: React.PropsWithChildren<TbodyPropsI>): JSX.Element {
    return (
        <tbody className={props.className}>
            {props.rows.map(row => {
                let rowCopy = { ...row };
                rowCopy.cells = [];
                return (
                    <tr
                        key={row.id}
                        {...rowCopy}
                        id={(props.idStart || "row-") + row.id}
                    >
                        {row.cells.map(cell => <td key={cell.name} {...cell} />)}
                    </tr>
                );
            })}
        </tbody>
    );
}
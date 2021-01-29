import React from 'react';
import { ThPropsI } from '@components/tables';
import ThSort from './thSort';

interface TheadPropsI {
    cells: ThPropsI[];
}

export default function Thead(props: React.PropsWithChildren<TheadPropsI>): JSX.Element {
    return (
        <thead>
            <tr>
                {
                    props.cells.map(cell => {
                        return (
                            cell.sort
                                ? (
                                    <ThSort
                                        key={cell.key || cell.children || cell.name}
                                        className={cell.className}
                                        name={cell.name}
                                        style={cell.style}
                                        children={cell.children || cell.name}
                                        onClick={cell.onClick}
                                        activeOrder={cell.activeOrder}
                                        order={cell.order}
                                        column={cell.column}
                                    />
                                )
                                : (
                                    <th
                                        key={cell.key || cell.children || cell.name}
                                        className={cell.className}
                                        style={cell.style}
                                        children={cell.children || cell.name}
                                    />
                                )
                        );
                    })
                }
            </tr>
        </thead>
    );
}
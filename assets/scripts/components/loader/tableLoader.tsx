import React from 'react';
import Loader from '@components/loader/loader';

interface TableLoaderPropsI {
    colSpan: number;
}

export default function TableLoader(props: React.PropsWithChildren<TableLoaderPropsI>): JSX.Element {
    return (
        <tbody>
            <tr>
                <td colSpan={props.colSpan}>
                    <Loader noAbs={true} />
                </td>
            </tr>
        </tbody>
    );
}
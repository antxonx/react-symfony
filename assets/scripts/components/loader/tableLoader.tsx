import React from 'react';
import Loader from '@components/loader/loader';

interface TableLoaderPropsI {
    colSpan: number;
}

export default class TableLoader extends React.Component<TableLoaderPropsI, {}> {

    constructor (props: TableLoaderPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <tbody>
                <tr>
                    <td colSpan={this.props.colSpan}>
                        <Loader noAbs={true}/>
                    </td>
                </tr>
            </tbody>
        );
    };
}
import React from 'react';
import Head from '@components/head';

interface LayoutPropsI {
    title?: string;
}

export default class Layout extends React.Component<LayoutPropsI, {}> {
    constructor (props: LayoutPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <>
                {this.props.title ? (
                    <Head>
                        <meta property="og:title" content={this.props.title} />
                        <title>{this.props.title}</title>
                    </Head>
                ) : <></>}
                <main>
                    {this.props.children}
                </main>
            </>
        );
    };
}
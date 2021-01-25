import React from 'react';
import Head from '@components/head';

interface LayoutPropsI {
    title?: string;
    top?: boolean;
}

export default class Layout extends React.Component<LayoutPropsI, {}> {
    constructor (props: LayoutPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <div>
                {
                    this.props.title && (
                        <Head>
                            <meta property="og:title" content={this.props.title} />
                            <title>{this.props.title}</title>
                        </Head>
                    )
                }
                {
                    (this.props.top === undefined || this.props.top) && (
                        <section className="page-title">
                            <h5><b>{this.props.title}</b></h5>
                        </section>
                    )
                }
                <main className="w-99 mx-auto" 
                // style={{
                //     position: "absolute",
                //     top: "54px",
                //     left: 0,
                // }}
                >
                    {this.props.children}
                </main>
            </div>
        );
    };
}
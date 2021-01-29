import React from 'react';
import Head from '@components/head';

interface LayoutPropsI {
    title?: string;
    top?: boolean;
}

export default function Layout(props: React.PropsWithChildren<LayoutPropsI>) {
    return (
        <div>
            {
                props.title && (
                    <Head>
                        <meta property="og:title" content={props.title} />
                        <title>{props.title}</title>
                    </Head>
                )
            }
            {
                (props.top === undefined || props.top) && (
                    <div className="page-title">
                        <h5><b>{props.title}</b></h5>
                    </div>
                )
            }
            <div className="w-99 mx-auto" >
                {props.children}
            </div>
        </div>
    );
}
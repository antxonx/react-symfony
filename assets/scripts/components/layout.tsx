import React from 'react';

export default class Layout extends React.Component<{}, {}> {
    constructor (props: {}) {
        super(props);
    }

    render(): JSX.Element {
        return (
            <main>
                {this.props.children}
            </main>
        );
    }
}
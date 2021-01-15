import React from 'react';

interface CardPropsI {
    round?: boolean;
}

export default class Card extends React.Component<CardPropsI, {}> {

    private round: boolean;

    constructor(props: CardPropsI) {
        super(props);
        if(this.props.round === undefined) {
            this.round = true;
        } else {
            this.round = this.props.round;
        }
    }

    render = (): JSX.Element => {
        return (
            <div className={"card" + (this.round?" round":"")}>
                <div className="card-body">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
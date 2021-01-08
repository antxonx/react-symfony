import React from 'react';

interface SubmitButtonPropsI {
    loading: boolean; 
    text: string;
}

export default class SubmitButton extends React.Component <SubmitButtonPropsI, {}>{
    constructor(props: SubmitButtonPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        return ( 
            <>
                {this.props.loading ? (
                    <button className="btn btn-primary" type="submit" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span className="sr-only">cargando...</span>
                    </button>
                ) : (
                    <button className="btn btn-primary" type="submit">
                        {this.props.text}
                    </button>
                )}
            </>
        )
    }
    
}
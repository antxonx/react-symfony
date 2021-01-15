import React from 'react';

interface TextInputPropsI {
    error: boolean;
    name: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    errorMsg?: string;
    type?: string;
    placeholder?: string;
}

export default class TextInput extends React.Component<TextInputPropsI, {}> {

    constructor (props: TextInputPropsI) {
        super(props);
    }

    render = (): JSX.Element => {
        return (
            <div className="form-group">
                <input
                    type={this.props.type ? this.props.type : 'text'}
                    className={this.props.error ? 'form-control is-invalid' : 'form-control'}
                    name={this.props.name}
                    onChange={this.props.onChange}
                    onKeyDown={this.props.onKeyDown}
                    placeholder={this.props.placeholder}
                />
                { this.props.error && this.props.errorMsg && (
                    <small><span className="text-danger">*{this.props.errorMsg}</span></small>
                )}
            </div>
        );
    };
}
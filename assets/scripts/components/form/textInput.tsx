import React from 'react';

interface TextInputPropsI {
    error: boolean;
    name: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    errorMsg?: string;
    type?: string;
    placeholder?: string;
    value?: string;
}

export default function TextInput(props: React.PropsWithChildren<TextInputPropsI>): JSX.Element {
    return (
        <div className="form-group">
            <input
                type={props.type ? props.type : 'text'}
                className={props.error ? 'form-control is-invalid' : 'form-control'}
                name={props.name}
                onChange={props.onChange}
                onKeyDown={props.onKeyDown}
                placeholder={props.placeholder}
                value={props.value}
            />
            {
                (props.error && props.errorMsg) && (
                    <small>
                        <span className="text-danger">
                            *{props.errorMsg}
                        </span>
                    </small>
                )
            }
        </div>
    );
}
import { Input } from 'antd';
import { string } from 'prop-types';
import React from 'react';

interface SearchPropsI {
    callback: (data: string) => void;
}

interface SearchStateI {
    value: string;
}

export default class Search extends React.Component<SearchPropsI, SearchStateI> {

    private timer: NodeJS.Timeout | undefined;

    constructor (props: SearchPropsI) {
        super(props);
        this.state = {
            value: "",
        };
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.timer && clearTimeout(this.timer);
        this.setState({
            value: e.target.value,
        });
        this.timer = setTimeout(() => {
            this.timer = undefined;
            this.props.callback(this.state.value);
        }, 750);
    };

    handleEraseClick = () => {
        let call = (this.state.value.trim() !== "");
        this.setState({
            value: "",
        });
        call && this.props.callback("");
    };

    render = (): JSX.Element => {
        return (
            <>
                <Input.Group compact>
                    <Input.Search
                        allowClear
                        style={{ width: '100%' }}
                        defaultValue=""
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                </Input.Group>
                {/* <div className="search-input">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text round">Buscar</div>
                        </div>
                        <input
                            type="text"
                            className="form-control round"
                            placeholder=""
                            onChange={this.handleChange}
                            value={this.state.value}
                        />
                    </div>
                    <span
                        className="erase-search cursor-pointer text-muted"
                        onClick={this.handleEraseClick}
                    >
                        &times;
                    </span>
                </div> */}
            </>
        );
    };
}
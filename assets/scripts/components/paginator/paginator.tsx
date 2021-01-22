import { link } from 'fs';
import React from 'react';

interface PaginatorPropsI {
    maxPages: number;
    showed: number;
    total: number;
    actual: number;
    onClick: (index: number) => void;
}

export default class Paginator extends React.Component<PaginatorPropsI, {}>{
    constructor (props: PaginatorPropsI) {
        super(props);
    }

    PageLink = (props: React.PropsWithChildren<{
        [ key: string ]: any;
    }>) => {
        return (
            <a
                {...props}
                onClick={this.handleClick}
            />
        );
    };

    handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        this.props.onClick(+(e.target as HTMLAnchorElement).getAttribute("page-index")!);
    };

    render = (): JSX.Element => {
        const MaxLink = 5;
        return (
            <>
                <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                        <li className={"page-item" + (this.props.actual == 1 ? " disabled" : "")}>
                            <this.PageLink
                                className="page-link paginator"
                                style={{
                                    borderTopLeftRadius: "1.25rem",
                                    borderBottomLeftRadius: "1.25rem",
                                }}
                                page-index="1"
                                aria-label="Primero"
                            >
                                &laquo;
                        </this.PageLink>
                        </li>
                        <li className={"page-item" + (this.props.actual == 1 ? " disabled" : "")}>
                            <this.PageLink
                                className="page-link paginator"
                                page-index={this.props.actual - 1}
                            >
                                Anterior
                        </this.PageLink>
                        </li>
                        {
                            (this.props.actual > 3) && (
                                <li className="page-item disabled">
                                    <this.PageLink className="page-link paginator" page-index={1} aria-label="...">
                                        ...
                                    </this.PageLink>
                                </li>
                            )
                        }
                        {Array.apply(null, Array(MaxLink)).map((_, i) => {
                            i -= 2;
                            const index = this.props.actual + i;
                            if (index > 0 && index <= this.props.maxPages) {
                                return (
                                    <li
                                        key={"page-" + index}
                                        className={"page-item" + (this.props.actual === index ? " disabled" : "")}
                                    >
                                        <this.PageLink className="page-link paginator" page-index={index}>{index}</this.PageLink>
                                    </li>
                                );
                            }
                        })}
                        {
                            (this.props.actual < (this.props.maxPages - 2)) && (
                                <li className="page-item disabled">
                                    <this.PageLink
                                        className="page-link paginator"
                                        page-index={this.props.maxPages}
                                        aria-label="..."
                                    >
                                        ...
                                    </this.PageLink>
                                </li>
                            )
                        }
                        <li className={"page-item" + (this.props.actual === this.props.maxPages ? " disabled" : "")}>
                            <this.PageLink className="page-link paginator" page-index={this.props.actual + 1}>
                                Siguiente
                            </this.PageLink>
                        </li>
                        <li className={"page-item" + (this.props.actual === this.props.maxPages ? " disabled" : "")}>
                            <this.PageLink
                                className="page-link paginator"
                                style={{
                                    borderTopRightRadius: "1.25rem",
                                    borderBottomRightRadius: "1.25rem",
                                }}
                                page-index={this.props.maxPages}
                                aria-label="Último"
                            >
                                &raquo;
                            </this.PageLink>
                        </li>
                    </ul>
                </nav>
                <div className="text-center text-muted">
                    <small>
                        {this.props.showed} de {this.props.total}
                    </small>
                </div>
            </>
        );
    };
}
import Layout from "@components/layout";
import Router from "@scripts/router";
import React from "react";
import { Link } from "react-router-dom";

export default class Error404 extends React.Component {
    render = (): JSX.Element => {
        return (
            <Layout title="No se encontró la página">
                <div className="w-50 mt-5 mx-auto text-center">
                    <h4>404</h4>
                    <hr />
                        No se encontró la pagina. <br />
                    <Link to={(new Router()).get("home")}>Ir al inicio</Link>
                </div>
            </Layout>
        );
    };
}
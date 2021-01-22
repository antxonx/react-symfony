import Layout from '@components/layout';
import React from 'react';

export default class ErrorBoundary extends React.Component<{}, {
    hasError: boolean;
    error: string;
}> {
    constructor(props: {}) {
      super(props);
      this.state = { 
          hasError: false ,
          error: "",
        };
    }
  
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error: error.message};
    }
  
    render() {
      if (this.state.hasError) {
        return (
            <Layout title="Error">
                <div className="container mt-5 mx">
                    <div className="alert alert-danger round mt-5">
                        <h4>Ocurrió un error.</h4>
                        {this.state.error}
                    </div>
                </div>
            </Layout>
        )
      }
  
      return this.props.children; 
    }
  }
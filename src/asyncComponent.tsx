// The code below is borrowed from here:
// https://blog.emilecantin.com/web/react/javascript/2017/05/16/ssr-react-router-4-webpack-code-split.html

import * as React from 'react';
import * as NProgress from 'nprogress';

// import './styles.scss'

class NProgressTag extends React.Component {
  componentWillMount() {
    NProgress.start();
  }

  componentWillUnmount() {
    NProgress.done();
  }

  render() {
    return <div />;
  }
}

function asyncComponent(chunkName: any, getComponent: any) {
  return class AsyncComponent extends React.PureComponent<AsyncComponentProps> {
    static Component: any = null;

    static loadComponent() {
      // The function we call before rendering
      return getComponent()
        .then((m: any) => m.default)
        .then((Component: any) => {
          AsyncComponent.Component = Component;
          return Component;
        });
    }

    mounted = false;

    state = {
      Component: AsyncComponent.Component,
    };

    componentWillMount() {
      if (this.state.Component === null) {
        AsyncComponent.loadComponent().then((Component: any) => {
          if (this.mounted) {
            this.setState({ Component });
          }
        });
      }
    }

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const { Component } = this.state;
      if (Component != null) {
        return <Component {...this.props} />;
      } else {
        console.log('\u2714 asyncComponent render 64', chunkName);
      }
      return <NProgressTag />; // or <div /> with a loading spinner, etc..
    }
  };
}

export default asyncComponent;

interface AsyncComponentProps {
  history: any;
}

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { kea } from 'kea';
import Home from './pages/home/Home';
import NotFound from './pages/error/NotFound';
import Login from './pages/login/Login';
import { ConnectedRouter } from 'react-router-redux';

// tslint:disable-next-line
const App: React.SFC<AppProps> = () => {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" exact={true} component={Login} />
        <Route path="/404" exact={true} component={NotFound} />
        <Route path="/" component={Home} />
      </Switch>
    </div>
  );
};
// class App extends React.Component<AppProps, any> {
//   render() {
//     return (
//       <div className="App">
//         <Route path="/home" exact={true} component={router.home} />
//         <Route path="/login" component={router.login} />
//         <Route path="/404" component={router.notFound} />
//       </div>
//     );
//   }
// }
interface AppProps {}
export default kea({ path: () => ['scenes', 'app'] })(App);

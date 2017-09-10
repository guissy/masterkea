"use strict";
exports.__esModule = true;
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
require("./App.css");
var kea_1 = require("kea");
var Home_1 = require("./pages/home/Home");
var NotFound_1 = require("./pages/error/NotFound");
var Login_1 = require("./pages/login/Login");
// tslint:disable-next-line
var App = function () {
    return (<div className="App">
      <react_router_dom_1.Switch>
        <react_router_dom_1.Route path="/login" exact={true} component={Login_1["default"]}/>
        <react_router_dom_1.Route path="/404" exact={true} component={NotFound_1["default"]}/>
        <react_router_dom_1.Route path="/" component={Home_1["default"]}/>
      </react_router_dom_1.Switch>
    </div>);
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
// declare module 'rythm.js/rythm.js';
var Rythm = require("rythm.js");
var rythm = new Rythm();
rythm.setMusic("http://site.show160.com/e09d516e73a785f25e5b43eb55dc7dfd/usermusic/MusicFile/20165/20160522114421786.mp3");
rythm.addRythm('pulse2', 'pulse', 0, 10, {
    min: 0.1,
    max: 1
});
rythm.start();
exports["default"] = kea_1.kea({ path: function () { return ['scenes', 'app']; } })(App);

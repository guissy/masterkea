// object key must match chunk name
import asyncComponent from './asyncComponent';

export default {
  home: asyncComponent('home', () => import(/* webpackChunkName: "home" */ './pages/home/Home')),
  login: asyncComponent('login', () => import(/* webpackChunkName: "login" */ './pages/login/Login')),
  notFound: asyncComponent('notFound', () => import(/* webpackChunkName: "notFound" */ './pages/error/NotFound')),
  stage: asyncComponent('stage', () => import(/* webpackChunkName: "notFound" */ './pages/lottery/Stage')),
  result: asyncComponent('result', () => import(/* webpackChunkName: "notFound" */ './pages/lottery/Result')),
  thirdgame: asyncComponent('thirdgame', () =>
    import(/* webpackChunkName: "thirdgame" */ './pages/thirdgame/Thirdgame')
  ),
};

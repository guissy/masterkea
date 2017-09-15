// object key must match chunk name
import asyncComponent from './asyncComponent';

export default {
  home: asyncComponent('home', () => import(/* webpackChunkName: "home" */ './pages/home/Home')),
  login: asyncComponent('login', () => import(/* webpackChunkName: "login" */ './pages/login/Login')),
  notFound: asyncComponent('notFound', () => import(/* webpackChunkName: "notFound" */ './pages/error/NotFound')),
  stage: asyncComponent('stage', () => import(/* webpackChunkName: "Stage" */ './pages/lottery/Stage')),
  result: asyncComponent('result', () => import(/* webpackChunkName: "Result" */ './pages/lottery/Result')),
  hall: asyncComponent('hall', () => import(/* webpackChunkName: "Hall" */ './pages/account/hall/Hall')),
  subaccount: asyncComponent('subaccount', () => import(/* webpackChunkName: "Hall" */ './pages/account/subaccount/Subaccount')),
  message: asyncComponent('message', () => import(/* webpackChunkName: "Message" */ './pages/notice/message/Message')),
  thirdgame: asyncComponent('thirdgame', () =>
    import(/* webpackChunkName: "thirdgame" */ './pages/thirdgame/Thirdgame')
  ),
};

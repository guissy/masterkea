import { message, Modal } from 'antd';
// import { any, SubscriptionAPI } from 'dva';
// import { any } from '../../../typings/dva';
import { IntlXlz } from '../../../typings/intl';
import zh from '../../locale/zh-CN';
import environment from '../../utils/environment';
import { AjaxState, Result } from '../../utils/Result';
import { call, put, select } from 'redux-saga/effects';
import { Actions } from './BasePage';

const initState = {
  itemName: '', // 用于提示『创建xxx成功！』
  loading: true,
  saving: false,
  total: 0, // 翻页用
  page: 1,
  list: [] as any,
  info: {}, // 正在编辑的
  attributes: {},
};

// 判断创建还是修改，用于区分接口和成功提示语
function isUpdate(payload: AnyItem | AnyItem[]) {
  let idOk = false;
  // tslint:disable-next-line
  if (Array.isArray(payload)) {
    if (payload.length > 0) {
      idOk = payload[0].id > 0;
    }
  } else {
    idOk = payload.id > 0;
  }
  return idOk;
}

function showErrMsg(result: Result) {
  let content = '';
  if (!result) {
    content = '网络繁忙，请稍候重试！';
  } else if (result.status === 401) {
    content = '会话已过期，请重新登录！';
  } else if (result.status === 404) {
    content = '接口不存在！';
  } else if (result.status === 405) {
    content = '权限不足！';
  }
  Modal.error({ content });
}

export default class BaseModel {
  public effects: any;
  public namespace: string;
  public state: any;
  public actions: any;
  public reducers: any;
  private service: any;

  constructor(namespace: string, state: BaseState & { [x: string]: any }, service: BaseService) {
    this.namespace = namespace;
    this.service = service;
    this.state = { ...initState, ...state };
    this.effects = this.getEffects(this.namespace, this.state.itemName, this.service);
    this.reducers = this.getReducers();
    this.actions = new Actions();
  }

  // itemName 模块名（提示消息中出现），
  // itemName 默认为null，表示不出现提示消息
  public addEffect(key: string, ajaxMessage: string | getAjaxMessage = '', needQuery = false) {
    const { namespace, service } = this;
    const ajax = service[`${key}Ajax`];
    const loading = `${key}Loading`;
    const needMessage = ajaxMessage !== '';
    let ajaxMsg = ajaxMessage;
    const effects = {
      *effect(this: { actions: Actions; props: BaseState }, { payload, resolve }: any) {
        if (ajax) {
          if (needMessage) {
            if (typeof ajaxMessage === 'function') {
              ajaxMsg = ajaxMessage(payload);
            }
            yield put({
              type: `${namespace}/changeLoading`,
              payload: { [loading]: true },
            });
          }
          const { lang } = yield select((store: Store) => ['lang']);
          const site = lang ? lang.site : zh;
          const result = yield call(ajax, payload);
          if (result && result.state === 0) {
            const action = {
              type: `${namespace}/${key}Success`,
              payload: { [key]: result.data || [] },
            };
            if (this.actions[action.type]) {
              if (needMessage) {
                action.payload[loading] = false;
                yield put(this.actions[action.type](action.payload) as any);
                message.info(`${ajaxMsg}${site.成功}`);
              } else {
                yield put(this.actions[action.type](action.payload) as any);
                // yield put(action);
              }
            } else {
              console.warn('☞☞☞ \u2714 BaseModel 105 no exist: ', action.type);
            }
            if (resolve) {
              resolve(action.payload);
            }
            if (needQuery) {
              yield put(this.actions.query({}) as any);
            }
          } else {
            if (needMessage) {
              yield put({
                type: `${namespace}/changeLoading`,
                payload: { [loading]: false },
              });
              Modal.error({
                content: result.message || `${ajaxMsg}${site.失败}`,
              });
            }
          }
        } else {
          console.error(`请求 ${key} 失败！检查 service.ts 是否有方法 ${key}Ajax `);
        }
      },
    };
    this.state[key] = [];
    this.effects = { ...this.effects, [key]: effects.effect };
    this.actions = { ...this.actions, [namespace + '/' + key + 'Success']: () => {} };
    // this.reducers = { ...this.reducers, ...reducers };
  }

  private getEffects(namespace: string, itemName: string, service: any) {
    const { createAjax, deleteAjax, infoAjax, queryAjax, statusAjax, updateAjax } = service;
    return {
      *query(this: { actions: Actions; props: BaseState }, { payload, resolve }: any) {
        if (!payload || (payload && !payload.noLoading)) {
          yield put({ type: 'changeLoading', payload: { loading: true } });
        }
        let { page } = yield select((store: Store) => store.scenes[namespace]);
        page = (payload && payload.page) || page || 1;
        // tslint:disable-next-line
        const page_size = (payload && payload.page_size) || environment.page_size;
        let result;
        try {
          result = yield call(queryAjax, { ...payload, page, page_size });
        } catch (e) {
          if (!payload || (payload && !payload.noLoading)) {
            showErrMsg(result);
          }
        }
        if (result && result.state === 0) {
          let data = {};
          if (Array.isArray(result.data)) {
            data = { list: result.data };
          } else if (typeof result.data === 'object') {
            data = result.data;
            console.warn('返回数据不是数组：', result.data);
          } else {
            console.warn('返回数据为空：', result.data);
          }
          yield put(
            this.actions.querySuccess({
              ...data,
              total: result.attributes ? result.attributes.total : 0,
              page: result.attributes ? result.attributes.number : 0,
              attributes: result.attributes,
              loading: false,
            })
          );
          if (resolve) {
            resolve(data);
          }
        } else {
          if (!payload || (payload && !payload.noLoading)) {
            yield put({ type: 'changeLoading', payload: { loading: false } });
            showErrMsg(result);
          }
        }
      },
      // 详情：编辑时取最新数据，或点查看取详细内容
      *info({ payload }: any) {
        if (infoAjax) {
          const result = yield call(infoAjax, payload);
          if (result && result.state === 0) {
            // const { list } = yield select(store => store[namespace]);
            // const editingItem = list.find(item => item.id === payload.id);
            // Object.assign(editingItem, result.data);
            // 返回结果不能为数组！！！
            console.assert(!Array.isArray(result.data), 'info 返回详情结果不能为数组！！！');
            const info = Array.isArray(result.data) ? result.data[0] : result.data;
            yield put({
              type: 'infoSuccess',
              payload: { info, loading: false },
            });
          }
        } else {
          console.error('详情请求失败！检查 service.ts 是否有方法 infoAjax() ');
        }
      },
      // 保存：提交创建或修改的表单
      *save({ payload }: any) {
        const saveAjax = isUpdate(payload) ? updateAjax : createAjax;
        if (saveAjax) {
          yield put({ type: 'changeLoading', payload: { saving: true } });
          const { site } = yield select(({ lang }: Store) => lang);
          const result = yield call(saveAjax, payload);
          if (result && result.state === 0) {
            yield put({ type: 'saveSuccess', payload: { saving: false } });
            yield put({ type: 'reset' });
            yield put({ type: 'query' });
            message.info(isUpdate(payload) ? `${site.修改}${itemName}${site.成功}` : `${site.新增}${itemName}${site.成功}`);
          } else if (result.state === 4001) {
            Modal.error({
              content: `账号已经存在`,
            });
          } else {
            const defaultErrMsg = isUpdate(payload)
              ? `${site.修改}${itemName}${site.失败}`
              : `${site.新增}${itemName}${site.失败}`;
            yield put({ type: 'changeLoading', payload: { saving: false } });
            Modal.error({
              content: (result && result.message) || defaultErrMsg,
            });
          }
        } else {
          if (isUpdate(payload)) {
            console.error('修改失败！检查 service.ts 是否有方法 updateAjax() ');
          } else {
            console.error('创建失败！检查 service.ts 是否有方法 createAjax() ');
          }
        }
      },
      *status({ payload }: any) {
        if (statusAjax) {
          yield put({ type: 'changeLoading', payload: { saving: true } });
          const { site } = yield select(({ lang }: Store) => lang);
          const { labels, ...rest } = payload;
          const result = yield call(statusAjax, rest);
          const [txt2, txt1] = labels || [site.启用, site.停用];
          const status = Number(payload.status);
          let toOpen = false;
          // tslint:disable-next-line
          if (isNaN(status)) {
            toOpen = payload.status === 'rejected';
          } else {
            toOpen = !status;
          }
          const idstr = `ID: ${payload.id}`;
          if (result && result.state === 0) {
            let { list }: BaseState = yield select((store: Store) => store[namespace]);
            list = list.map(item => (item.id === payload.id ? { ...item, status: payload.status } : item));
            yield put({ type: 'statusSuccess', payload: { list, saving: false } });
            yield put({ type: 'query', payload: { noLoading: true } });
            message.info(
              toOpen ? `${itemName} ${idstr} 设置为 ${txt1} ${site.成功}` : `${itemName} ${idstr} 设置为 ${txt2} ${site.成功}`
            );
          } else {
            let { list }: BaseState = yield select((store: Store) => store[namespace]);
            list = list.map(item => (item.id === payload.id ? { ...item, status: item.status } : item));
            yield put({ type: 'changeLoading', payload: { list, saving: false } });
            if (result && result.state === AjaxState.操作错误) {
              Modal.error({ content: result.message });
            } else {
              Modal.error({
                content: toOpen
                  ? `${itemName} ${idstr} 设置为 ${txt1} ${site.失败}`
                  : `${itemName} ${idstr} 设置为 ${txt2} ${site.失败}`,
              });
            }
          }
        } else {
          console.error('状态更改失败！检查 service.ts 是否有方法 statusAjax() ');
        }
      },
      *remove({ payload }: any) {
        if (deleteAjax) {
          yield put({ type: 'changeLoading', payload: { saving: true } });
          const { site } = yield select(({ lang }: Store) => lang);
          const result = yield call(deleteAjax, { ...payload });
          if (result && result.state === 0) {
            yield put({ type: 'deleteSuccess', payload: { saving: false } });
            yield put({ type: 'query' });
            message.info(`${site.删除}${itemName}${site.成功}`);
          } else {
            yield put({ type: 'changeLoading', payload: { saving: false } });
            Modal.error({ content: `${site.删除}${itemName}${site.失败}` });
          }
        } else {
          console.error('删除失败！检查 service.ts 是否有方法 deleteAjax() ');
        }
      },
    };
  }

  private getReducers() {
    return {
      changeLoading(state: BaseState, action: any) {
        return { ...state, ...action.payload };
      },
      querySuccess(state: BaseState, action: any) {
        return { ...state, ...action.payload };
      },
      infoSuccess(state: BaseState, action: any) {
        return { ...state, ...action.payload };
      },
      saveSuccess(state: BaseState, action: any) {
        return { ...state, ...action.payload };
      },
      statusSuccess(state: BaseState, action: any) {
        return { ...state, ...action.payload };
      },
      deleteSuccess(state: BaseState, action: any) {
        return { ...state, ...action.payload };
      },
    };
  }
}

// redux 状态在 props 中都是可选的
export interface BaseState {
  itemName?: string;
  loading?: boolean;
  saving?: boolean;
  list?: AnyItem[]; // 从服务器返回的数据，通常为数组
  info?: any;
  total?: number; // 翻页用
  page?: number;
  page_size?: number;
  attributes?: any;
  site?: IntlXlz;
}

interface AnyItem {
  id: number;
  [k: string]: any;
}

export interface Store {
  [k: string]: BaseState;
}

export interface AllStore {
  lang?: BaseState;
  build?: BaseState;
  hall?: BaseState;
  role?: BaseState;
  subaccount?: BaseState;
  webset?: BaseState;
  bank?: BaseState;
  currency?: BaseState;
  pay?: BaseState;
  stage?: BaseState;
  result?: BaseState;
  hallcost?: BaseState;
  message?: BaseState;
  notice?: BaseState;
  operation?: BaseState;
  order?: BaseState;
  review?: BaseState;
  periods?: BaseState;
  summary?: BaseState;
  gameReport?: BaseState;
  mtoken?: BaseState;
  game?: BaseState;
  ipblacks?: BaseState;
  logs?: BaseState;
  thirdgame?: BaseState;
  gameid?: BaseState;
  halluser?: BaseState;
  lhc?: BaseState;
}

export type AnyStore = { [k in keyof AllStore]?: BaseState };

export interface BaseService {
  createAjax: (params: any) => Promise<any>;
  deleteAjax: (params: any) => Promise<any>;
  queryAjax: (params: any) => Promise<any>;
  statusAjax?: (params: any) => Promise<any>;
  updateAjax: (params: any) => Promise<any>;
}

type getAjaxMessage = (payload: any, result?: Result) => string;

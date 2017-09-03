import * as PropTypes from 'prop-types';
import { lowerFirst, isEqual } from 'lodash';
import { Dispatch } from 'redux';
import { ComponentDecorator, kea, KeaOption, TakeLatestParam } from 'kea';

function getPropTypes(val: string | number | boolean | object) {
  if (typeof val === 'string') {
    return PropTypes.string;
  } else if (typeof val === 'number') {
    return PropTypes.number;
  } else if (typeof val === 'boolean') {
    return PropTypes.bool;
  } else if (Array.isArray(val)) {
    return PropTypes.array;
  } else {
    return PropTypes.object;
  }
}
function getStateName(action: string, val: string | number | boolean | any[]): any {
  if (Array.isArray(val)) {
    throw new Error('not array');
    // return { array: val };
  } else if (typeof val === 'object') {
    return val;
  } else {
    let key = action;
    if (action.includes('onChange')) {
      key = lowerFirst(action.replace('onChange', ''));
    }
    return { [key]: val };
  }
}
interface BuildKeaOption<A, S> {
  namespace: string;
  state: S;
  props?: any;
  actions: A;
  effects?: any;
  start?: () => void;
}

function buildKea<A, S>({
  namespace,
  state,
  props,
  actions,
  effects,
  start,
}: BuildKeaOption<A, S>): KeaOption<any, any> {
  return {
    path: () => ['scenes', namespace],
    actions: () =>
      Object.keys(actions)
        .filter(v => typeof v === 'string')
        .reduce((o, v) => ({ ...o, [v]: (w: any) => getStateName(v, w) }), {}),
    reducers: ({ actions }: any) =>
      Object.keys(state).reduce(
        (reducersAll, stateKey) => ({
          ...reducersAll,
          [stateKey]: [
            state[stateKey],
            getPropTypes(state[stateKey]),
            Object.keys(actions).reduce(
              (actionsForReducer, action) => ({
                ...actionsForReducer,
                [actions[action]]: (preState: any, payload: S & { key: string }) => {
                  let result: S;
                  if (payload) {
                    delete payload.key;
                    const nextState = payload[stateKey];
                    if (nextState === undefined) {
                      // 所有 stateKey 与 所有 action 是多对多，所以 undefined 就得忽略
                      result = preState;
                    } else {
                      let mergeState;
                      if (getPropTypes(state[stateKey]) === PropTypes.array) {
                        mergeState = nextState;
                      } else if (getPropTypes(state[stateKey]) === PropTypes.object) {
                        mergeState = { ...preState, ...nextState };
                      } else if (getPropTypes(state[stateKey]) === PropTypes.bool) {
                        mergeState = nextState === undefined ? !nextState : Boolean(nextState);
                      } else {
                        mergeState = nextState;
                      }
                      result = isEqual(preState, mergeState) ? preState : mergeState;
                      console.log('\u2665  87', stateKey, isEqual(preState, mergeState), '赋值时：', preState, payload, result);
                    }
                  }
                  // if(stateKey==='defaultSelectedKeys') {
                  // }
                  return result;
                },
              }),
              {}
            ),
          ],
        }),
        {}
      ),
    takeEvery: effects
      ? ({ actions, workers }: TakeLatestParam) =>
          Object.keys(effects).reduce((effectAll, effectKey) => {
            effectAll[actions[effectKey]] = effects[effectKey];
            return effectAll;
          }, {})
      : undefined,
    workers: effects,
    connect: props && {
      actions: Object.keys(props).reduce((o, v) => {
        if (Object.keys(props[v].actions).includes(v)) {
          o = o.concat([props[v], [v]]);
        }
        return o;
      }, []),
      props: Object.keys(props).reduce((o, v) => {
        if (Object.keys(props[v].reducers).includes(v)) {
          o = o.concat([props[v], [v]]);
        }
        return o;
      }, []),
    },
    start: start,
  };
}
export default function createWith<A, S>(option: BuildKeaOption<A, S>): ComponentDecorator<A, S> {
  return kea(buildKea(option));
}

export type KeaProps<A, S> = ActionsProps<A> & StateProps<S> & { dispatch: Dispatch<any> };
interface ActionsProps<A> {
  actions: { [k in keyof A]: (v?: any) => any };
}
type StateProps<S> = { [k in keyof S]: any };

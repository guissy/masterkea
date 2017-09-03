/// <reference types="react" />
/// <reference types="redux" />


declare module 'kea' {
  export function createAction(name: string, creator: (p?: any) => any): any;
  export function keaSaga(appSagas?: () => Iterable<any> | null): Iterator<any>;
  export function keaReducer(pathStart?: string, options?: object): any;
  export function kea<TOwnProps, Actions, States>(option: KeaOption<Actions, States>): ComponentDecorator<TOwnProps>;
  export function connect<TOwnProps, States>(option: Connect): ComponentDecorator<TOwnProps>;
  export interface KeaOption<ActionKeys, StateKeys> {
    key?: (props: any) => string,
    path?: (key: string) => string[],
    actions?(): Actions<ActionKeys>;
    reducers?: ( param: { actions: Actions<ActionKeys> }) => { [reducerName in keyof StateKeys]: KeaReducer<any> };
    selectors?: ( param: selectorParam ) => { [selectorName in keyof StateKeys]: [Selector, Modifier, React.Requireable<any>] };
    connect?: Connect;
    takeLatest?: ( param: TakeLatestParam ) => KeaWorkers2<ActionKeys>;
    takeEvery?: ( param: TakeLatestParam ) => KeaWorkers2<ActionKeys>;
    workers?: KeyWorkers<ActionKeys>;
    start?: () => void;
  }

  export type TakeLatestParam = { actions: Actions<ActionKeys>, workers: KeyWorkers };

  type Actions<ActionKeys> =  {
    [actionName in keyof ActionKeys]: ActionCreator;
  }
  type KeaWorkers<ActionKeys> =  {
    [actionName in keyof ActionKeys]: (this: { actions: Actions }, action: any) => any;
    // [key: string]: (this: { actions: Actions }, action: any) => any;
  }
  type KeaWorkers2<ActionKeys> =  {
    [actionName: any]: any; //(this: { actions: Actions }, action: any) => any;
    // [key: string]: (this: { actions: Actions }, action: any) => any;
  }

  interface Connect {
    actions?: ConnectAction[];
    props: ConnectProps[];
  }

  type ConnectAction = ComponentDecorator<TOwnProps> | string[]
  type ConnectProps = ComponentDecorator<TOwnProps> | string[]


  type KeaReducer<S> = [any, React.Requireable<any>, ReduxReducers]
  interface ReduxReducers {
    [action: ActionCreator]: ReduxReducer<any>;
  }
  type ReduxReducer<S> = (state: S, payload: Payload) => S;

  interface Payload {
    type: any;
    [extraProps: string]: any;
  }

  export interface ActionCreators {
    [actionName: string]: ActionCreator
  }

  interface ActionCreator {
    (param?: any): {[k: string]: any};
  }

  interface selectorParam {
    selectors: any; // 全局 store
  }


  interface Selector {
    (): KeaReducer<any>[]; // selectorNames
  }

  interface Modifier {
    (old: any): any;
  }

  // 装饰器
  interface CanFalseComponent<T> extends React.ComponentClass<T> {
    new (props?: P, context?: any): any;
  }
  interface ComponentDecorator<A, S>  {
    <Spec extends CanFalseComponent<P>, KeaSpec extends Spec>(component: CanFalseComponent<P>): KeaSpec;
    actions?: { [k in keyof A]: (val: any) => Action }
    state?: { [k in keyof S]: (val: any) => void }
  }
  // interface SFC<TOwnProps> {
  //   <Spec extends React.StatelessComponent<TOwnProps>, KeaSpec extends Spec>(component: Spec): KeaSpec
  // }

  interface Action {
    type: any;
    payload: any;
  }
}


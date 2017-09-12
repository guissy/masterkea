// 当 action 的 promise 为 true 时, 则 dispatch 返回 Promise 实例
// 当 action 的 promise 为 string 时，则 dispatch 返回跟此 string 对应的 Promise 实例，此情形用于频繁的ajax请求
export default function thunkMiddleware({ dispatch, getState }: any) {
  return (next: any) => (action: any) => {
    const { promise } = action.payload || { promise: false };
    let promiseInst: Promise<any> = Promise.resolve();
    if (promise) {
      promiseInst = new Promise(resolve => (action.resolve = resolve));
    } else {
      promiseInst = action;
    }
    next(action);
    return promiseInst as any;
  };
}

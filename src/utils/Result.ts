/**
 * 从后台返回的json数据转换为本地class
 *
 */
export class Result {
  public status: number;
  public message: string;
  public data: any;
  public state: AjaxState; // 0=成功，1=警告，2=失败，3=错误

  constructor(json: any) {
    type T = keyof Result;
    Object.keys(json).forEach((key: T) => {
      this[key] = json[key];
    });
  }
}

function range(min: number, max: number) {
  return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.set; // save a reference to the original method
    descriptor.set = function(val: number) {
      // const val = originalMethod()
      const valOk = Math.max(Math.min(val, max), min);
      originalMethod.apply(this, [valOk]);
    };
    return descriptor;
  };
}

export enum AjaxState {
  成功,
  警告,
  失败,
  错误,
  操作错误, // 非服务器返回，直接弹框显示message
}

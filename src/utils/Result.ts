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

export enum AjaxState {
  成功,
  警告,
  失败,
  错误,
  操作错误, // 非服务器返回，直接弹框显示message
}

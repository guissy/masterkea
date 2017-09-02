import * as moment from 'moment';

// 参数e单位为秒
export function datetime(e: string) {
  const minDate = new Date(1972, 1, 1).valueOf() / 1000;
  const d = parseInt(e, 10);
  // 全数字且大于1972年则格式化
  if (/^\d+$/.test(e) && d > minDate) {
    return moment.unix(d).format('YYYY-MM-DD HH:mm:ss');
  } else if (Number(e) < 1000) {
    return '';
  } else {
    return e; // '2017-10-01 08:00'
  }
}

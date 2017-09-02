import { cloneDeep } from 'lodash';
export interface MenusState {
  menu: any[];
}
/**
 * 数组内查询
 */
export const queryArray = (array: any[], key: number, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null;
  }
  const item = array.filter(_ => _[keyAlias] === key);
  if (item.length) {
    return item[0];
  }
  return null;
};

/**
 * 数组格式转树状结构
 */
export const arrayToTree = (array: any[], id = 'id', pid = 'pid', children = 'children'): MenuItem[] => {
  const data = cloneDeep(array);
  const result = [] as MenuItem[];
  const hash = {} as any;
  data.forEach((item: any, index: number) => {
    hash[data[index][id]] = data[index];
  });

  data.forEach((item: any) => {
    const hashVP = hash[item[pid]];
    if (hashVP) {
      if (!hashVP[children]) {
        hashVP[children] = [];
      }
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
};

export interface MenuItem {
  id: number;
  bpid?: number; // 面包屑的父id
  mpid?: number; // 菜单项的父id
  name: string;
  icon: string;
  path: string;
  children?: MenuItem[];
  action: string;
}

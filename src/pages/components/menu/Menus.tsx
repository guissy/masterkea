import { Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';
import * as React from 'react';
import { MenuItem } from './Menus.model';
import createWith, { KeaProps } from '../../../utils/buildKea';
import environment from '../../../utils/environment';
import { menusData } from '../../components/menu/Menus.data';
import { put } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { Action, createAction } from 'kea';

// tslint:disable-next-line variable-name
const Menus = ({ dispatch, menusData, actions, fullSize, openKeys, defaultSelectedKeys }: MenusProps) => {
  const onOpenChange = (openKeys: string[]) => {
    actions.onChangeOpenKeys({ openKeys: openKeys.slice(-1) });
  };
  const onClickNavMenu = (event: any) => {
    event.domEvent.preventDefault();
    event.domEvent.stopPropagation();
    const pathname = event.item.props.children.props.href;
    actions.onChangeLastPathname({ pathname });
    dispatch(push(pathname));
    // 为什么使用 Link to 就会将 defaultSelectedKeys 清空呢， 但是断点又不会呢，难道 to 会与 redux 并发？
  };
  return (
    <div>
      <Menu
        onOpenChange={onOpenChange}
        openKeys={fullSize ? [] : openKeys}
        mode={fullSize ? 'vertical' : 'inline'}
        onClick={onClickNavMenu}
        defaultSelectedKeys={defaultSelectedKeys}
        key={String(defaultSelectedKeys)}
        className="e2e-menu"
      >
        {menusData.map((item: MenuItem) => {
          if (item.children) {
            return (
              <Menu.SubMenu
                key={item.id}
                title={
                  <span>
                    {item.icon && <Icon type={item.icon} />}
                    {item.name}
                  </span>
                }
              >
                {item.children.map(subItem => (
                  <Menu.Item key={subItem.id}>
                    <a
                      href={subItem.path.startsWith('/') ? subItem.path : '/' + subItem.path}
                      style={{ color: '#333' }}
                    >
                      {subItem.icon && <Icon type={subItem.icon} />}
                      {subItem.name}
                    </a>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            );
          }
          const to = item.path.startsWith('/') ? item.path : '/' + item.path;
          return (
            <Menu.Item key={item.id}>
              <Link to={to} style={{ color: '#333' }}>
                {item.icon && <Icon type={item.icon} />}
                {item.name}
              </Link>
            </Menu.Item>
          );
        })}
      </Menu>
    </div>
  );
};
export interface MenusProps extends KeaProps<Actions, States> {
  fullSize: boolean;
}

// 默认首页
let lastPathnameCache = { pathname: environment.adminFirstPage };
let openKeys = [] as string[];
let defaultSelectedKeys = [] as string[];
try {
  // 上次退出前的首页
  lastPathnameCache = localStorage.getItem(`${environment.prefix}lastPathname`) as any;
  if (lastPathnameCache) {
    const menu = menusData.reduce((s, v) => s.concat(v, v.children), []).find(v => v.path === lastPathnameCache);
    if (menu) {
      openKeys = [menu.mpid, menu.id].filter(v => !!v).map(v => String(v));
      defaultSelectedKeys = openKeys.slice(0);
    }
  }
  // console.log('☞☞☞ Menus  85', );
} catch (e) {}

class States {
  openKeys = openKeys;
  defaultSelectedKeys = defaultSelectedKeys;
  lastPathname = lastPathnameCache;
  menusData = menusData;
}
class Actions {
  onChangeLastPathname = (p: any) => ({} as Action);
  onChangeOpenKeys = (p: any) => ({} as Action);
  // onChangeDefaultSelectedKeys = this.onChangeOpenKeys; //(p: any) => ({} as Action);
}
const state = new States();
export const withMenus = createWith({
  actions: new Actions(),
  state: state,
  namespace: 'menus',
  effects: {
    *onChangeLastPathname(this: MenusProps, { payload: { pathname, openKeys } }: any): any {
      // console.log('☞☞☞ Menus onChangeLastPathname 111', pathname);
      // debugger;
      if (pathname) {
        localStorage.setItem(`${environment.prefix}lastPathname`, pathname);
        const menu = menusData.reduce((s, v) => s.concat(v, v.children), []).find(v => v.path === pathname);
        if (menu) {
          const openKeys = [menu.mpid, menu.id].filter(v => !!v).map(v => String(v));
          const defaultSelectedKeys = [menu.id].map(v => String(v));
          console.log('\u2665 onChangeLastPathname 119', { openKeys, defaultSelectedKeys });
          const action = yield put(
            this.actions.onChangeOpenKeys({ openKeys, defaultSelectedKeys, lastPathname: pathname })
          );
          console.log('\u2665 onChangeLastPathname 121', action);
        }
      }
      // console.log('☞☞☞ Menus onChangeLastPathname 120', pathname, openKeys);
    },
  },
});
export default withMenus(Menus as any);

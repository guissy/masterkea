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
const Menus = ({ menusData, actions, fullSize, openKeys, defaultSelectedKeys }: MenusProps) => {
  const onOpenChange = (openKeys: string[]) => {
    actions.onChangeOpenKeys({ openKeys: openKeys.slice(-1) });
  };
  const onClickNavMenu = (event: any) => {
    const pathname = event.item.props.children.props.to;
    actions.onChangeLastPathname({ pathname });
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
                    <Link
                      to={subItem.path.startsWith('/') ? subItem.path : '/' + subItem.path}
                      style={{ color: '#333' }}
                    >
                      {subItem.icon && <Icon type={subItem.icon} />}
                      {subItem.name}
                    </Link>
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
      openKeys = defaultSelectedKeys = [menu.mpid, menu.id].filter(v => !!v).map(v => String(v));
      console.log('☞☞☞ Menus onChangeLastPathname 87', openKeys, defaultSelectedKeys);
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
  onChangeDefaultSelectedKeys = (p: any) => ({} as Action);
}
export const withMenus = createWith({
  actions: new Actions(),
  state: new States(),
  namespace: 'menus',
  effects: {
    *onChangeLastPathname(this: MenusProps, { payload: { pathname } }: any): any {
      // console.log('☞☞☞ Menus onChangeLastPathname 111', pathname);
      // debugger;
      localStorage.setItem(`${environment.prefix}lastPathname`, pathname);
      let openKeys = [] as string[];
      let defaultSelectedKeys = [] as string[];
      const menu = menusData.reduce((s, v) => s.concat(v, v.children), []).find(v => v.path === pathname);
      if (menu) {
        openKeys = defaultSelectedKeys = [menu.mpid, menu.id].filter(v => !!v).map(v => String(v));
        console.log('☞☞☞ Menus onChangeLastPathname 117', openKeys, defaultSelectedKeys);
      }
      // console.log('☞☞☞ Menus onChangeLastPathname 120', pathname, openKeys);
      yield put(this.actions.onChangeOpenKeys({ openKeys, defaultSelectedKeys, lastPathname: pathname }));
      yield put(push(pathname));
      yield put(createAction('hehe', null)());
    },
  },
});
export default withMenus(Menus as any);

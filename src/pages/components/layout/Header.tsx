import { Icon, Menu, Popover, Select } from 'antd';
import * as React from 'react';
import { withLang, LangSiteState } from '../../lang.model';
import { LoginState } from '../../login/Login.model';
import Menus, { withMenus } from '../menu/Menus';
import './Header.css';
import { withLogin } from '../../login/Login';
import createWith, { KeaProps } from '../../../utils/buildKea';
import { MenuItem } from '../menu/Menus.model';
import { Action, createAction } from 'kea';
import { push } from 'react-router-redux';

// tslint:disable-next-line
const Header = ({
  dispatch,
  actions,
  login,
  site,
  onChangeEditPwd,
  onChangeProfile,
  fullSize,
  isNavbar,
  menuPopoverVisible,
  switchMenuPopover,
  onChangeFullSize,
  menusData,
}: HeaderProps) => {
  const handleClickMenu = (e: any) => {
    switch (e.key) {
      case 'logout':
        dispatch(actions.logout({}));
        break;
      case 'editPwd':
        onChangeEditPwd();
        break;
      case 'profile':
        onChangeProfile();
        break;
    }
  };
  const onSearchMenu = (menuName: string) => {
    let m: MenuItem;
    menusData.forEach((v: any) => {
      if (v.name === menuName) m = v;
      v.children.forEach((w: any) => {
        if (w.name === menuName) {
          m = w;
        }
      });
    });
    if (m) {
      actions.onChangeLastPathname({
        pathname: m.path,
      });
      dispatch(push(m.path));
    }
  };

  const menusDataOk = menusData.reduce((s: any[], v: MenuItem) => s.concat(v.children.length ? v.children : [v]), []);
  return (
    <div className="header">
      <div>
        {isNavbar ? (
          <Popover
            placement="bottomLeft"
            onVisibleChange={switchMenuPopover}
            visible={menuPopoverVisible}
            overlayClassName="popovermenu"
            trigger="click"
            content={<Menus fullSize={fullSize} />}
          >
            <div className="button">
              <Icon type="bars" />
            </div>
          </Popover>
        ) : (
          <span className="button" onClick={onChangeFullSize}>
            <Icon type={fullSize ? 'menu-unfold' : 'menu-fold'} />
          </span>
        )}
        <Select
          mode="combobox"
          className="searcher"
          placeholder="搜索菜单"
          onChange={onSearchMenu}
          showSearch={true}
          dropdownClassName="searchMenu"
          key={window.location.pathname}
        >
          {menusDataOk.map((v: MenuItem) => <Select.Option key={v.name}>{v.name}</Select.Option>)}
        </Select>
      </div>
      <p>
        <span className="title">后台管理平台</span>
      </p>
      <div className="rightWarpper">
        <Menu mode="horizontal" onClick={handleClickMenu}>
          <Menu.SubMenu
            style={{ float: 'right' }}
            title={
              <span>
                <Icon type="user" />
                {login.username}
              </span>
            }
          >
            <Menu.Item key="logout">{site.退出}</Menu.Item>
            <Menu.Item key="editPwd">{site.修改密码}</Menu.Item>
            <Menu.Item key="profile">{site.个人资料}</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </div>
    </div>
  );
};

class Actions {
  onChangeEditPwdVisible = (p: any) => ({} as Action);
  onChangeProfileVisible = (p: any) => ({} as Action);

  onChangeLastPathname: (p: any) => Action;
  logout: (p: any) => Action;
}
class States {
  editPwdVisible = false;
  profileVisible = false;

  login: any;
  site: any;
  menusData: any;
}
export default createWith({
  namespace: 'header',
  actions: new Actions(),
  state: new States(),
  props: {
    login: withLogin,
    logout: withLogin,
    site: withLang,
    menusData: withMenus,
    onChangeLastPathname: withMenus,
  },
})(Header as any);

interface HeaderProps extends KeaProps<Actions, States> {
  fullSize?: boolean;
  onChangeFullSize: () => void;
  onChangeOpenKeys: () => void;
  onClickNavMenu: (event: any) => void;

  isNavbar: boolean;
  menuPopoverVisible?: boolean;
  switchMenuPopover?: () => void;

  onChangeEditPwd: () => void;
  onChangeProfile: any;
}

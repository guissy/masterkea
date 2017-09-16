import { BaseState, default as BaseModel } from '../../abstract/BaseModel';
import { MenuItem } from '../../components/menu/Menus.model';
import * as service from './Role.service';
import { withLang } from '../../lang.model';
import createWith from '../../../utils/buildKea';

const model = new BaseModel(
  'role',
  {
    itemName: '',
    detailLoading: true,
    detail: {},
    permission: {},
    editingItem: {},
  },
  service
);
model.addEffect('permission');
model.addEffect('detail');
export const withRole = createWith({
  namespace: model.namespace,
  state: { ...model.state, type: [] },
  actions: model.actions,
  effects: model.effects,
  props: {
    site: withLang,
  },
});

export interface RoleState extends BaseState {
  // list: RoleItem[];
  permission: MenuItem[];
  detail: any;
  detailLoading: boolean;
  permissionLoading: boolean;
}

export interface RoleItem {
  id: number; // "int(require) #id",
  role: string; // "string(require) #角色",
  num: string; // "string(require) #人数",
  created: string; // "string(require) #建立时间",
  creator: string; // "string(require) #建立人"
}

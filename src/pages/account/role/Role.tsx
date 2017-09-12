import { Form } from 'antd';
import * as React from 'react';
import BasePage, { BasePageConfig, BasePageProps } from '../../abstract/BasePage';
import RoleEdit from './Role.edit';
import { withRole } from './Role.model';

@withRole
class Role extends BasePage<RoleProps, any> {
  constructor(props: RoleProps) {
    const config: BasePageConfig = {
      ns: 'role',
      createComponent: null,
      updateComponent: null,
      withStatus: false,
      columns: [
        {
          title: '角色',
          dataIndex: 'role',
          canForm: true,
        },
        {
          title: '人数',
          dataIndex: 'num',
        },
        {
          title: '建立时间',
          dataIndex: 'created',
        },
        {
          title: '建立人',
          dataIndex: 'creator',
        },
      ],
      searchs: [],
    };
    super(props, config);
    this.createComponent = this.getCreateComponent.bind(this);
    this.updateComponent = this.getUpdateComponent.bind(this);
  }

  public componentDidMount() {
    super.componentDidMount();
    this.props.dispatch({
      type: 'role/query',
    });
  }

  protected getCreateComponent() {
    const { permissionLoading } = this.props;
    return <RoleEdit saving={permissionLoading} onSuccess={this.onOkAdd} />;
  }

  protected getUpdateComponent() {
    const { permissionLoading } = this.props;
    return <RoleEdit editingItem={this.state.editingItem} saving={permissionLoading} onSuccess={this.onOkEdit} />;
  }
}

export default Form.create()(Role);

export interface RoleProps extends BasePageProps {
  permissionLoading: boolean;
}

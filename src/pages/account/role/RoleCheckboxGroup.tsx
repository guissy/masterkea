import { Checkbox } from 'antd';
import * as React from 'react';
import { MenuItem } from '../../components/menu/Menus.model';
import * as styles from './RoleCheckboxGroup.less';

export default class RoleCheckboxGroup extends React.PureComponent<RoleCheckboxGroupProps, any> {
  constructor(props: RoleCheckboxGroupProps) {
    super(props);
    this.state = this.getCheckedState(props);
  }

  public componentWillReceiveProps(nextProps: Readonly<RoleCheckboxGroupProps>, nextContext: any): void {
    this.setState(this.getCheckedState(nextProps));
  }

  public render() {
    const plainOptions = this.props.plainOptions;
    return (
      <div className={styles.group}>
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            {plainOptions.name}
          </Checkbox>
        </div>
        <Checkbox.Group
          options={plainOptions.children.map((v: MenuItem) => ({ label: v.name, value: String(v.id) }))}
          value={this.state.checkedList}
          onChange={this.onChange}
        />
      </div>
    );
  }

  private onChange = (checkedList: any[]) => {
    const indeterminate = !!checkedList.length && checkedList.length < this.props.plainOptions.children.length;
    this.setState({
      checkedList,
      indeterminate,
      checkAll: checkedList.length === this.props.plainOptions.children.length,
    });
    this.props.onChange(this.props.plainOptions.id, checkedList);
  };

  private onCheckAllChange = (e: React.FormEvent<any>) => {
    const checked = (e.target as any).checked;
    const checkedList = checked ? this.props.plainOptions.children.map((v: MenuItem) => String(v.id)) : [];
    this.setState({
      checkedList,
      indeterminate: false,
      checkAll: checked,
    });
    this.props.onChange(this.props.plainOptions.id, checkedList);
  };

  private getCheckedState({ value, plainOptions }: { value: any[]; plainOptions: MenuItem }) {
    if (Array.isArray(value) && plainOptions.children.length > 0) {
      const isAll = value.length === plainOptions.children.length;
      const indeterminate = !!value.length && value.length < plainOptions.children.length;
      return {
        indeterminate,
        checkAll: isAll,
        checkedList: isAll
          ? this.props.plainOptions.children.map((v: MenuItem) => String(v.id))
          : value.map(v => String(v)),
      };
    } else {
      return {
        indeterminate: false,
        checkAll: false,
        checkedList: [],
      };
    }
  }
}

interface RoleCheckboxGroupProps {
  plainOptions: any;
  value: string[]; // id数组
  onChange: (id: number, value: string[]) => void;
}

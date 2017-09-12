import { Checkbox } from 'antd';
import * as React from 'react';
import { MenuItem } from '../../components/menu/Menus.model';
import RoleCheckboxGroup from './RoleCheckboxGroup';
import * as styles from './RoleCheckboxGroup.less';

export default class RoleCheckboxRoot extends React.PureComponent<RoleCheckboxRootProps, any> {
  constructor(props: RoleCheckboxRootProps) {
    super(props);
    this.state = this.getCheckedState(props.value);
  }

  public componentWillReceiveProps(nextProps: Readonly<RoleCheckboxRootProps>, nextContext: any): void {
    this.setState(this.getCheckedState(nextProps.value));
  }

  public render() {
    return (
      <div>
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            {this.props.plainOptions.name}
          </Checkbox>
        </div>
        {this.props.plainOptions.children.map(item => {
          return item.children.length > 0
            ? <RoleCheckboxGroup
                key={item.id}
                plainOptions={item}
                value={this.state.checkedList.get(item.id)}
                onChange={this.onChange}
              />
            : <Checkbox
                key={item.id}
                className={styles.group}
                onChange={e => this.onChangeOnlyOne(item.id, (e.target as any).checked)}
                checked={this.state.checkedList.has(item.id)}
              >
                {item.name}
              </Checkbox>;
        })}
      </div>
    );
  }

  private onChange = (id: number, checkedListSub: string[]) => {
    const checkedList: Map<any, any> = new Map(this.state.checkedList);
    checkedList.set(id, checkedListSub);
    if (checkedListSub.length > 0) {
      checkedList.set(id, checkedListSub);
    } else {
      checkedList.delete(id);
    }
    const state = this.getCheckedState(checkedList);
    this.setState(state);
    this.props.onChange(state.checkedList);
  };

  private onChangeOnlyOne = (id: number, checked: string[]) => {
    const checkedList = new Map(this.state.checkedList);
    if (checked) {
      checkedList.set(id, []);
    } else {
      checkedList.delete(id);
    }
    const state = this.getCheckedState(checkedList as any);
    this.setState(state);
    this.props.onChange(state.checkedList);
  };

  private onCheckAllChange = (e: React.FormEvent<any>) => {
    const checkedList = new Map();
    const checked = (e.target as any).checked;
    if (checked) {
      this.props.plainOptions.children.forEach((v: MenuItem) => {
        checkedList.set(v.id, v.children.map(w => String(w.id)));
      });
    } else {
      checkedList.clear();
    }
    const state = this.getCheckedState(checkedList);
    this.setState(state);
    this.props.onChange(state.checkedList);
  };

  private arrayToMap(role: MenuItem[]) {
    if (role && role.length > 0) {
      const arr = role.map(w => [w.id, w.children.map(i => i.id)]);
      return new Map(arr as any);
    } else {
      return new Map();
    }
  }

  private getCheckedState(role: Map<number, string[]> | any[]) {
    const checkedList = role instanceof Map ? role : this.arrayToMap(role);
    const s1 = Array.from(checkedList.values()).reduce((s, v) => (s += v['length']), 0); // tslint:disable-line
    const s2 = this.props.plainOptions.children.reduce((s, v) => (s += v.children.length), 0); // tslint:disable-line
    // 一级没有chilren
    const onlyOne = this.props.plainOptions.children
      .filter(v => v.children && v.children.length === 0)
      .every(v => checkedList.has(v.id));
    return {
      checkedList,
      indeterminate: !!checkedList.size && (s1 !== s2 || !onlyOne),
      checkAll: s1 === s2 && onlyOne,
    };
  }
}

interface RoleCheckboxRootProps {
  plainOptions: MenuItem;
  onChange?: (checkedList: any) => void;
  value?: MenuItem[];
}

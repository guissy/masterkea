import * as React from 'react';
import { DataSource, FormType, SearchColumn } from './BasePage';

export default function getDataSourceMap(this: React.PureComponent<any, any>, fields: SearchColumn[] = []) {
  const dataSourceMap = new Map<string, DataSource[]>();
  fields.forEach(({ dataIndex, dataSource, formType, initialValue }) => {
    // 外部数据集
    if (dataSource instanceof Promise) {
      dataSource.then(({ list }) => {
        const dataSourceMap2 = new Map(this.state.dataSourceMap);
        if (initialValue) {
          // 全部 or 其他默认值
          if (initialValue === '全部') {
            list.unshift({ title: initialValue, value: initialValue });
          }
        }
        dataSourceMap2.set(dataIndex, list);
        this.setState({ dataSourceMap: dataSourceMap2 });
      });
      dataSourceMap.set(dataIndex, []); // 默认值，防异常
    } else if (Array.isArray(dataSource)) {
      if (initialValue) {
        dataSource.unshift({ title: initialValue, value: initialValue });
      }
      dataSourceMap.set(dataIndex, dataSource);
    } else if (
      formType === FormType.Radio ||
      formType === FormType.RadioButton ||
      formType === FormType.Checkbox ||
      formType === FormType.Select
    ) {
      dataSourceMap.set(dataIndex, []); // 默认值，防异常
    }
  });
  return dataSourceMap;
}

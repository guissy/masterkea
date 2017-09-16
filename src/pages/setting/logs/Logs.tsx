import * as React from 'react';
import { Form } from 'antd';
import { datetime } from '../../../utils/date';
import BasePage, { BasePageConfig, BasePageProps, FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { withLogs } from './Logs.model';

@Form.create()
@withLogs
export default class Logs extends BasePage<LogsProps, any> {
  constructor(props: LogsProps) {
    const config: BasePageConfig = {
      ns: 'logs',
      createComponent: SimpleEdit,
      updateComponent: SimpleEdit,
      withOperator: false,
      withStatus: false,
      canCreate: false,
      columns: [
        {
          title: '记录编号',
          dataIndex: 'id',
        },
        {
          title: '操作者',
          dataIndex: 'created_uname',
        },
        {
          title: '操作类型',
          dataIndex: 'op_type',
        },
        {
          title: '操作IP',
          dataIndex: 'ip',
        },
        {
          title: '操作时间',
          dataIndex: 'created',
          render: (text: any) => datetime(text),
        },
        {
          title: '结果',
          dataIndex: 'result',
        },
        {
          title: '详细信息',
          dataIndex: 'remark',
        },
      ],
      searchs: [
        {
          title: '操作者',
          dataIndex: 'op_user',
        },
        {
          title: '操作IP',
          dataIndex: 'ip',
        },
        {
          title: '操作类型',
          dataIndex: 'op_type',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: [
            {
              title: '新增',
              value: 'add',
            },
            {
              title: '删除',
              value: 'delete',
            },
            {
              title: '修改',
              value: 'update',
            },
            {
              title: '审核',
              value: 'check',
            },
            {
              title: '登录',
              value: 'login',
            },
            {
              title: '登出',
              value: 'logout',
            },
          ],
        },
        {
          title: '结果',
          dataIndex: 'result',
          formType: FormType.Select,
          initialValue: '全部',
          dataSource: [
            {
              title: '成功',
              value: 'success',
            },
            {
              title: '失败',
              value: 'fail',
            },
          ],
        },
        {
          title: '操作时间',
          dataIndex: 'date_from,date_to',
          formType: FormType.DateRange,
        },
      ],
    };
    super(props, config);
  }
}

export interface LogsProps extends BasePageProps {}

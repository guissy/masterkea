import { Modal, Table, Tag } from 'antd';
import * as React from 'react';
import buildRowKey from '../../../utils/buildRowKey';
import * as styles from './Operation.less';

function renderSpan(rows: any, value: any, row: any, index: number) {
  return {
    children: value,
    props: index === 0 ? { rowSpan: rows } : { colSpan: 0 },
  };
}
function renderSpanStatus(rows: any, value: any, row: any, index: number) {
  return {
    children: <Tag color={value === 1 ? '#87d068' : '#f50'}>{value === 1 ? '已支付' : '未支付'}</Tag>,
    props: index === 0 ? { rowSpan: rows } : { colSpan: 0 },
  };
}

export default class OperationDetail extends React.PureComponent<OperationDetailProps, any> {
  constructor(props: OperationDetailProps) {
    super(props);
  }

  public render() {
    const { data } = this.props;
    return (
      <Modal
        title="交收明细"
        onCancel={this.props.onClose}
        onOk={this.props.onClose}
        okText="关闭"
        visible={this.props.visibleDetail}
        wrapClassName={styles.detail}
        width={1000}
      >
        <Table
          bordered={true}
          columns={this.parseColumns(data)}
          dataSource={this.parseItem(data)}
          rowKey={buildRowKey}
          pagination={false}
        />
      </Modal>
    );
  }

  private parseColumns(data: OperationDetailData): any[] {
    const n = (data && data.items && data.items.length) || 1;
    return [
      { title: '厅主账号', dataIndex: 'company_account', render: renderSpan.bind(this, n) },
      { title: '期数', dataIndex: 'period_number', render: renderSpan.bind(this, n) },
      { title: '游戏平台', dataIndex: 'game_type' },
      { title: '游戏毛利润', dataIndex: 'gross_profit' },
      {
        title: '游戏占成',
        dataIndex: 'proportion',
        render: (text: any) => <span>{text}%</span>,
      },
      { title: '游戏应收款', dataIndex: 'received' },
      { title: '游戏总应收', dataIndex: 'game_cost', render: renderSpan.bind(this, n) },
      { title: '包底', dataIndex: 'min_cost', render: renderSpan.bind(this, n) },
      { title: '包网费用', dataIndex: 'packet_cost', render: renderSpan.bind(this, n) },
      { title: '购服务费用', dataIndex: 'line_cost', render: renderSpan.bind(this, n) },
      { title: '实收款', dataIndex: 'receipts', render: renderSpan.bind(this, n) },
      { title: '状态', dataIndex: 'status', render: renderSpanStatus.bind(this, n) },
    ];
  }

  private parseItem(data: OperationDetailData): any[] {
    return data && data.items
      ? data.items.map(gameItem => ({
          ...data.info,
          ...gameItem,
        }))
      : [];
  }
}

interface OperationDetailProps {
  data: OperationDetailData;
  visibleDetail: boolean;
  onClose: () => void;
}

interface OperationDetailData {
  info: {
    id: string; // int(required) #id",
    company_account: string; // string(required) #厅主账号",
    period_number: string; // int(required) #期数",
    game_cost: string; // int(required) #游戏应总收",
    packet_cost: string; // int(required) #包网费用",
    line_cost: string; // int(required) #购服务费用",
    min_cost: string; // int(required) #包底",
    receipts: string; // int(required) #实收账款",
    status: string; // int(required) #付款状态(1:已付款,0:未付款)"
  };
  items: GameItem[];
}

interface GameItem {
  game_type: string; // string(required) #游戏平台",
  gross_profit: string; // int(required) #游戏毛利润",
  proportion: string; // int(required) #游戏占成",
  received: string; // int(required) #游戏应收款"
}

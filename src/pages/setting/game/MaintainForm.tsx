import { Form, Modal } from 'antd';
import { FormComponentProps, WrappedFormUtils } from 'antd/es/form/Form';
import * as React from 'react';
import { Dispatch } from 'react-redux';
import { FormType } from '../../abstract/BasePage';
import SimpleEdit from '../../abstract/SimpleEdit';
import { kea } from 'kea';
import { withGame } from './Game.model';

class MaintainForm extends React.PureComponent<MaintainFormProps, any> {
  constructor(props: MaintainFormProps) {
    super(props);
  }

  public render() {
    return (
      <Modal
        key={'maintain' + this.props.id}
        title="游戏维护"
        visible={this.props.visible}
        onCancel={this.onCancel}
        footer={null}
        width={800}
        className="e2e-maintain"
      >
        <SimpleEdit
          loading={false}
          editingItem={{ id: this.props.id }}
          saving={false}
          fields={[
            {
              title: '维护开始时间',
              formType: FormType.DatePicker,
              dataIndex: 'start_time',
            },
            {
              title: '维护结束时间',
              formType: FormType.DatePicker,
              dataIndex: 'end_time',
            },
            {
              title: '前台维护提示信息',
              formType: FormType.TextArea,
              dataIndex: 'tips',
            },
          ]}
          ns="game"
          effect="maintain"
          okText="提交"
          onSuccess={this.onSuccess}
        />
      </Modal>
    );
  }

  private onSuccess = () => {
    this.hide();
  };

  private onCancel = () => {
    this.hide();
  };

  private hide = () => {
    this.props.dispatch({
      type: 'game/statusSuccess',
      payload: {
        maintainVisible: false,
      },
    });
  };
}

export default Form.create()(MaintainForm as any)

interface MaintainFormProps {
  id?: any;
  dispatch?: Dispatch<any>;
  form?: WrappedFormUtils;
  visible: boolean;
}

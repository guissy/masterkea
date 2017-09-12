import { Button, Form, Icon } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import * as React from 'react';
import * as styles from './Hall.less';
import SelectAll from './SelectAll';
import { GameCategory, GameCategoryName } from './Hall';
import { connect, kea } from 'kea';
import { withHall } from './Hall.model';

@connect({
    props: [withHall, ['hallGameLoading', 'hallGame', 'saving']],
  })
class GameEdit extends React.PureComponent<GameFormProps, any> {
  constructor(props: GameFormProps) {
    super(props);
  }

  public render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { getFieldDecorator } = this.props.form;
    const { hallGameLoading, hallGame, saving } = this.props.hall as any;
    const options: GameCategoryName = { lottery: [], live: [], game: [], sports: [] };
    const values: GameCategoryName = { lottery: [], live: [], game: [], sports: [] };

    if (hallGame) {
      ['lottery', 'live', 'game', 'sports'].forEach((key: keyof GameCategory) => {
        options[key] = hallGame[key].map((item:any) => item.name);
        values[key] = hallGame[key].filter((item:any) => item.checked).map((item:any) => item.name);
      });
    }
    return (
      <div>
        {!hallGameLoading && hallGame
          ? <Form layout="horizontal" onSubmit={this.onSubmit}>
              <Form.Item label="彩票游戏" {...formItemLayout}>
                {getFieldDecorator('lottery', {
                  initialValue: values.lottery,
                })(<SelectAll options={options.lottery} />)}
              </Form.Item>
              <Form.Item label="视讯平台" {...formItemLayout}>
                {getFieldDecorator('live', {
                  initialValue: values.live,
                })(<SelectAll options={options.live} />)}
              </Form.Item>
              <Form.Item label="电子平台" {...formItemLayout}>
                {getFieldDecorator('game', {
                  initialValue: values.game,
                })(<SelectAll options={options.game} />)}
              </Form.Item>
              <Form.Item label="体育" {...formItemLayout}>
                {getFieldDecorator('sports', {
                  initialValue: values.sports,
                })(<SelectAll options={options.sports} />)}
              </Form.Item>
              <Form.Item className={styles.submit}>
                <Button type="primary" htmlType="submit" size="large" disabled={saving}>
                  {saving && <Icon type="loading" />}
                  提交
                </Button>
              </Form.Item>
            </Form>
          : <div>loading</div>}
      </div>
    );
  }

  private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { hallGame, info } = this.props.hall;
    this.props.form.validateFields((err, values: GameCategoryName) => {
      if (!err) {
        // values 是 { lottery: ['快三'] } 的数组，
        // 在 hallGame['lottery'] 中 的 找到 name 为 '快三' 的 item 对象
        // 添加此item对象(包含 id,name,game_type，不要 checked）
        const list = Object.entries(values)
          .map(([key, value]: [keyof GameCategory, string[]]) =>
            value
              .map(name => hallGame[key].find((v: any) => v.name === name))
              .map(item => ({ id: item.id, name: item.name, game_type: item.game_type }))
          )
          .reduce((all, items) => all.concat(items), []);
        this.props
          .dispatch({
            type: 'hall/saveHallGame',
            payload: {
              list,
              hall_id: info.id,
            },
            promise: true,
          })
          .then(() => {
            this.props.onSuccess();
          });
      }
    });
  };
}

export default Form.create()(GameEdit as any);

interface GameFormProps extends ReduxProps {
  hall?: any;
  form?: WrappedFormUtils;
  onSuccess: () => void;
}

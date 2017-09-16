import { Button, Modal } from 'antd';

import * as React from 'react';
import { Store } from '../../abstract/BaseModel';
import * as styles from './Review.less';
import { ReviewState, withReview } from './Review.model';
import ReviewTag from './Review.tag';

@withReview
export default class ReviewDetail extends React.PureComponent<ReviewDetailProps, any> {
  constructor(props: ReviewDetailProps) {
    super(props);
    this.state = {};
  }
  public render() {
    const { data, onStatus, review } = this.props;
    const info = { ...data, ...review.info };
    return (
      <Modal
        title="内容审核"
        onCancel={this.props.onClose}
        onOk={this.props.onClose}
        okText="关闭"
        visible={this.props.visibleDetail}
        wrapClassName={styles.detail}
        width={720}
      >
        <div>
          <div className={styles.bar}>
            <span>
              厅主 <strong>{info.company_account}</strong> 申请修改的内容
            </span>
            <span className={styles.time}>申请时间 {info.apply_time}</span>
          </div>
          <div className={styles.content}>{info.content}</div>
          <div className={styles.process}>
            <div className={styles.state}>
              <span>
                {' '}
                <ReviewTag val={info.status} />{' '}
              </span>
            </div>
            <div className={styles.btns}>
              <Button onClick={() => onStatus(info.id, 'pass')} disabled={info.status === 'pass'}>
                通过
              </Button>
              <Button onClick={() => onStatus(info.id, 'rejected')} disabled={info.status === 'rejected'}>
                拒绝
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

interface ReviewDetailProps extends ReduxProps {
  data: any;
  visibleDetail: boolean;
  onClose: () => void;
  onStatus: (id: number, status: string) => void;
  review?: ReviewState;
}

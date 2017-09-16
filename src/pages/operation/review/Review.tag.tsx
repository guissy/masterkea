import { Tag } from 'antd';
import * as React from 'react';

// tslint:disable-next-line
const ReviewTag: React.SFC<ReviewTagProps> = ({ val }) => {
  let elm;
  switch (val) {
    case 'pass':
      elm = <Tag color="#87d068">已通过</Tag>;
      break;
    case 'rejected':
      elm = <Tag color="#f50">已拒绝</Tag>;
      break;
    default:
      elm = <Tag color="#888">审核中</Tag>;
      break;
  }
  return elm;
};

interface ReviewTagProps {
  val: string;
}
export default ReviewTag;

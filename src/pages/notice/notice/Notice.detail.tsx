import * as React from 'react';

export default class NoticeDetail extends React.PureComponent<NoticeDetailProps, any> {
  constructor(props: NoticeDetailProps) {
    super(props);
    this.state = {};
  }
  public render() {
    const { title, content } = this.props.viewItem;
    return (
      <div>
        <div>{title}</div>
        <div>{content}</div>
      </div>
    );
  }
}

interface NoticeDetailProps {
  viewItem: any;
}

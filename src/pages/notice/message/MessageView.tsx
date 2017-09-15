import * as React from 'react';

export default class MessageView extends React.PureComponent<MessageViewProps, any> {
  constructor(props: MessageViewProps) {
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

interface MessageViewProps {
  viewItem: any;
}

import * as React from 'react';

export default class Stage extends React.PureComponent<StageProps, any> {
  constructor(props: StageProps) {
    super(props);
    this.state = {};
  }
  public render() {
    return <div>Stage Works!</div>;
  }
}

interface StageProps {}

import * as React from 'react';

export default class Thirdgame extends React.PureComponent<ThirdgameProps, any> {
  constructor(props: ThirdgameProps) {
    super(props);
    this.state = {};
  }
  public render() {
    return <div>Thirdgame Works!</div>;
  }
}

interface ThirdgameProps {}

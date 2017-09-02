import * as React from 'react';

export default class Result extends React.PureComponent<ResultProps, any> {
  constructor(props: ResultProps) {
    super(props);
    this.state = {};
  }
  public render() {
    return <div>Result Works!</div>;
  }
}

interface ResultProps {}

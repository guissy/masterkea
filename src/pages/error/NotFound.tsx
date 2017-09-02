import { Icon } from 'antd';
import * as React from 'react';
import { kea } from "kea";
// import * as styles from './NotFound.less';

// tslint:disable-next-line variable-name
const NotFound = () =>
  <div className="content-inner">
    <div className="ok">
      <Icon type="frown-o" />
      <h1>404 Not Found</h1>
    </div>
  </div>;

export default kea({ path: () => ['scenes', '404'] })(NotFound);

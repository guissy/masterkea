import { Action, AnyAction } from 'redux';
interface PayloadAction extends Action {
  type?: any;
  payload?: any;
}
// interface PromiseAction extends PayloadAction {
  // promise?: string | true; // 用于标记区分不同的Promise
// }
declare global {
  export interface ReduxProps {
    // dispatch?: (action: Action | PayloadAction) => void;
    dispatch?: (action: PayloadAction) => Promise<any>;
  }
  // 平台没有资源站，即没有上传功能
  interface Window {
    defaultSelectedKeys: string[];
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    devToolsExtension: any;
    __keaPrerender: any;
    settings: {
      api: {
        url: string;
        ssl: boolean;
        version: number;
      },
      site: {
        title: string;
        theme: string;
        lang: string;
        copyright: string;
        favicon: string;
        logo: string;
      },
      link: {
        www: string;
        mobile: string;
        assets: string;
        agent: string
      },
      logo: {
        normal: string;
        small: string;
        medium: string;
        large: string;
      }
    }
  }
}


declare module 'antd/es/form/Form' {
  export interface WrappedFormUtils {
    form?: WrappedFormUtils;
  }
}
// import * as appLocaleDataZh from 'react-intl/locale-data/zh';
// import { EffectsCommandMap, SubscriptionAPI } from 'dva';
import * as queryString from 'querystring';
// import { DvaAction } from '../../typings/dva';
import { IntlXlz } from '../../typings/intl';
import zh from '../locale/zh-CN';
import { kea, KeaOption } from 'kea';
import * as PropTypes from 'prop-types';
// import { AjaxState, Result } from '../utils/Result';
// import { langAjax, listAjax } from './lang.service';

const queryFirst: { locale: string } = queryString.parse(location.search) as any;
// addLocaleData(appLocaleDataZh);
const defaultLocale = queryFirst.locale || window.localStorage.getItem('locale') || 'zh-CN';
if (queryFirst.locale !== defaultLocale) {
  // history.replaceState(null, document.title, `?locale=${defaultLocale}`);
}
export default {
  namespace: 'lang',
  state: {
    loading: Boolean(defaultLocale !== 'zh-CN'),
    locale: defaultLocale,
    defaultLocale: 'en',
    antd: null,
    localeList: [
      'zh-CN',
      'zh-HK',
      'en-US',
      'vi-VN',
      'th-TH',
      'ko-KR',
      'ms-MY',
      'ja-JP',
      'km-KM',
      'id-ID',
      'mm-MM',
      'en-PH',
      'es-ES',
      'de-DE',
      'it-IT',
      'pt-PT',
      'da-DK',
      'se-SE',
      'nb-NO',
      'bg-BG',
      'el-GR',
      'pl-PL',
      'ro-RO',
      'cs-CZ',
      'hu-HU',
      'sk-SK',
      'pl-PL',
    ],
    languageList: [
      { name: '中文简体', code_name: 'zh-CN', pic: '/assets/index/flag/CN.png' },
      { name: '中文繁体', code_name: 'zh-HK', pic: '/assets/index/flag/HK.png' },
      { name: 'English', code_name: 'en-US', pic: '/assets/index/flag/US.png' },
      { name: '越南', code_name: 'vi-VN', pic: '/assets/index/flag/VN.png' },
      { name: '泰语', code_name: 'th-TH', pic: '/assets/index/flag/TH.png' },
      { name: '韩语', code_name: 'ko-KR', pic: '/assets/index/flag/KR.png' },
      { name: '马来语', code_name: 'ms-MY', pic: '/assets/index/flag/MY.png' },
      { name: '日语', code_name: 'ja-JP', pic: '/assets/index/flag/JP.png' },
      { name: '高棉语', code_name: 'km-KM', pic: '/assets/index/flag/KM.png' },
      { name: '印尼', code_name: 'id-ID', pic: '/assets/index/flag/ID.png' },
      { name: '缅甸', code_name: 'mm-MM', pic: '/assets/index/flag/MM.png' },
      { name: '菲律宾', code_name: 'en-PH', pic: '/assets/index/flag/PH.png' },
      { name: '西班牙', code_name: 'es-ES', pic: '/assets/index/flag/ES.png' },
      { name: '德语', code_name: 'de-DE', pic: '/assets/index/flag/DE.png' },
      { name: '意大利', code_name: 'it-IT', pic: '/assets/index/flag/IT.png' },
      { name: '葡萄牙', code_name: 'pt-PT', pic: '/assets/index/flag/PT.png' },
      { name: '丹麦', code_name: 'da-DK', pic: '/assets/index/flag/DK.png' },
      { name: '瑞典', code_name: 'se-SE', pic: '/assets/index/flag/SE.png' },
      { name: '挪威', code_name: 'nb-NO', pic: '/assets/index/flag/NO.png' },
      { name: '保加利亚语', code_name: 'bg-BG', pic: '/assets/index/flag/BG.png' },
      { name: '希腊语', code_name: 'el-GR', pic: '/assets/index/flag/GR.png' },
      { name: '波兰语', code_name: 'pl-PL', pic: '/assets/index/flag/PL.png' },
      { name: '罗马尼亚', code_name: 'ro-RO', pic: '/assets/index/flag/RO.png' },
      { name: '捷克', code_name: 'cs-CZ', pic: '/assets/index/flag/CZ.png' },
      { name: '匈牙利', code_name: 'hu-HU', pic: '/assets/index/flag/HU.png' },
      { name: '斯洛伐克语', code_name: 'sk-SK', pic: '/assets/index/flag/SK.png' },
      { name: '荷兰', code_name: 'pl-PL', pic: '/assets/index/flag/nl-NL.png' },
      { name: 'English', code_name: 'en-US', pic: '/assets/index/flag/US.png' },
    ],

    site: zh,
  },
  subscriptions: {
    setup({ history, dispatch }: any) {
      dispatch({ type: 'list' });
      if (defaultLocale !== 'zh-CN') {
        dispatch({ type: 'load', payload: { locale: defaultLocale } });
      }
      // history.listen((location: H.Location) => {
      //   const locale = window.localStorage.getItem('locale');
      //   const query:{locale: string} = location.query as any;
      //   if (!query.locale) {
      //     query.locale = locale;
      //     history.replace(location);
      //   }
      // });
    },
  },
  effects: {
    // *list({ payload }: DvaAction, { call, put, select }: EffectsCommandMap) {
    //   const result: Result = yield call(listAjax);
    //   if (result && result.state === AjaxState.成功) {
    //     yield put({ type: 'listSuccess', payload: { languageList: result.data } });
    //   }
    // },
    // *load({ payload }: DvaAction, { call, put, take }: EffectsCommandMap) {
    //   const locale = payload.locale;
    //   const langs = yield call(langAjax, locale);
    //   // const langKey = locale.split('-').shift();
    //   const messages = langs[locale];
    //   if (Array.isArray(messages)) {
    //     // 根据数组顺序对应key顺序，一一对应
    //     const site: IntlXlz & { [key: string]: string } = {} as any;
    //     Object.keys(zh).forEach((key: string, i: number) => (site[key] = messages[i]));
    //     window.localStorage.setItem('locale', locale);
    //     yield put({
    //       type: 'changeSuccess',
    //       payload: {
    //         locale,
    //         site,
    //         loading: false,
    //       },
    //     });
    //     if (defaultLocale !== locale) {
    //       const query: { locale: string } = queryString.parse(location.search) as any;
    //       window.location.href = location.pathname + '?' + queryString.stringify({ ...query, locale });
    //     }
    //   }
    // },
    // *change({ payload }: DvaAction, { call, put, take }: EffectsCommandMap) {
    //   const locale = payload.locale;
    //   // 不知道 antd 的modal会不会更新
    //   // yield put(routerRedux.replace({query: {locale}}));
    //   yield put({ type: 'load', payload: { locale } });
    // },
  },
  reducers: {
    // listSuccess: (state: LangState, { payload }: DvaAction) => ({ ...state, ...payload }),
    // changeSuccess: (state: LangState, { payload }: DvaAction) => ({ ...state, ...payload }),
  },
};

export interface LangState {
  loading: boolean;
  locale: string;
  defaultLocale: string;
  antd: string;
  site: IntlXlz;
  // localeList: localeItem[],
  languageList: LanguageItem[];
}
export interface LanguageItem {
  code: string;
  id: string;
  name: string;
  pic: string;
}
export interface LangSiteState {
  site?: IntlXlz;
  skin?: any;
}

export const withLang = kea({
  actions: () => ({
    siteTo: (val: any) => val,
  }),
  reducers: ({ actions }) => ({
    site: [
      zh,
      PropTypes.object,
      {
        [actions.siteTo as any]: (state: any, payload: any) => {
          const { site } = payload;
          return {
            ...state,
            site,
          };
        },
      },
    ],
  }),
} as KeaOption<{ siteTo: any }, null>);

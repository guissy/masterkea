import { Button } from 'antd';
import * as hightLight from 'highlight.js';
import * as marked from 'marked';
import * as React from 'react';
import * as styles from './Webset.less';
import { kea } from 'kea';
import { withWebset } from './Webset.model';
const LOADING_WORDS = 'loading...';

@kea({
  connect: {
    props: [],
    actions: [withWebset, ['manual']],
  },
})
export default class WebsetMarkdown extends React.PureComponent<WebsetMarkdownProps, any> {
  private codes: NodeListOf<HTMLElement>;
  private actions?: any;

  constructor(props: WebsetMarkdownProps) {
    super(props);
    console.log('☞☞☞ 9527 WebsetMarkdown 20', props);
    this.state = {
      md: LOADING_WORDS,
    };
    Promise.resolve()
      .then(() => this.actions.manual({ id: props.id, promise: true }))
      .then(v => {
      this.setState({ md: v.manual });
    });
  }
  public createMarkup2(md: string) {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: (code: string) => hightLight.highlightAuto(code).value,
    });
    return { __html: marked(md) };
  }
  public onCopy(text: string) {
    const textArea = document.createElement('textarea');
    try {
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand('copy');
      if (successful) {
        this.props.dispatch({ type: 'alerts/show', payload: { type: 'success', message: '复制成功' } });
      } else {
        this.props.dispatch({ type: 'alerts/show', payload: { type: 'fail', message: '复制失败' } });
      }
    } catch (err) {
      this.props.dispatch({ type: 'alerts/show', payload: { type: 'fail', message: '复制失败' } });
    } finally {
      document.body.removeChild(textArea);
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<WebsetMarkdownProps>,
    prevState: Readonly<any>,
    prevContext: any
  ): void {
    this.codes = document.querySelectorAll('code[class*="lang-"]') as any;
  }

  public noParenthese(str: string) {
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}');
    return str.substring(start + 1, end - 1);
  }

  public render() {
    const domain = this.props.domain;
    return (
      <div>
        <div className={styles.btns} hidden={this.state.md === LOADING_WORDS}>
          <Button onClick={() => this.onCopy(this.noParenthese(this.codes[0].innerText))}>复制 setting.json</Button>
          <Button onClick={() => this.onCopy(this.codes[1].innerText)}>
            复制 {domain}.php
          </Button>
          <Button onClick={() => this.onCopy(this.codes[2].innerText)}>
            复制 {domain}.js
          </Button>
        </div>
        <div className={styles.mdBox}>
          <div dangerouslySetInnerHTML={this.createMarkup2(this.state.md)} />
        </div>
      </div>
    );
  }
}

interface WebsetMarkdownProps extends ReduxProps {
  domain: string;
  id?: number;
}

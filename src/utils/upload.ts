import environment from './environment';

export const imgHost = environment.host;

// 返回上传图片的选项，用于antd的Upload组件，需要另行配置 action
export function innerOption(url: string, prevUrl: string) {
  if (!(typeof url === 'string' && url.length > 0)) {
    throw new Error('上传地址不能为空');
  }
  let files = [] as any;
  if (prevUrl) {
    files = [
      {
        status: 'done',
        uid: String(Math.round(Math.random() * Math.pow(2, 32))),
        url: imgHost + prevUrl,
      },
    ];
  }
  const token = window.sessionStorage.getItem(environment.tokenName);
  return {
    action: url,
    listType: 'picture' as 'text' | 'picture' | 'picture-card',
    name: 'upfile[]',
    multiple: true,
    // status: 'done',
    defaultFileList: files,
    onChange: ({ fileList }: any) => {
      if (fileList.length > 1 && fileList.every((file: any) => file.status === 'done')) {
        fileList.shift();
      }
    },
    data: {
      post_type: 'upfile',
    },
    headers: { Authorization: `bearer ${token}` },
  };
}

// 图片上传
export function getImageOption(prevUrl = '') {
  const url = environment.upload;
  return innerOption(url + '/web/', prevUrl);
}

/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification,Modal } from 'antd';
import { history } from 'umi';
import { stringify } from 'querystring';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  console.log(response);

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */

const token = () => {
  let accountInfo = localStorage.getItem('accountInfo');
  if(accountInfo == undefined || accountInfo == null || accountInfo == ''){
    return '';
  }
  accountInfo = JSON.parse(accountInfo);
  console.log(accountInfo.accountInfo.token);
  return accountInfo.accountInfo.token;
};
const request = extend({
  errorHandler, // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
  Authorization: 'Bearer ${localStorage.getItem("antd-pro-authority")}',
  params: {
    'token' : token(),
  },
});
request.use(async (ctx, next) => {
  const { req } = ctx;
  const { url, options } = req;

  // 判断是否需要添加前缀，如果是统一添加可通过 prefix、suffix 参数配置
  // if (url.indexOf('/api') !== 0) {
  //   ctx.req.url = `/api/v1/${url}`;
  // }
  // ctx.req.options = {
  //   ...options,
  //   foo: 'foo',
  // };

  await next();

  const { res } = ctx;
  // const { success = false } = res; // 假设返回结果为 : { success: false, errorCode: 'B001' }
  const { status, msg } = res; // 假设返回结果为 : { success: false, errorCode: 'B001' }
  // console.log(status, msg,res); 
  // if(status == 'error' && (msg == 'Expired token' || msg == 'token不存在')){
  //   Modal.info({
  //     title: 'This is a notification message',
  //     content: '身份信息已失效！请重新登陆',
  //     onOk() {
  //       localStorage.clear();
  //       history.replace({
  //         pathname: '/user/login',
  //         search: stringify({
  //           redirect: window.location.href,
  //         }),
  //       });
  //     },
  //   });
  //   return false;
  // }
  // if (!success) {
    // 对异常情况做对应处理
    // if(res.)
  // }
}
);

request.interceptors.response.use(async response => {

  const data = await response.clone().json();

  // console.log(data);
  // 详情返回的response处理

  if(data.code === '500') {

      switch (data.message) {

          case 'systemError':

              console.log(data.message);

              break;



          case 'loginTimeout':

            console.log(data.message);

              // 跳转到login页面

              // history.push('/login');

              break;

      

          default :

              break;

      }

  }

  return response;

});

export default request;

import request from '@/utils/request';

export async function getLogs(params:any){
    // request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/getLogs`, {
        method: 'GET',
        params: params
    });
}

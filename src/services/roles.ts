import request from '@/utils/request';

export async function getRoleInfo(params:any){
    // request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/getRoleInfo`, {
        method: 'GET',
        params: params
    });
}

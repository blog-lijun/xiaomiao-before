import request from '@/utils/request';

export async function getUserLists(params:any){
    // request.extendOptions({params:params});
    console.log(params);
    return request(`http://wylapi.phplijun.cn/api/getUserLists`, {
        method: 'GET',
        params: params
    });
}


export async function getUserInfo(params:any){
    // request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/getUserInfo`, {
        method: 'GET',
        params: params
    });
}


export async function addAccount(params:any){
    // request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/addAccounts`, {
        method: 'POST',
        params: params
    });
}

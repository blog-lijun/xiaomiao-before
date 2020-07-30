import request from '@/utils/request';

export async function getAccountLists(params:any){
    // request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/getAccountsInfo`, {
        method: 'GET',
        params: params
    });
}

export async function getAllAccounts(params:any){
    // request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/getAllAccounts`, {
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


export async function editAccount(params:any){
    // request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/updateAccounts`, {
        method: 'POST',
        params: params
    });
}

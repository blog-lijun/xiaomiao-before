import request from '@/utils/request';

export async function getUserLists(params:any){
    // request.extendOptions({params:params});
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


export async function addUser(params:any){
    // request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/addUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        params: params,
        // requestType: 'form',
    });
}

export async function editUser(params:any){
    // request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/updateUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        params: params,
        // requestType: 'form',
    });
}
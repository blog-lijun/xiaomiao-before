import request from '@/utils/request';

export async function getTreeList(){
    
    return request(`http://wylapi.phplijun.cn/api/getTreeDept`, {
        method: 'GET',
    });
}

export async function getUsers(){
    
    return request(`http://wylapi.phplijun.cn/api/getUserInfo`, {
        method: 'GET',
    });
}


export async function addDept(params:object){
    request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/adddept`, {
        method: 'POST',
    });
}

export async function updateDept(params:object){
    request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/updateDept`, {
        method: 'POST',
    });
}

export async function getDeptInfo(params:object){
    if(params != undefined && 'dept_id' in params){
        request.extendOptions({params:{'dept_id': params.dept_id}});
    }
    return request(`http://wylapi.phplijun.cn/api/getDeptInfo`, {
        method: 'GET',
    });
}


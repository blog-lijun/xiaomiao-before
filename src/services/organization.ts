import request from '@/utils/request';

export async function getTreeList(){
    
    return request(`http://wylapi.phplijun.cn/api/getTreeDept`, {
        method: 'GET',
    });
}

export async function getDeptInfo(params:object){
    request.extendOptions({params:{'dept_id': params.dept_id}});
    return request(`http://wylapi.phplijun.cn/api/getDeptInfo`, {
        method: 'GET',
    });
}


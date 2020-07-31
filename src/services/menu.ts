import request from '@/utils/request';

export async function getMenuData(params:any){
    let accountInfo = localStorage.getItem("accountInfo");
    // let accountInfo = JSON.parse(localStorage.getItem("accountInfo"));
    let id = JSON.parse(accountInfo).accountInfo.id;
    params = {
        user_id:id
    };
    // request.extendOptions({params:params});
    return request(`http://wylapi.phplijun.cn/api/getMenuTreePermission`, {
        method: 'GET',
        params: params
    });
}

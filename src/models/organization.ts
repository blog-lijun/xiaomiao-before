import { getTreeList, getDeptInfo, getUsers,addDept,updateDept } from "@/services/organization";
import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { TagType } from './data.d';

// export interface OrganizationModel是自定义一个数据类型
// 这里使用到的TagTyp是data.d.ts中定义好的数据
export interface OrganizationModel {
  tags: Partial<TagType>;
  dept_info: Partial<TagType>;
  users: Partial<TagType>;
}
// 这里是定义函数类型
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: OrganizationModel) => T) => T },
) => void;

export interface TreeType {
  namespace: "getDept";
  state: OrganizationModel;
  effects: {
    treeList: Effect;
    deptInfo: Effect;
    userInfo: Effect;
    deptAdd: Effect;
    deptEdit: Effect;
  };
  reducers: {
    save: Reducer<OrganizationModel>;
    get: Reducer<OrganizationModel>;
    users_return: Reducer<OrganizationModel>;
  };
}
const Tree: TreeType = {
  namespace: "getDept",
  state: {
    tags: {},
    dept_info: {},
    users: {},
  },

  effects: {
    /**
     * @param payload 参数
     * @param call 执行异步函数调用接口
     * @param put 发出一个 Action，类似于 dispatch 将服务端返回的数据传递给上面的state
     * @returns {IterableIterator<*>}
     */
    *treeList({ payload }, { call, put }) {
      const response = yield call(getTreeList, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "save",
        payload: response
      });
    },
    *deptInfo({ payload, callback }, { call, put }) {
      // const { resolve } = payload;
      const response = yield call(getDeptInfo, payload);
      callback(response); // 返回结果

      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "get",
        payload: response
      });
    },
    *userInfo({ payload }, { call, put }) {
      const response = yield call(getUsers, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "users_return",
        payload: response
      });
    },
    *deptAdd({ payload, callback }, { call, put }) {
      const response = yield call(addDept, payload);
      callback(response);
    },
    *deptEdit({ payload, callback }, { call, put }) {
      console.log(payload);
      const response = yield call(updateDept, payload);
      callback(response);
    },
  },

  reducers: {
    /**
     *
     * @param state
     * @param action
     * @returns {{[p: string]: *}}
     */
    save(state, action) {
      return {
        ...state,
        tags: action.payload
      };
    },
    get(state, action) {
      return {
        ...state,
        dept_info: action.payload
      };
    },
    users_return(state, action) {
      return {
        ...state,
        users: action.payload
      };
    }
  }

}

export default Tree;
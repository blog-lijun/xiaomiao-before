import { AnyAction, Reducer } from 'redux';
import { getUserLists, addAccount, getUserInfo } from '@/services/users';

import { EffectsCommandMap } from 'dva';
import { TagType } from './data.d';

// export interface UsersModelState是自定义一个数据类型
// 这里使用到的TagTyp是data.d.ts中定义好的数据
export interface UsersModelState {
  lists: Partial<TagType>;
}
// 这里是定义函数类型
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: UsersModelState) => T) => T },
) => void;

export interface Users {
  namespace: "users";
  state: UsersModelState;
  effects: {
    getLists: Effect;
    deptInfo: Effect;
    userInfo: Effect;
    accountAdd: Effect;
    deptEdit: Effect;
  };
  reducers: {
    returnLists: Reducer<UsersModelState>;
    get: Reducer<UsersModelState>;
    users_return: Reducer<UsersModelState>;
  };
}
const User: Users = {
  namespace: "users",
  state: {
    lists: {},
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
    *getLists({ payload }, { call, put }) {
      const response = yield call(getUserLists, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "returnLists",
        payload: response
      });
    },
    *deptInfo({ payload, callback }, { call, put }) {
      // const { resolve } = payload;
      const response = yield call(getDeptInfo, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "get",
        payload: response
      });
      callback(response); // 返回结果
    },
    *userInfo({ payload }, { call, put }) {
      const response = yield call(getUserInfo, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "users_return",
        payload: response
      });
    },
    *accountAdd({ payload, callback }, { call, put }) {
      const response = yield call(addAccount, payload);
      callback(response);
    },
    *deptEdit({ payload, callback }, { call, put }) {
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
    returnLists(state, action) {
      return {
        ...state,
        lists: action.payload
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

export default User;
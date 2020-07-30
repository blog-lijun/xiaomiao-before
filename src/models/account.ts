import { AnyAction, Reducer } from 'redux';
import { getAccountLists, addAccount, getUserInfo,editAccount, getAllAccounts } from '@/services/account';

import { EffectsCommandMap } from 'dva';
import { TagType } from './data.d';

// export interface AccountType是自定义一个数据类型
// 这里使用到的TagTyp是data.d.ts中定义好的数据
export interface AccountType {
  lists: Partial<TagType>;
}
// 这里是定义函数类型
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: AccountType) => T) => T },
) => void;

export interface TreeType {
  namespace: "accounts";
  state: AccountType;
  effects: {
    getLists: Effect;
    deptInfo: Effect;
    userInfo: Effect;
    accountAdd: Effect;
    accountEdit: Effect;
    allAccounts: Effect;
  };
  reducers: {
    returnLists: Reducer<AccountType>;
    get: Reducer<AccountType>;
    users_return: Reducer<AccountType>;
    allAccountsReturn: Reducer<AccountType>;
  };
}
const Tree: TreeType = {
  namespace: "accounts",
  state: {
    lists: {},
    dept_info: {},
    users: {},
    allAccounts: {},
  },

  effects: {
    /**
     * @param payload 参数
     * @param call 执行异步函数调用接口
     * @param put 发出一个 Action，类似于 dispatch 将服务端返回的数据传递给上面的state
     * @returns {IterableIterator<*>}
     */
    *getLists({ payload }, { call, put }) {
      const response = yield call(getAccountLists, payload);
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
    *accountEdit({ payload, callback }, { call, put }) {
      const response = yield call(editAccount, payload);
      callback(response);
    },
    *allAccounts({ payload, callback }, { call, put }) {
      const response = yield call(getAllAccounts, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "allAccountsReturn",
        payload: response
      });
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
    },
    allAccountsReturn(state, action) {
      return {
        ...state,
        allAccounts: action.payload
      };
    }
    
  }

}

export default Tree;
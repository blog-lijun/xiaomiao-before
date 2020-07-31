import { AnyAction, Reducer } from 'redux';
import { getUserLists, addUser, getUserInfo, editUser } from '@/services/users';

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
    userInfo: Effect;
    userAdd: Effect;
    userEdit: Effect;
  };
  reducers: {
    returnLists: Reducer<UsersModelState>;
  };
}
const User: Users = {
  namespace: "users",
  state: {
    lists: {},
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
    *userInfo({ payload, callback }, { call, put }) {
      const response = yield call(getUserInfo, payload);
      // yield put({
      //   // 这行对应下面的reducers处理函数名字
      //   type: "users_return",
      //   payload: response
      // });
      callback(response);
    },
    *userAdd({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      callback(response);
    },
    *userEdit({ payload, callback }, { call, put }) {
      const response = yield call(editUser, payload);
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
  }

}

export default User;
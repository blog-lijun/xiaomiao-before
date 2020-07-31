import { AnyAction, Reducer } from 'redux';
import { getLogs } from '@/services/updateLog';

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

export interface updateLogType {
  namespace: "updateLog";
  state: AccountType;
  effects: {
    getLists: Effect;
  };
  reducers: {
    returnLists: Reducer<AccountType>;
  };
}
const updateLog: updateLogType = {
  namespace: "updateLog",
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
    *getLists({ payload,callback }, { call, put }) {
      const response = yield call(getLogs, payload);
      callback(response);
    //   yield put({
    //     // 这行对应下面的reducers处理函数名字
    //     type: "returnLists",
    //     payload: response
    //   });
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

export default updateLog;
import { AnyAction, Reducer } from 'redux';
import { getRoleInfo } from '@/services/roles';

import { EffectsCommandMap } from 'dva';
import { TagType } from './data.d';

// export interface RolesState是自定义一个数据类型
// 这里使用到的TagTyp是data.d.ts中定义好的数据
export interface RolesState {
  lists: Partial<TagType>;
}
// 这里是定义函数类型
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: RolesState) => T) => T },
) => void;

export interface TreeType {
  namespace: "roles";
  state: RolesState;
  effects: {
    getLists: Effect;
  };
  reducers: {
    returnLists: Reducer<RolesState>;
  };
}
const Tree: TreeType = {
  namespace: "roles",
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
      const response = yield call(getRoleInfo, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "returnLists",
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
    }
    
  }

}

export default Tree;
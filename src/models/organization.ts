import { getTreeList,getDeptInfo } from "@/services/organization";
import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { TagType } from './data.d';

// export interface StateType是自定义一个数据类型
// 这里使用到的TagTyp是data.d.ts中定义好的数据
export interface StateType {
  tags: Partial<TagType>;
  dept_info: Partial<TagType>;
}
// 这里是定义函数类型
export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface TreeType {
  namespace: "getDept";
  state: StateType;
  effects: {
      treeList: Effect;
      deptInfo: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    get: Reducer<StateType>;
  };
}
const Tree: TreeType =  {
    namespace: "getDept",
    state: {
        tags: {},
        dept_info: {},
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
        *deptInfo({ payload,callback }, { call, put }) {
          const { resolve } = payload;
          const response = yield call(getDeptInfo, payload);
          yield put({
            // 这行对应下面的reducers处理函数名字
            type: "get",
            payload: response
          });
          callback(response); // 返回结果
      }
    
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
      }
    }

}

export default Tree;
import { AnyAction, Reducer } from 'redux';
import { getMenuData as menuData} from '@/services/menu';

import { EffectsCommandMap,Effect } from 'dva';
// import { TagType } from './data.d';


// 这里是定义函数类型
// export type Effect = (
//   action: AnyAction,
//   effects: EffectsCommandMap & { select: <T>(func: (state: UsersModelState) => T) => T },
// ) => void;

export interface MenuModelType {
  namespace: "menu";
  state: {};
  effects: {
    getMenuData: Effect;
  };
  reducers: {
    getMenuDataInfo: Reducer;
  };

}
const MenuModel: MenuModelType = {
  namespace: "menu",
  state: {
    menuDataItems: {},
  },

  effects: {
    /**
     * @param payload 参数
     * @param call 执行异步函数调用接口
     * @param put 发出一个 Action，类似于 dispatch 将服务端返回的数据传递给上面的state
     * @returns {IterableIterator<*>}
     */
    *getMenuData({ payload }, { call, put }) {
      const response = yield call(menuData, payload);
      yield put({
        // 这行对应下面的reducers处理函数名字
        type: "getMenuDataInfo",
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
    getMenuDataInfo(state, action) {
      return {
        ...state,
        menuDataItems: action.payload
      };
    }
  }
}

export default MenuModel;
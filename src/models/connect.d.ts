import { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { StateType } from './login';

export { GlobalModelState, UserModelState, AccountType, OrganizationModel,RolesState, MenuModel };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    users?: boolean;
    accounts?: boolean;
    getDept?: boolean;
    roles?: boolean;
    menu?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  user: UserModelState;
  login: StateType;
  users: UsersModelState;
  accounts: AccountType;
  getDept: OrganizationModel;
  roles: RolesState;
  menu: MenuModel;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: '欢迎',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: '/admin',
              name: '组织架构',
              icon: 'crown',
              // component: './Admin',
              authority: ['admin'],
              routes: [
                {
                  path: '/admin/organization',
                  name: '组织架构',
                  icon: 'smile',
                  component: './Organization',
                  authority: ['admin'],
                },
                {
                  path: '/admin/sub-page',
                  name: '账户管理',
                  icon: 'smile',
                  component: './Organization/account',
                  authority: ['admin'],
                },
                {
                  path: '/admin/users',
                  name: '用户管理',
                  icon: 'smile',
                  component: './Organization/users',
                  authority: ['admin'],
                },
                {
                  path: '/admin/users',
                  name: '角色管理',
                  icon: 'smile',
                  component: './user/login',
                  authority: ['admin'],
                },
                {
                  path: '/admin/userAdd',
                  name: '新增用户',
                  icon: 'smile',
                  component: './Organization/users/info',
                  authority: ['admin'],
                  hideInMenu: true,
                },
              ],
            },
            {
              name: 'list.table-list',
              icon: 'table',
              path: '/list',
              component: './ListTableList',
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});

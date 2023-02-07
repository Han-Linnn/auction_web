export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/',
    layout: false,
    component: '../layouts/LangLayout',
    routes: [
      {
        path: '/home',
        layout: false,
        routes: [
          {
            path: '/home',
            component: './home/index',
          },
        ]
      },
      {
        path: '/user',
        layout: false,
        routes: [
          {
            path: '/user',
            routes: [
              {
                path: '/user/login',
                component: './user/login',
              },
              {
                path: '/user/account',
                component: './user/account',
              },
            ],
          },
        ],
      },
      {
        path: '/',
        layout: false,
        component: '../layouts/PageLayout',
        routes: [
          {
            path: '/event',
            component: './list/eventList',
          },
          {
            path: '/eventGoods',
            component: './list/eventGoodsList',
          },
          {
            path: '/goods',
            component: './list/goodsList',
          },
          {
            path: '/detail',
            component: './goods/detail',
          },
          {
            path: '/account',
            component: './user/account',
          },
        ],
      }
    ]
  },
  {
    component: './404',
  },
]

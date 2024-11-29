/** When your routing table is too long, you can split it into small modules**/

const Layout = () => import('@/layout/index.vue');

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Charts',
  meta: {
    title: '차트',
    icon: 'chart'
  },
  children: [
    {
      path: 'keyboard',
      component: () => import('@/views/charts/keyboard.vue'),
      name: 'KeyboardChart',
      meta: { title: '키보드 차트', noCache: true }
    },
    {
      path: 'line',
      component: () => import('@/views/charts/line.vue'),
      name: 'LineChart',
      meta: { title: '라인 차트', noCache: true }
    },
    {
      path: 'mix-chart',
      component: () => import('@/views/charts/mix-chart.vue'),
      name: 'MixChart',
      meta: { title: '혼합 차트', noCache: true }
    }
  ]
};

export default chartsRouter;

/** When your routing table is too long, you can split it into small modules **/

const Layout = () => import('@/layout/index.vue');

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table 테이블',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamic-table/index.vue'),
      name: 'DynamicTable',
      meta: { title: '동적 Table' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/table/drag-table.vue'),
      name: 'DragTable',
      meta: { title: '드래그 Table' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inline-edit-table.vue'),
      name: 'InlineEditTable',
      meta: { title: '인라인 편집' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table.vue'),
      name: 'ComplexTable',
      meta: { title: '종합 Table' }
    }
  ]
};
export default tableRouter;

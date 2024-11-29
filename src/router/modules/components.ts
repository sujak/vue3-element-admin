/** When your routing table is too long, you can split it into small modules **/

const Layout = () => import('@/layout/index.vue');

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: '컴포넌트',
    icon: 'component'
  },
  children: [
    {
      path: 'tinymce',
      component: () => import('@/views/components-demo/tinymce.vue'),
      name: 'TinymceDemo',
      meta: { title: '리치 텍스트 편집기' }
    },
    {
      path: 'avatar-upload',
      component: () => import('@/views/components-demo/avatar-upload.vue'),
      name: 'AvatarUploadDemo',
      meta: { title: '아바타 업로드' }
    },
    {
      path: 'dropzone',
      component: () => import('@/views/components-demo/dropzone.vue'),
      name: 'DropzoneDemo',
      meta: { title: '드롭존' }
    },
    {
      path: 'sticky',
      component: () => import('@/views/components-demo/sticky.vue'),
      name: 'StickyDemo',
      meta: { title: '스티키' }
    },
    {
      path: 'count-to',
      component: () => import('@/views/components-demo/count-to.vue'),
      name: 'CountToDemo',
      meta: { title: '카운트 투' }
    },
    {
      path: 'mixin',
      component: () => import('@/views/components-demo/mixin.vue'),
      name: 'ComponentMixinDemo',
      meta: { title: '작은 컴포넌트' }
    },
    {
      path: 'back-to-top',
      component: () => import('@/views/components-demo/back-to-top.vue'),
      name: 'BackToTopDemo',
      meta: { title: '맨 위로' }
    },
    {
      path: 'drag-dialog',
      component: () => import('@/views/components-demo/drag-dialog.vue'),
      name: 'DragDialogDemo',
      meta: { title: '드래그 다이얼로그' }
    },
    {
      path: 'drag-select',
      component: () => import('@/views/components-demo/drag-select.vue'),
      name: 'DragSelectDemo',
      meta: { title: '드래그 셀렉트' }
    }
  ]
};

export default componentsRouter;

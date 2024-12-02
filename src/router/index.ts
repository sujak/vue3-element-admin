import { markRaw } from 'vue';
import { createRouter, createWebHistory } from 'vue-router'; // createWebHashHistory, createWebHistory
import type { Router, RouteRecordRaw, RouteComponent } from 'vue-router';
import { Help as IconHelp } from '@element-plus/icons-vue';
import permissionStore from '../store/modules/permission';

/* Layout */
const Layout = ():RouteComponent => import('@/layout/index.vue');

/* Router Modules */
import componentsRouter from './modules/components';
import chartsRouter from './modules/charts';
import nestedRouter from './modules/nested';
import tableRouter from './modules/table';

/**
 * constantRoutes
 * 권한 요구 사항이 없는 기본 페이지
 * 모든 역할이 접근할 수 있습니다
 *
 * 주의: hidden, alwaysShow 속성 설정이 meta로 이동되었습니다!!!
 */
export const constantRoutes:RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect.vue'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '홈', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index.vue'),
        name: 'Documentation',
        meta: { title: '문서', icon: 'documentation', affix: true }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    redirect: '/guide/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/guide/index.vue'),
        name: 'Guide',
        meta: { title: '가이드', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: { hidden: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index.vue'),
        name: 'Profile',
        meta: { title: '개인 정보', icon: 'user', noCache: true }
      }
    ]
  }
];

/**
 * asyncRoutes
 * 사용자 역할에 따라 동적으로 로드해야 하는 경로
 *
 * 주의: hidden, alwaysShow 속성 설정이 meta로 이동되었습니다!!!
 */
export const asyncRoutes:RouteRecordRaw[] = [
  {
    path: '/authorization',
    component: Layout,
    redirect: '/authorization/department',
    name: 'Authorization',
    meta: {
      alwaysShow: true, // 항상 루트 메뉴를 표시합니다
      title: '권한 관리',
      icon: 'lock',
      roles: ['ADMIN']
    },
    children: [
      {
        path: 'department',
        component: () => import('@/views/Authorization/Department/Department.vue'),
        name: 'Department',
        meta: {
          title: '부서 관리'
        }
      },
      {
        path: 'user',
        component: () => import('@/views/Authorization/User/User.vue'),
        name: 'User',
        meta: {
          title: '사용자 관리'
        }
      },
      // {
      //   path: 'menu',
      //   component: () => import('@/views/Authorization/Menu/Menu.vue'),
      //   name: 'Menu',
      //   meta: {
      //     title: '메뉴 관리'
      //   }
      // },
      // {
      //   path: 'role',
      //   component: () => import('@/views/Authorization/Role/Role.vue'),
      //   name: 'Role',
      //   meta: {
      //     title: '역할 관리'
      //   }
      // }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    name: 'Permission',
    meta: {
      alwaysShow: true, // 항상 루트 메뉴를 표시합니다
      title: '권한 테스트 페이지',
      icon: 'lock',
      roles: ['ADMIN', 'editor'] // 루트 네비게이션에 역할을 설정할 수 있습니다
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: '페이지 권한',
          roles: ['ADMIN'] // 또는 하위 네비게이션에만 역할을 설정할 수 있습니다
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: '지시문 권한'
          // 역할을 설정하지 않으면 이 페이지는 권한이 필요하지 않음을 의미합니다
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role.vue'),
        name: 'RolePermission',
        meta: {
          title: '역할 권한',
          roles: ['ADMIN']
        }
      }
    ]
  },

  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index.vue'),
        name: 'Icons',
        meta: { title: '아이콘', icon: 'icon', noCache: true }
      }
    ]
  },

  // /** 라우팅 맵이 너무 길면 작은 모듈로 나눌 수 있습니다 **/
  componentsRouter,
  chartsRouter,
  nestedRouter,
  tableRouter,

  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: '종합 예제',
      icon: markRaw(IconHelp)
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create.vue'),
        name: 'CreateArticle',
        meta: { title: '기사 작성', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit.vue'),
        name: 'EditArticle',
        meta: { hidden: true, title: '기사 편집', noCache: true, activeMenu: '/example/list' }
      },
      {
        path: 'list',
        component: () => import('@/views/example/list.vue'),
        name: 'ArticleList',
        meta: { title: '기사 목록', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index.vue'),
        name: 'Tab',
        meta: { title: '탭', icon: 'tab' }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: '오류 페이지',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401.vue'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404.vue'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index.vue'),
        name: 'ErrorLog',
        meta: { title: '오류 로그', icon: 'bug' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel.vue'),
        name: 'ExportExcel',
        meta: { title: 'Excel 내보내기' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel.vue'),
        name: 'SelectExcel',
        meta: { title: '선택된 항목 내보내기' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header.vue'),
        name: 'MergeHeader',
        meta: { title: '다중 헤더 내보내기' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel.vue'),
        name: 'UploadExcel',
        meta: { title: 'Excel 업로드' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    name: 'Zip',
    meta: { alwaysShow: true, title: 'Zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index.vue'),
        name: 'ExportZip',
        meta: { title: 'Zip 내보내기' }
      }
    ]
  },

  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index.vue'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download.vue'),
    meta: { hidden: true }
  },

  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index.vue'),
        name: 'Theme',
        meta: { title: '테마', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index.vue'),
        name: 'ClipboardDemo',
        meta: { title: '클립보드', icon: 'clipboard' }
      }
    ]
  },

  {
    path: '/external-link',
    component: Layout,
    children: [
      {
        path: 'https://element-plus.midfar.com',
        meta: { title: '외부 링크', icon: 'link' },
        redirect: ''
      }
    ]
  },

  {
    path: '/my-demo',
    component: Layout,
    name: 'MyDemo',
    meta: {
      title: '내 예제',
      icon: 'component'
    },
    children: [
      {
        path: 'element-demo',
        component: () => import('@/views/mydemo/ElementDemo.vue'),
        name: 'ElementDemo',
        meta: { title: 'Element 예제', icon: 'skill' }
      },
      {
        path: 'store-demo',
        component: () => import('@/views/mydemo/StoreDemo.vue'),
        name: 'StoreDemo',
        meta: { title: 'Store 예제', icon: 'lock' }
      }
    ]
  },

  // 404 페이지는 반드시 마지막에 배치해야 합니다 !!!
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true }}
];

console.log('BASE_URL=', import.meta.env);

const createTheRouter = ():Router => createRouter({
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  // 주의: HTML5 모드를 설정하려면 nginx 설정을 수정해야 합니다. 참고 자료:
  // https://router.vuejs.org/zh/guide/essentials/history-mode.html
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
});

interface RouterPro extends Router {
  matcher: unknown;
}

const router = createTheRouter() as RouterPro;

// 자세한 내용은: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createTheRouter() as RouterPro;
  router.matcher = newRouter.matcher;
  // 권한 라우트 초기화
  const permission = permissionStore();
  permission.resetRoutes();
}

export default router;

import router from './router';
import userStore from './store/modules/user';
import permissionStore from './store/modules/permission';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/auth-redirect'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);

  const store = userStore();
  const isAuthenticated = store.isLoggedIn;

  if (isAuthenticated) {
    if (to.path === '/login') {
      NProgress.done();
      next({ path: '/' });
      return;
    }

    try {
      // 항상 최신 사용자 정보 조회
      const userInfo = await store.getInfo();

      // 라우트 생성 여부 확인
      const permission = permissionStore();
      if (!permission.isRoutesGenerated) {
        const accessRoutes = await permission.generateRoutes(userInfo.roles);
        accessRoutes.forEach(route => router.addRoute(route));

        // 현재 페이지로 리다이렉트 (라우트 추가 후)
        next({ ...to, replace: true });
      } else {
        next();
      }
    } catch (error) {
      await store.clearAuth();
      ElMessage.error(error.message || '인증 오류가 발생했습니다');
      NProgress.done();
      next(`/login?redirect=${to.path}`);
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      NProgress.done();
      next(`/login?redirect=${to.path}`);
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
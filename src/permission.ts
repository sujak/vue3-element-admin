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
  const isAuthenticated = store.isLoggedIn; // 새로 추가된 getter 사용

  if (isAuthenticated) {
    if (to.path === '/login') {
      NProgress.done();
      next({ path: '/' });
    } else {
      const hasRoles = store.roles && store.roles.length > 0;
      if (hasRoles) {
        next();
      } else {
        try {
          const infoRes = await store.getInfo();
          let roles = [];
          if (infoRes.roles) {
            roles = infoRes.roles;
          }

          const accessRoutes = await permissionStore().generateRoutes(roles);

          accessRoutes.forEach(item => {
            router.addRoute(item);
          });

          next({ ...to, replace: true });
        } catch (error) {
          await store.clearAuth(); // resetToken 대신 clearAuth 사용
          ElMessage.error(error.message || '인증 오류가 발생했습니다');
          NProgress.done();
          next(`/login?redirect=${to.path}`);
        }
      }
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
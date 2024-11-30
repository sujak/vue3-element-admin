import { defineStore } from 'pinia';
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'
import { login as apiLogin, logout as apiLogout, getInfo as apiGetInfo } from '@/api/user';
import router, { resetRouter } from '@/router';
import tagsViewStore from './tagsView';
import permissionStore from './permission';

export interface IUserState {
  accessToken: string | null;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  introduction: string;
  roles: string[];
  isAuthenticated: boolean;
}

export default defineStore({
  id: 'user',
  state: (): IUserState => ({
    accessToken: null,
    userId: '',
    name: '',
    email: '',
    avatar: '',
    introduction: '',
    roles: [],
    isAuthenticated: false
  }),

  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['accessToken', 'userId', 'name', 'avatar', 'introduction', 'roles', 'isAuthenticated']
  } as PersistenceOptions<IUserState>,

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.accessToken,
    isAdmin: (state) => state.roles.includes('ADMIN')
  },

  actions: {
    setAuth(userData, accessToken: string) {
      this.accessToken = accessToken;
      this.userId = userData.id;
      this.name = userData.name;
      this.email = userData.email;
      this.avatar = userData.avatar;
      this.introduction = userData.introduction;
      this.roles = userData.roles.map((role) => role.code);
      this.isAuthenticated = true;
    },

    clearAuth() {
      this.accessToken = null;
      this.userId = '';
      this.name = '';
      this.email = '';
      this.avatar = '';
      this.introduction = '';
      this.roles = [];
      this.isAuthenticated = false;
    },

    // 로그인
    login(userInfo): Promise<void> {
      const { email, password } = userInfo;
      return new Promise((resolve, reject) => {
        apiLogin({ email: email.trim(), password: password })
          .then(({ data }) => {
            const { user, access_token } = data;
            this.setAuth(user, access_token);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 사용자 정보 조회
    getInfo() {
      return new Promise((resolve, reject) => {
        if (!this.accessToken) {
          reject('No access token found.');
          return;
        }

        apiGetInfo()
          .then((response) => {
            const { data } = response;
            if (!data) {
              reject('Verification failed, please Login again.');
              return;
            }

            const { roles } = data;
            if (!roles || roles.length <= 0) {
              reject('getInfo: roles must be a non-null array!');
              return;
            }

            if (this.accessToken) {
              this.setAuth(data, this.accessToken);
            } else {
              reject('No access token found.');
            }
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 로그아웃
    logout(): Promise<void> {
      return new Promise((resolve, reject) => {
        apiLogout()
          .then(() => {
            this.clearAuth();
            resetRouter();
            tagsViewStore().delAllViews();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 토큰 리셋
    resetToken() {
      this.clearAuth();
    },

    // 권한 변경
    async changeRoles(role) {
      try {
        const infoRes = await this.getInfo();
        resetRouter();

        const accessRoutes = await permissionStore().generateRoutes(this.roles);
        accessRoutes.forEach((item) => {
          router.addRoute(item);
        });

        tagsViewStore().delAllViews();
      } catch (error) {
        console.error('Error changing roles:', error);
        throw error;
      }
    }
  }
});

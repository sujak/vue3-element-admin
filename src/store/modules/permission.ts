import { defineStore } from 'pinia';
import { asyncRoutes, constantRoutes } from '@/router';
import type { RouteRecordRaw } from 'vue-router';

interface IPermissionState {
  routes: Array<RouteRecordRaw>;
  addRoutes: Array<RouteRecordRaw>;
  isRoutesGenerated: boolean;
}

function hasPermission(roles:string[], route:RouteRecordRaw):boolean {
  if (route.meta && route.meta.roles) {
    const rolesArr = route.meta.roles as string[];
    return roles.some(role => rolesArr.includes(role));
  }
  return true;
}

export function filterAsyncRoutes(routes:RouteRecordRaw[], roles: string[]): Array<RouteRecordRaw> {
  const res:Array<RouteRecordRaw> = [];
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });
  return res;
}

export default defineStore({
  id: 'permission',
  state: ():IPermissionState => ({
    routes: [],
    addRoutes: [],
    isRoutesGenerated: false
  }),

  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
      this.isRoutesGenerated = true;
    },

    resetRoutes() {
      this.routes = [];
      this.addRoutes = [];
      this.isRoutesGenerated = false;
    },

    generateRoutes(roles: string[]) {
      let accessedRoutes;
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      this.setRoutes(accessedRoutes);
      return accessedRoutes;
    }
  }
});
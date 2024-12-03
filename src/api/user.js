import request from '@/utils/request';

export function login(data) {
  console.log('[API] login');;
  return request({
    url: '/api/v1/auth/login',
    method: 'post',
    data
  });
}

export function getInfo() {
  console.log('[API] getInfo');
  return request({
    url: '/api/v1/users/profile',
    method: 'get'
  });
}

export function logout() {
  console.log('[API] logout');
  return request({
    url: '/api/v1/auth/logout',
    method: 'post'
  });
}

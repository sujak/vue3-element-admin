import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/api/v1/auth/login',
    method: 'post',
    data
  });
}

export function getInfo() {
  return request({
    url: '/api/v1/users/profile',
    method: 'get'
  });
}

export function logout() {
  return request({
    url: '/api/v1/auth/logout',
    method: 'post'
  });
}

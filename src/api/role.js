import request from '@/utils/request';

export function getRoles(params) {
  return request({
    url: '/api/v1/roles',
    method: 'get',
    params
  });
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  });
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/getUserInfo?id=${id}`,
    method: 'get',
    data
  });
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/deleteUser`,
    method: 'post',
    data: { userId: id }
  });
}

import request from '@/utils/request';

export function searchUser(name) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  });
}

export function transactionList(query) {
  return request({
    url: '/api/v1/users',
    method: 'get'
    // url: '/vue-element-admin/transaction/list',
    // method: 'get',
    // params: query
  });
}

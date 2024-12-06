import axios from 'axios';
import modules from '@/store';

// import { getToken } from '@/utils/auth';

// 리프레시 토큰 요청 상태를 추적하기 위한 변수
let isRefreshing = false;
let failedQueue = [];

// axios 인스턴스 생성
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true, // 쿠키 전송을 위해 필요
  timeout: 5000
});

// store 인스턴스 가져오기
const getUserStore = () => {
  return modules.user();
};

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// 요청 인터셉터
service.interceptors.request.use(
  (config) => {
    const userStore = getUserStore();
    if (userStore.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`;
      console.log('axios - request', config.url, config);
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 리프레시 토큰 요청인지 확인하는 함수
const isRefreshTokenRequest = (config) => {
  return config.url === '/api/v1/auth/refresh-token';
};

// 응답 인터셉터
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (!res.success) {
      ElMessage.error(res.message || '에러가 발생했습니다');
      return Promise.reject(new Error(res.message || '에러가 발생했습니다'));
    }
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    const userStore = getUserStore();

    // refresh-token 요청 자체가 실패한 경우 바로 로그아웃 처리
    if (isRefreshTokenRequest(originalRequest)) {
      userStore.clearAuth();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 리프레시 진행 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return service(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('refresh-token');
        const response = await service.post('/api/v1/auth/refresh-token');
        const { access_token } = response.data;
        userStore.accessToken = access_token;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        processQueue(null, access_token);
        return service(originalRequest);
      } catch (refreshError) {
        console.log('refresh-token-error', refreshError);
        processQueue(refreshError, null);
        userStore.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    ElMessage({
      message: error.response?.data?.message || error.message || 'Error',
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);
export default service;

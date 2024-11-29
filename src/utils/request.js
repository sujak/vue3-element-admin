import axios from 'axios';
import modules from '@/store';

// import { getToken } from '@/utils/auth';

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

// 요청 인터셉터
service.interceptors.request.use(
  (config) => {
    const userStore = getUserStore();
    if (userStore.accessToken) {
      config.headers.Authorization = `Bearer ${userStore.accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // API 응답이 success: false인 경우 에러 처리
    if (!res.success) {
      ElMessage.error(res.message || '에러가 발생했습니다');
      return Promise.reject(new Error(res.message || '에러가 발생했습니다'));
    }

    // success: true인 경우 data만 반환
    return res;
  },
  async (error) => {
    const originalRequest = error.config;
    const userStore = getUserStore();

    // 액세스 토큰이 만료되어 401 에러가 발생하고
    // 아직 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰으로 새로운 액세스 토큰 요청
        const response = await service.post('/auth/refresh');
        const { access_token } = response.data;

        // 새로운 액세스 토큰을 스토어에 저장
        userStore.accessToken = access_token;

        // 원래 요청의 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // 원래 요청 재시도
        return service(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료되었거나 유효하지 않은 경우
        userStore.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const message = error.response?.data?.message || error.message || 'Error';
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);
export default service;

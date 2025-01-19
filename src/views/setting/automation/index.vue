<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-group">
        <el-button :loading="processLoading" class="filter-item" type="primary" @click="handleAttendance"> 출첵 </el-button>

        <el-button :loading="processLoading2" class="filter-item" type="primary" @click="handleUpdateMembers"> 조직도 </el-button>

        <el-button class="filter-item" type="primary" @click="testProgress"> 진행률 테스트 </el-button>
      </div>
    </div>

    <!-- 진행 상황 표시 컴포넌트 -->
    currentTask: {{ currentTask }}
    <div v-if="currentTask" class="status-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${currentTask.percentage}%` }" :class="{ error: currentTask.error }"></div>
      </div>
      <div class="status-info">
        <p class="stage">단계: {{ getStageLabel(currentTask.stage) }}</p>
        <p class="percentage">진행률: {{ currentTask.percentage }}%</p>
        <p class="message">{{ currentTask.message }}</p>
        <p v-if="currentTask.error" class="error-message">오류가 발생했습니다: {{ currentTask.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onUnmounted } from 'vue';
import request from '@/utils/request';

export function processAttendance(params) {
  return request({
    url: '/api/v1/automation/hiworksAttendance',
    method: 'post',
    params
  });
}

export function processGetMembers(params) {
  return request({
    url: '/api/v1/automation/hiworksUpdateMembers',
    method: 'post',
    params
  });
}

export default defineComponent({
  name: 'Automation',
  setup() {
    const currentTask = ref(null);
    const ws = ref(null);

    const getStageLabel = (stage) => {
      const labels = {
        init: '초기화',
        setup: '설정',
        login_page: '로그인 페이지',
        login: '로그인',
        password: '비밀번호 처리',
        navigation: '페이지 이동',
        data_loading: '데이터 로딩',
        complete: '완료',
        error: '오류'
      };
      return labels[stage] || stage;
    };

    const connectWebSocket = (taskId) => {
      const baseUrl = request.defaults.baseURL;
      const hostAndPort = baseUrl.replace('http://', '').replace('https://', '');
      const protocol = baseUrl.startsWith('https') ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${hostAndPort}/api/v1/ws`;

      console.log('Connecting to WebSocket:', wsUrl);

      if (ws.value) {
        console.log('Closing existing WebSocket connection');
        ws.value.close();
      }

      ws.value = new WebSocket(wsUrl);

      ws.value.onopen = () => {
        console.log('WebSocket connected successfully');
        const subscribeMessage = {
          type: 'subscribe',
          taskId
        };
        console.log('Sending subscribe message:', subscribeMessage);
        ws.value.send(JSON.stringify(subscribeMessage));
      };

      ws.value.onmessage = (event) => {
        console.log('Received WebSocket message:', event.data);
        try {
          const data = JSON.parse(event.data);
          console.log('Parsed message data:', data);
          currentTask.value = data;
          console.log('Current task updated:', currentTask.value);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.value.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.value.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
      };
    };

    onUnmounted(() => {
      if (ws.value) {
        ws.value.close();
      }
    });

    return {
      currentTask,
      getStageLabel,
      connectWebSocket
    };
  },
  data() {
    return {
      processLoading: false,
      processLoading2: false
    };
  },
  methods: {
    handleAttendance() {
      this.processLoading = true;
      processAttendance()
        .then((res) => {
          console.log(res);
        })
        .then(() => {
          this.processLoading = false;
        });
    },
    handleUpdateMembers() {
      this.processLoading2 = true;
      processGetMembers()
        .then((res) => {
          console.log(res);
          if (res.data?.taskId) {
            this.connectWebSocket(res.data.taskId);
          }
        })
        .then(() => {
          this.processLoading2 = false;
        })
        .catch((error) => {
          console.error('Error:', error);
          this.processLoading2 = false;
        });
    },
    async testProgress() {
      try {
        const response = await request({
          url: '/api/v1/test-progress', // URL 경로도 맞춤
          method: 'post'
        });

        if (response.data?.taskId) {
          this.connectWebSocket(response.data.taskId);
        }
      } catch (error) {
        console.error('Test progress error:', error);
        ElMessage.error(error.message || '테스트 중 오류가 발생했습니다.');
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.filter-item-group {
  display: flex;
  gap: 10px;
}

.status-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.progress-bar {
  width: 100%;
  height: 24px;
  background-color: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;

  &.error {
    background-color: #f44336;
  }
}

.status-info {
  margin-top: 15px;

  p {
    margin: 5px 0;
    line-height: 1.4;
  }
}

.stage {
  font-weight: 500;
  color: #2196f3;
}

.percentage {
  font-size: 14px;
  color: #666;
}

.message {
  color: #333;
}

.error-message {
  color: #f44336;
  font-weight: 500;
}
</style>

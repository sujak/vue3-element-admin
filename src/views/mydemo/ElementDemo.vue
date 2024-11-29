<script setup>
import {
  Check,
  Delete,
  Edit,
  Loading,
  Message,
  Search,
  Star
} from '@element-plus/icons-vue';
import store from '@/store';
console.log('store=', store);

console.log('HomeView NODE_ENV=', process.env.NODE_ENV);
console.log('HomeView VUE_APP_BASE_API=', process.env.VUE_APP_BASE_API);

const useAppStore = store.app();

console.log('appStore.device=', useAppStore.device);
</script>

<template>
  <div class="app-container">
    <div class="mytitle">
      <span class="text">환경 변수 가져오기</span>
    </div>
    <div>Element 버튼 예제</div>
    <div class="button-example">
      <el-row class="mb-4">
        <el-button>Default</el-button>
        <el-button type="primary">Primary</el-button>
        <el-button type="success">Success</el-button>
        <el-button type="info">Info</el-button>
        <el-button type="warning">Warning</el-button>
        <el-button type="danger">Danger</el-button>
      </el-row>

      <el-row class="mb-4">
        <el-button plain>Plain</el-button>
        <el-button type="primary" plain>Primary</el-button>
        <el-button type="success" plain>Success</el-button>
        <el-button type="info" plain>Info</el-button>
        <el-button type="warning" plain>Warning</el-button>
        <el-button type="danger" plain>Danger</el-button>
      </el-row>

      <el-row class="mb-4">
        <el-button round>Round</el-button>
        <el-button type="primary" round>Primary</el-button>
        <el-button type="success" round>Success</el-button>
        <el-button type="info" round>Info</el-button>
        <el-button type="warning" round>Warning</el-button>
        <el-button type="danger" round>Danger</el-button>
      </el-row>

      <el-row>
        <el-button :icon="Search" circle />
        <el-button type="primary" :icon="Edit" circle />
        <el-button type="success" :icon="Check" circle />
        <el-button type="info" :icon="Message" circle />
        <el-button type="warning" :icon="Star" circle />
        <el-button type="danger" :icon="Delete" circle />
      </el-row>
    </div>
    <div>&nbsp;</div>
    <div>Element 아이콘 예제</div>
    <div style="font-size: 20px;">
      <!-- SVG 아이콘은 기본적으로 속성을 포함하지 않으므로 -->
      <!-- 직접 제공해야 합니다 -->
      <Edit style="width: 1em; height: 1em; margin-right: 8px" />
      <Star style="width: 1em; height: 1em; margin-right: 8px" />
      <Delete style="width: 1em; height: 1em; margin-right: 8px" />
      <Search style="width: 1em; height: 1em; margin-right: 8px" />
    </div>
    <div class="myicon">
      <el-icon class="is-loading">
        <Loading />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  div {
    padding: 5px 0;
  }
  .mytitle {
    font-size: 20px;

    .text {
      font-size: 30px;
    }
  }
}
</style>

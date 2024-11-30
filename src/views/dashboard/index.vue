<template>
  <div class="dashboard-container">
    <component :is="components[currentRole]" />
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue';
import userStore from '@/store/modules/user';
import adminDashboard from './admin/index.vue';
import editorDashboard from './editor/index.vue';

const store = userStore(); // store 인스턴스 생성
const isAdmin = computed(() => store.isAdmin)
const currentRole = computed(() => (isAdmin.value ? 'adminDashboard' : 'editorDashboard'));

// onMounted(() => {
//   console.log('dashboard created', store.isAdmin);
//   if (!store.isAdmin) {
//     currentRole.value = 'editorDashboard';
//   }
// });
const components = {
  adminDashboard,
  editorDashboard
};
</script>

<style scoped>
</style>

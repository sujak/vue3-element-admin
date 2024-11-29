<template>
  <div class="app-container">
    <div>Store Demo</div>
    <div>1. mapStores를 사용하여 this.xxxStore.yyy 호출</div>
    <div>2. mapState를 사용하여 this.xxx 호출</div>
    <div>3. 함수를 호출하여 const xxxStore = store.xxx() 그런 다음 xxxStore 변수를 사용할 수 있습니다</div>
    <div>&nbsp;</div>
    <div>========</div>
    <div>아래는 변수 표시 값입니다. 구체적인 사용법은 소스 코드를 참조하세요</div>
    <div>userStore.name={{ userStore.name }}</div>
    <div>appStore.device={{ device }}</div>
    <div><el-button @click="handleToggleDevice">toggleDevice</el-button></div>
  </div>
</template>

<script>
import { mapStores, mapState, mapActions } from 'pinia';
import { defineComponent } from 'vue';
import store from '@/store';

export default defineComponent({
  name: 'StoreDemo',
  computed: {
    ...mapStores(store.app, store.user),
    ...mapState(store.app, ['device'])
  },
  mounted() {
    console.log('StoreDemo mounted appStore.device=', this.appStore.device);
    console.log('StoreDemo mounted device=', this.device);
    console.log('StoreDemo mounted token=', this.userStore.token);
    const appStore = store.app();
    console.log('StoreDemo mounted useAppStore.device=', appStore.device);
    console.log('StoreDemo END');
  },
  methods: {
    ...mapActions(store.app, ['toggleDevice']),
    handleToggleDevice() {
      this.toggleDevice(+new Date());
    }
  }
});
</script>

<style lang="scss" scoped>
.app-container {
  div {
    padding: 5px 0;
  }
}
</style>

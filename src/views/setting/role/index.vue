<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item-group">
        <el-input v-model="listQuery.name" clearable placeholder="역할명" class="filter-item" @keyup.enter="handleFilter" style="width: 200px" />
        <!-- <el-select v-model="listQuery.sort" class="filter-item" @change="handleFilter">
          <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
        </el-select> -->
      </div>
      <div class="filter-item-group">
        <el-button class="filter-item" type="primary" :icon="iconSearch" @click="handleFilter">
          <span v-waves>Search</span>
        </el-button>
        <el-button class="filter-item" type="primary" :icon="iconEdit" @click="handleCreate"> 신규등록 </el-button>
        <!-- <el-button :loading="downloadLoading" class="filter-item" type="primary" :icon="iconDownload" @click="handleDownload">
          <span v-waves>다운로드</span>
        </el-button> -->
      </div>
    </div>

    <el-table ref="tableRef" :key="tableKey" v-loading="listLoading" :data="list" border fit element-loading-background="rgba(255,255, 255, 0.9)" highlight-current-row style="width: 100%" @sort-change="handleSortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="역할명" min-width="120px">
        <template #default="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="코드" min-width="180px">
        <template #default="{ row }">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="설명" min-width="150px">
        <template #default="{ row }">
          <div>
            <span>{{ row.description }}</span>
            <div v-html="text2Html(row.memo)"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="레벨" prop="level" sortable="custom" align="center">
        <template #default="{ row }">
          <span>{{ row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="활성화" align="center" class-name="no-ellipsis" min-width="90px">
        <template #default="{ row }">
          <el-switch v-if="!row.is_system" v-model="row.is_active" inline-prompt :active-value="true" :inactive-value="false" size="large" active-text="Y" inactive-text="N" />
          <el-tag v-else type="primary">SYSTEM</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="최종 수정일" width="150px" align="center">
        <template #default="{ row }">
          <span>{{ parseTime(new Date(row.updated_at), '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="관리" align="center" class-name="small-padding fixed-width">
        <template #default="{ row, $index }">
          <el-button type="primary" size="small" @click="handleUpdate(row)"> 수정 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.limit" @pagination="getList" />

    <!-- 등록/수정 -->
    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
    {{ temp.id }}
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="역할명" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="코드" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="설명" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="활성화" prop="is_active">
          <el-switch v-model="temp.is_active" inline-prompt :active-value="true" :inactive-value="false" size="large" active-text="Y" inactive-text="N" />
        </el-form-item>
        <el-form-item label="레벨" prop="level">
          <el-input-number v-model="temp.level" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="시스템 기본" prop="is_system">
          <el-switch v-model="temp.is_system" inline-prompt :active-value="true" :inactive-value="false" size="large" active-text="Y" inactive-text="N" />
        </el-form-item>
        <el-form-item label="메모">
          <el-input v-model="temp.memo" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <div v-if="dialogStatus !== 'create'" class="button-group">
            <el-button type="danger" @click="handleDelete()"> 삭제 </el-button>
          </div>
          <div class="button-group">
            <el-button @click="dialogFormVisible = false"> 취소 </el-button>
            <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()"> 확인 </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, markRaw } from 'vue';
import { Search, Edit, Download } from '@element-plus/icons-vue';
import { getRoles, addRole, updateRole, deleteRole } from '@/api/role';
// fetchList, fetchPv, createArticle, updateArticle

import waves from '@/directive/waves'; // waves directive
import { parseTime, text2Html } from '@/utils';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination

export default defineComponent({
  name: 'RoleTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      iconSearch: markRaw(Search),
      iconEdit: markRaw(Edit),
      iconDownload: markRaw(Download),
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        type: undefined,
        sort: '+id'
      },
      sortOptions: [
        { label: 'ID 오름차순', key: '+id' },
        { label: 'ID 내림차순', key: '-id' },
        { label: '레벨 오름차순', key: '+level' },
        { label: '레벨 내림차순', key: '-level' }
      ],
      temp: {
        id: undefined,
        code: '',
        name: '',
        description: '',
        is_active: false,
        is_system: false,
        level: 1,
        memo: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '수정',
        create: '등록'
      },
      rules: {
        // code: '',
        // name: '',
        // description: '',
        // is_active: false,
        // is_system: false,
        // level: 1,
        // memo: ''
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        code: [
          { required: true, message: 'type is required', trigger: 'change' }
        ]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    parseTime,
    text2Html,
    getList() {
      this.listLoading = true;
      getRoles(this.listQuery).then((response) => {
        const { data } = response;
        this.list = data.items;
        this.total = data.meta.total;
        this.$nextTick(() => {
          this.listLoading = false;
        });
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSortChange({ prop, order }){
      if (!prop || !order) {
        this.listQuery.sort = '+id' // 정렬 초기화\
        // 테이블 UI 정렬 상태 초기화
        this.$refs['tableRef'].clearSort();
        this.handleFilter();
        return
      }
      this.listQuery.sort = order === 'ascending' ? `+${prop}` : `-${prop}`
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        code: '',
        name: '',
        description: '',
        is_active: false,
        is_system: false,
        level: 1,
        memo: ''
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addRole(this.temp).then((response) => {
            this.list.unshift(response.data);
            this.dialogFormVisible = false;
            ElNotification({
              title: 'Success',
              message: response.message,
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateRole(tempData.id, tempData).then((response) => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, response.data);
            console.log(response);
            this.dialogFormVisible = false;
            ElNotification({
              title: 'Success',
              message: response.message,
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete() {
      this.temp.id && ElMessageBox.confirm('정말 삭제하시겠습니다.?')
      .then(() => {
        deleteRole(this.temp.id).then((response) => {
          const index = this.list.findIndex((v) => v.id === this.temp.id);
          this.list.splice(index, 1);
          this.dialogFormVisible = false;
          ElNotification({
            title: 'Success',
            message: response.message,
            type: 'success',
            duration: 2000
          });
        });
      })
      .catch(() => {
        console.log('123123');;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['timestamp', 'title', 'type', 'status'];
        const filterVal = ['timestamp', 'title', 'type', 'status'];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
});
</script>

<style lang="scss" scoped>
.el-table :deep(.no-ellipsis) {
  .cell {
    text-overflow: clip;
  }
}
.dialog-footer {
  &:has(.button-group + .button-group){
    display: flex;
    justify-content: space-between;
  }
}
</style>

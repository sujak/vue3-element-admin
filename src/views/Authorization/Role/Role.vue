<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="역할명" style="width: 200px;" class="filter-item" @keyup.enter="handleFilter" />
      <!-- <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select> -->
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button class="filter-item" type="primary" :icon="iconSearch" @click="handleFilter">
        <span v-waves>Search</span>
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" :icon="iconEdit" @click="handleCreate">
        등록
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" :icon="iconDownload" @click="handleDownload">
        <span v-waves>다운로드</span>
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template #default="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="역할명" min-width="120px">
        <template #default="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
          <!-- <el-tag>{{ typeFilter(row.type) }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="코드" min-width="180px">
        <template #default="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="설명" min-width="150px">
        <template #default="{row}">
          <div>
            <span>{{ row.description }}</span>
            <div v-html="text2Html(row.memo)"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="레벨" prop="level" sortable="custom" align="center" :class-name="getSortClass('id')">
        <template #default="{row}">
          <span>{{ row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="활성화" align="center">
        <template #default="{row}">
          <el-switch
            v-if="!row.is_system"
            v-model="row.is_active"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="Y"
            inactive-text="N"
          />
        </template>
      </el-table-column>
      <el-table-column label="최종 수정일" width="150px" align="center">
        <template #default="{row}">
          <span>{{ parseTime(new Date(row.updated_at), '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template #default="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Readings" align="center" width="95">
        <template #default="{row}">
          <span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template #default="{row}">
          <el-tag :type="statusFilter(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->
      <!-- <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default>
        <el-button link type="primary" size="small" @click="handleClick">
          Detail
        </el-button>
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column> -->
      <el-table-column fixed="right" label="관리" align="center" class-name="small-padding fixed-width">
        <template #default="{row,$index}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            수정
          </el-button>
          <!-- <el-button v-if="row.status!='published'" size="small" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="small" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>
          <el-button v-if="row.status!='deleted'" size="small" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="listQuery.page" v-model:limit="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
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
          <el-switch
            v-model="temp.is_active"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="Y"
            inactive-text="N"
          />
        </el-form-item>
        <el-form-item label="레벨" prop="level">
          <el-input-number v-model="temp.level" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="시스템 기본" prop="is_system">
          <el-switch
            v-model="temp.is_system"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="Y"
            inactive-text="N"
          />
        </el-form-item>
        <el-form-item label="메모">
          <el-input v-model="temp.memo" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            취소
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            확인
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
          </span>
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

// const calendarTypeOptions = [
//   { key: 'CN', display_name: 'China' },
//   { key: 'US', display_name: 'USA' },
//   { key: 'JP', display_name: 'Japan' },
//   { key: 'EU', display_name: 'Eurozone' }
// ];

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name;
//   return acc;
// }, {});

export default defineComponent({
  name: 'ComplexTable',
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
      // calendarTypeOptions,
      sortOptions: [
        { label: 'ID 오름차순', key: '+id' },
        { label: 'ID 내림차순', key: '-id' },
        { label: '레벨 오름차순', key: '+level' },
        { label: '레벨 내림차순', key: '-level' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
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
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }]
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
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      };
      return statusMap[status];
    },
    // typeFilter(type) {
    //   return calendarTypeKeyValue[type];
    // },
    getList() {
      this.listLoading = true;
      getRoles(this.listQuery).then(response => {
        const { data } = response;
        console.log('getRoles', response);
        this.list = data.items;
        this.total = data.meta.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      ElMessage({
        message: '操作Success',
        type: 'success'
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      console.log(prop, order);
      if (prop === 'id') {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id';
      } else {
        this.listQuery.sort = '-id';
      }
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
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = 'vue-element-admin';
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            ElNotification({
              title: 'Success',
              message: 'Created Successfully',
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
          console.log(tempData)
          updateRole(tempData.id, tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            ElNotification({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      ElNotification({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      });
      this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import('@/vendor/Export2Excel').then(excel => {
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
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j]);
        } else {
          return v[j];
        }
      }));
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? 'ascending' : 'descending';
    }
  }
});
</script>

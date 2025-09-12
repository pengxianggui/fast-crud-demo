export default () => {
    return `
<template>
  <fast-table ref="fastTable" class="fast-table" :option="tableOption" :key="tableKey">
    <template #quickFilter="{size}">
      <el-form-item label="自定义筛选项" style="grid-area: c1;/*grid-column: c2/c3*/">
        <el-input :size="size" v-model="customQueryParam.keyword" placeholder="同时筛选姓名和仰慕者姓名"/>
      </el-form-item>
    </template>
    <fast-table-column label="ID" prop="id"/>
    <fast-table-column-img label="头像" prop="avatarUrl" :fixed="params.fixedAvatar" :filter="false" required/>
    <fast-table-column-img prop="gallery" label="相册" filter width="300px"
                           :multiple="true" :limit="10"/>
    <fast-table-column-input label="姓名" prop="name" :filter="0" required/>
    <fast-table-column-number label="年龄" prop="age" required :quick-filter="3"
                              :rules="[{type: 'number', min: 16, max: 60, message: '年龄必须在[16,60]之间'}]"
                              :min="16" :max="60"
                              @change="handleAgeChange"/>
    <fast-table-column-select label="性别" prop="sex" :quick-filter="1" required
                              :options="sexOptions" :multiple_q="true">
      <template #header="{column, $index}">
        <span>{{ $index + '.' + column.label }}</span>
      </template>
      <template #normal="{row: {row}}">
        <el-tag v-if="row.sex === '1'">男</el-tag>
        <el-tag v-else-if="row.sex === '0'" type="danger">女</el-tag>
        <span v-else></span>
      </template>
    </fast-table-column-select>
    <fast-table-column-select label="属国" prop="state" required :quick-filter="true" quick-filter-block
                              :options="stateOptions" quick-filter-checkbox val-key="code" label-key="name"
                              :default-val_q="['1', '2', '3']" :disable-val="['4']"/>
    <fast-table-column-object label="仰慕者" prop="loveId" quick-filter
                              :table-option="loveOption" val-key="id" label-key_q="name" :pick-map="{name: 'loveName'}"
                              :multiple_q="true"/>
    <fast-table-column label="仰慕者姓名" prop="loveName"/>
    <fast-table-column-textarea label="简介" prop="info" link="withdrawSampleDetail?id={id}&pageType=detail"
                                :show-length="20"/>
    <fast-table-column-switch label="已毕业" prop="graduated" required
                              active-text="Y" inactive-text="N" quick-filter/>
    <fast-table-column-time-picker label="幸运时刻" prop="luckTime" width="120px" required
                                   :editable="({editRow}) => !(editRow.age > 35)"/>
    <fast-table-column-date-picker label="生日" prop="birthday" quick-filter required
                                   :disabled-date="(time) => time.getTime() > Date.now()"/>
    <fast-table-column-file label="简历" prop="resumeUrl" :multiple="true" :limit="3" :show-overflow-tooltip="false"/>
    <fast-table-column-input prop="idCard" label="身份证号" min-width="180px"/>
    <fast-table-column-input prop="address" label="地址" min-width="200px"/>
    <fast-table-column-input prop="phone" label="联系电话" min-width="150px"/>
    <fast-table-column-date-picker label="创建时间" prop="createTime" width="200px"
                                   :disabled-date_q="(time) => time.getTime() > Date.now()"
                                   type="datetime"
                                   :quick-filter="false" :default-val_q="defaultQueryOfCreatedTime"
                                   value-format_e="YYYY-MM-DDTHH:mm:ss"
                                   :editable="false"/>
    <el-table-column label="操作" width="60px" fixed="right">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="edit(scope)">编辑</el-button>
      </template>
    </el-table-column>
  </fast-table>
</template>

<script>
import {h, markRaw} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus';
import {FastTableColumnImg, FastTableColumn, FastTableColumnSelect, FastTableOption, util} from "fast-crud-ui3";
import staticDict from "./dict";
import {Cpu, Link, Plus} from "@element-plus/icons-vue";

export default {
  name: "MyTable",
  computed: {
    Link() {
      return Link
    }
  },
  props: {
    params: Object
  },
  data() {
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setTime(monthAgo.getTime() - 3600 * 1000 * 24 * 30);
    return {
      customQueryParam: {
        keyword: null
      },
      tableOption: new FastTableOption({
        context: this, // important! 否则钩子函数里无法获取当当前组件实例上下文
        title: '',
        module: 'student', // 配置了这个, 默认分页接口就是: /student/page, 新增接口就是: /student/insert, 其它同理
        enableDblClickEdit: true,
        enableMulti: true,
        enableIndex: true,
        enableColumnFilter: true,
        lazyLoad: false,
        editType: 'inline', // 默认inline
        insertable: (scope) => true, // 支持一个返回布尔的函数
        updatable: true,
        deletable: true,
        createTimeField: 'createTime', // 审计字段——创建时间
        condGroups: [ // 开发预置条件组——存筛
          {label: '成年男性', conds: [{col: 'age', opt: '>', val: 18}, {col: 'sex', opt: 'in', val: ['1']}]},
          {label: '吴国女性', conds: [{col: 'state', opt: 'in', val: ['3']}, {col: 'sex', opt: 'in', val: ['0']}]}
        ],
        moreButtons: [
          {
            // 这是一个完整的配置，其中: label、click是必须的
            icon: markRaw(Cpu),
            label: '扩展按钮',
            click: (scope) => console.log(scope),
            // showable: true, // 默认true
            // disable: false // 默认false
          },
          {
            icon: markRaw(Plus),
            label: '插入一行(空)',
            click: (scope) => this.$refs['fastTable'].addRow()
          },
          {
            label: '插入多行(带默认值)',
            click: (scope) => this.$refs['fastTable'].addRows([{name: '貂蝉', age: 21}, {name: '吕布', age: 27}])
          },
          {
            label: '弹窗新增',
            click: (scope) => this.$refs['fastTable'].addForm()
          },
          {
            label: '禁用掉',
            click: (scope) => console.log(scope),
            disable: true,
            // disable: (scope) => true // 这样也可以, 就可以动态判断了，比如根据当前选中/勾选的值(怎么获取当前选中/勾选的值? 尝试打印下scope)
          },
          {
            label: '隐藏掉',
            click: (scope) => console.log(scope),
            showable: false,
            // showable: (scope) => true // 这样也可以, 就可以动态判断了，比如根据当前选中/勾选的值(怎么获取当前选中/勾选的值? 尝试打印下scope)
          }
        ],
        pagination: {
          size: 10,
          "page-sizes": [5, 10, 20, 50, 100]
        },
        style: {
          flexHeight: true,
          size: 'default', // small,default,large
          bodyRowHeight: '45px',
          formLabelWidth: 'auto', // 默认为auto
          formLayout: 'id,avatarUrl, name|age|sex, graduated|state|state, loveId|loveName|loveName, info, birthday|luckTime, resumeUrl, createTime', // 弹窗表单布局设置
          quickFilterSpan: 3
        }
      }),
      loveOption: new FastTableOption({
        module: 'student',
        title: '人员列表',
        conds: [
          // 预筛
          // {col: 'name', opt: '=', val: '利威尔'} // 写法一
          // new Cond('name', 'like', '利威尔') // 写法二
        ],
        render: () => {
          return [
            h(FastTableColumn, {prop: 'id', label: 'id'}),
            h(FastTableColumnImg, {prop: 'avatarUrl', label: '头像'}),
            h(FastTableColumn, {prop: 'name', label: '姓名1', filter: 0}),
            h(FastTableColumnSelect, {
              prop: 'state',
              label: '蜀国',
              options: this.stateOptions,
              valKey: "code",
              labelKey: "name"
            })
          ]
        }
      }),
      tableKey: 0,
      defaultQueryOfCreatedTime: [monthAgo, now],
      ...staticDict
    }
  },
  methods: {
    edit({row: fatRow, column, $index}) {
      this.$refs['fastTable'].updateForm(fatRow)
    },
    handleAgeChange(age, scope) {
      const {row: {row, editRow, status, config}, column, $index} = scope
      if (this.params.autoSetGraduatedWhenAgeChange) {
        if (util.isNumber(age) && age > 50) {
          editRow.graduated = true;
          config['graduated'].props.disabled = true
        } else {
          config['graduated'].props.disabled = false
        }
      }
    }
  }
}
</script>`
}
<template>
  <div id="app">
    <el-table-admin-page
      ref="elTableAdminPage"
      :columns="columns"
      :table-data="tableData"
      v-bind.sync="pageParams"
      @searchList="getPage"
      @size-change="sizeChange"
      @current-change="currentChange"
      highlight-current-row
    >
      <template slot="searchLeft" slot-scope="{ entitys, index }">
        <el-input
          v-model="entitys[index].queryValue"
          placeholder="请输入搜索内容"
        />
      </template>
      <template slot="searchRight">
        <el-button type="primary">新增</el-button>
      </template>
      <template slot="columnEspecial" slot-scope="{ column, row }">
        <template v-if="['operation'].includes(column.prop)">
          <el-button type="primary" plain size="mini">编辑</el-button>
        </template>
        <template v-else>{{ row[column.prop] }}</template>
      </template>
    </el-table-admin-page>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      columns: [
        {
          type: "selection", // 多选框
        },
        {
          type: "radio", // 单选框
        },
        {
          type: "index", // 序号列
        },
        {
          label: "测试二级表头",
          children: [
            {
              label: "第一季度靠左",
              prop: "first",
            },
            {
              label: "第二季度居中",
              prop: "second",
              align: "center",
            },
            {
              label: "第三季度靠右",
              prop: "three",
              align: "right",
            },
          ],
        },
        {
          label: "测试表头自适应生成的宽度",
          prop: "name",
          align: "center",
        },
        {
          columnKey: "id",
          label: "测试固定宽度",
          prop: "date",
          width: "130",
          align: "center",
        },
        {
          label: "省份",
          prop: "province",
          align: "center",
        },
        {
          label: "市区",
          prop: "city",
          align: "center",
        },
        {
          label: "地址",
          prop: "address",
          showOverflowTooltip: true,
        },
        {
          label: "邮编",
          prop: "zip",
          feildType: "STRING",
          queryType: "LIKE",
          isnull: true,
          form: true,
          search: true,
        },
        {
          label: "操作",
          prop: "operation",
          form: false,
          search: false,
          align: "center",
          showOverflowTooltip: false, // 没设定宽度刚开始按钮后面出来一个点，原来是文本溢出
        },
      ],
      pageParams: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
    };
  },
  mounted() {
    this.getPage();
  },
  methods: {
    getPage(entitys) {
      const params = {
        ...this.pageParams,
        entitys: entitys
          ? entitys
          : this.$refs["elTableAdminPage"] &&
            this.$refs["elTableAdminPage"].entitys,
      };
      console.log(params);
      // 模拟调用分页接口
      setTimeout(() => {
        // 没有total的话生成total
        if (!this.pageParams.total) {
          this.pageParams.total =
            this.pageParams.pageSize * 9 +
            Math.floor(Math.random() * (this.pageParams.pageSize - 1 + 1) + 1);
        }
        //当前页要生成的条数
        let length;
        // 在最后一页的话生成total % pageSize条的数据
        if (
          this.pageParams.currentPage ===
          Math.ceil(this.pageParams.total / this.pageParams.pageSize)
        ) {
          length = this.pageParams.total % this.pageParams.pageSize;
        } else {
          length = this.pageParams.pageSize;
        }
        this.tableData = Array.from({ length }, (item, index) => {
          return {
            date: new Date().getTime(),
            name: `${index + 1} https://shenzjd.com`,
            province: `${index + 1}深圳`,
            city: `${index + 1}宝安区`,
            address: `${index + 1}上海市普陀区金沙江路 1518 弄`,
            zip: `${index + 1}`,
            first: `一季度${index + 1}`,
            second: `二季度${index + 1}`,
            three: `三季度${index + 1}`,
          };
        });
      }, 100);
    },
    // pageSize 改变时会触发
    sizeChange(value) {
      this.pageParams.pageSize = value;
      this.getPage();
    },
    // currentPage 改变时会触发
    currentChange(value) {
      if (typeof value === "number") {
        // el-pagination的currentPage事件
        this.pageParams.currentPage = value;
        this.getPage();
      } else {
        // el-table的currentPage事件
        console.log(value);
      }
    },
  },
};
</script>

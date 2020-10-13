<template>
  <div class="table">
    <div
      v-if="searchShow"
      class="searchBox"
      :style="{ 'flex-direction': flexDirection }"
    >
      <div class="searchLeft">
        <div class="searchItemBox">
          <div
            class="searchTop"
            :class="{
              borderCumtom: entitys.every((item) => item.show === true),
            }"
          >
            <div
              v-for="(entity, index) in entitys"
              :key="index"
              class="searchItem"
            >
              <el-collapse-transition>
                <transition name="el-zoom-in-top">
                  <div
                    v-show="index === 0 ? true : entity.show"
                    :ref="`searchContent${index}`"
                    class="searchContent"
                  >
                    <el-select
                      v-model="entity.querySelect"
                      placeholder="请选择"
                      :size="searchButtonSize"
                      value-key="prop"
                      clearable
                    >
                      <el-option
                        v-for="item in columns.filter(
                          (item) => item.query !== false
                        )"
                        :key="item.prop"
                        :label="item.label"
                        :value="item"
                      />
                    </el-select>
                    <slot name="searchLeft" :entitys="entitys" :index="index" />
                    <div
                      v-if="index === 0"
                      class="addEntity"
                      @click="addEntity"
                    >
                      <i class="el-icon-plus" />
                    </div>
                    <div
                      v-if="index !== 0"
                      class="addEntity"
                      @click="deleteEntity(index)"
                    >
                      <i class="el-icon-minus" />
                    </div>
                  </div>
                </transition>
              </el-collapse-transition>
            </div>
          </div>
          <el-button
            class="BlueCustomButton searchBottom"
            :size="searchButtonSize"
            @click.native="searchList(true)"
            >查询</el-button
          >
        </div>
      </div>
      <div class="searchRight">
        <slot name="searchRight" />
      </div>
    </div>
    <slot name="searchBottom" />
    <el-table
      v-bind="$attrs"
      :data="tableData"
      class="tableBox"
      :stripe="stripe"
      :show-header="showHeader"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="selection"
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        v-if="indexShow && columns.length > 0"
        label="序号"
        type="index"
        width="50"
        align="center"
        :index="(index) => index + (page - 1) * rows + 1"
      />
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :align="column.align || 'center'"
        :prop="column.prop"
        :label="column.label"
        :min-width="flexColumnWidth(column)"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template slot-scope="{ row }">
          <slot name="columnEspecial" :column="column" :row="row" />
        </template>
      </el-table-column>
      <slot name="columnRight" />
    </el-table>

    <div :class="{ hidden: hidden }" class="pagination-container">
      <el-pagination
        :background="background"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :layout="layout"
        :page-sizes="pageSizes"
        :total="total"
        v-bind="$attrs"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "elTableAdminPage",
  props: {
    tableData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    columns: {
      type: Array,
      default: function () {
        return [];
      },
    },
    widthEspecial: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 搜索框左右排列
    flexDirection: {
      type: String,
      default: function () {
        return "row";
      },
    },
    // 搜索的size
    searchButtonSize: {
      type: String,
      default: function () {
        return "";
      },
    },
    // 搜索的显示
    searchShow: {
      type: Boolean,
      default: true,
    },
    // 序号的显示
    indexShow: {
      type: Boolean,
      default: true,
    },
    // 斑马线
    stripe: {
      type: Boolean,
      default: true,
    },
    // 表头的显示
    showHeader: {
      type: Boolean,
      default: true,
    },
    // 多选显示
    selection: {
      type: Boolean,
      default: false,
    },
    multipleSelection: {
      type: Array,
      default: function () {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: function () {
        return true;
      },
    },
    /**
     *当内容过长被隐藏时显示 tooltip
     */
    showOverflowTooltip: {
      type: Boolean,
      default: function () {
        return true;
      },
    },

    // 下面是pagination
    total: {
      type: Number,
      default() {
        return 0;
      },
    },
    page: {
      type: Number,
      default: 1,
    },
    rows: {
      type: Number,
      default: 20,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      },
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    background: {
      type: Boolean,
      default: true,
    },
    // 分页的显示
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      entitys: [
        {
          querySelect: {},
          queryValue: "",
          show: false,
        },
      ]
    };
  },
  computed: {
    // 下面是pagination
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      },
    },
    pageSize: {
      get() {
        return this.rows;
      },
      set(val) {
        this.$emit("update:rows", val);
      },
    },
  },
  created() {
    // this.$nextTick(() => {
    //   this.$refs["searchContent0"] &&
    //     this.$refs["searchContent0"][0]
    //       .querySelectorAll("input")[1]
    //       .addEventListener("focus", () => {
    //         this.entitys.map((item) => {
    //           item.show = true;
    //         });
    //         if (this.entitys.length === 1) this.entitys[0].show = false;
    //       });
    // });
    this.watchMethod();
    this.$watch(
      () => {
        return this.entitys.length;
      },
      () => {
        this.watchMethod();
      }
    );
  },
  methods: {
    watchMethod() {
      this.entitys.map((item) => {
        this.$watch(
          () => {
            return item.querySelect;
          },
          (value, oldValue) => {
            if (value.prop !== oldValue.prop) {
              item.queryValue = "";
            }
          }
        );
      });
    },
    /**
     * 增加条件
     */
    addEntity() {
      if (
        this.entitys.length <=
        this.columns.filter((item) => item.query !== false).length - 1
      ) {
        this.entitys.push({ querySelect: "", queryValue: "", show: true });
        this.entitys.map((item) => {
          item.show = true;
        });
      } else {
        this.$message({
          type: "info",
          message: "当前搜索条件已达上限",
        });
      }
    },
    /**
     * 删除条件
     */
    deleteEntity(index) {
      this.entitys.splice(index, 1);
      if (this.entitys.length === 1) this.entitys[0].show = false;
    },
    /**
     * 清空条件
     */
    clearEntity() {
      this.entitys.map((item) => {
        item.querySelect = "";
        item.queryValue = "";
      });
    },
    /**
     * 自适应宽度
     */
    flexColumnWidth(column) {
      const str = column.label;
      let flexWidth = 0;
      for (const char of str) {
        if ((char >= "A" && char <= "Z") || (char >= "a" && char <= "z")) {
          // 如果是英文字符，为字符分配8个单位宽度
          flexWidth += 8;
        } else if (char >= "\u4e00" && char <= "\u9fa5") {
          // 如果是中文字符，为字符分配20个单位宽度
          flexWidth += 19;
        } else {
          // 其他种类字符，为字符分配5个单位宽度
          flexWidth += 5;
        }
      }
      if (flexWidth < 70) {
        flexWidth = 70;
      }
      // if (flexWidth > 250) { flexWidth = 250 }
      [{ createTm: 150 }, { modifyTm: 150 }]
        .concat(this.widthEspecial)
        .map((item) => {
          const entity = Object.entries(item);
          if (entity[0][0] === column.prop) {
            flexWidth = entity[0][1] + "px";
          }
        });
      return flexWidth;
    },
    /**
     * 搜索，传入的值代表点击的是搜索框，而不是翻页
     */
    searchList(searchButton) {
      this.entitys.map((item) => {
        item.show = false;
      });
      this.$emit("searchList", this.entitys, searchButton);
    },
    handleSelectionChange(val) {
      this.$emit("update:multipleSelection", val);
    },
    /**
     * 切换多条件搜索的下拉展示与关闭
     */
    toggleEntityShow() {
      this.entitys.map((item, index) => {
        if (index !== 0) {
          item.show = !item.show;
        }
      });
    },

    // 下面是pagination
    handleSizeChange() {
      this.$emit("pagination", this.entitys);
    },
    handleCurrentChange() {
      this.$emit("pagination", this.entitys);
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  .searchBox {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    min-height: 36px;
    & > .searchLeft {
      position: relative;
      // width: 419px;
      width: 100%;
      & > .searchItemBox {
        position: absolute;
        z-index: 10;
        display: flex;
        .borderCumtom {
          border-right: solid 1px #dfe4ed;
          border-bottom: solid 1px #dfe4ed;
        }
        .searchTop {
          padding-bottom: 3px;
          background-color: white;
          .addEntity {
            width: 30px;
            height: 30px;
            margin: 3px;
            background-color: #fff;
            border: solid 1px #dcdfe6;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
          }
          ::v-deep .el-select > .el-input {
            width: 150px;
          }
          ::v-deep .el-input {
            width: 148px;
          }
          .searchItem {
            .searchContent {
              display: flex;
            }
          }
          .searchItem + .searchItem {
            margin: 1px 0;
          }
          .searchItem:not(:nth-of-type(1)) {
            background-color: #fff;
          }
        }
        .searchBottom {
          height: 36px;
          margin-left: 3px;
        }
      }
    }
    .searchRight {
      display: flex;
    }
  }
  .tableBox {
    border: 1px solid #ededed;
    border-bottom: none;
  }
}

// 下面是pagination
.pagination-container {
  background: #fff;
  padding: 32px 16px;
  display: flex;
  flex-direction: row-reverse;
}
.pagination-container.hidden {
  display: none;
}
</style>

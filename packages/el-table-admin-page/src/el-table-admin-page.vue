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
                      value-key="prop"
                      clearable
                    >
                      <el-option
                        v-for="item in columns.filter(
                          (item) =>
                            item.search !== false &&
                            !['selection', 'index', 'expand'].includes(
                              item.type
                            )
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
            @click.native="searchList(true)"
            >查询</el-button
          >
        </div>
      </div>
      <div class="searchRight">
        <slot name="searchRight" />
      </div>
    </div>
    <el-table
      v-on="$listeners"
      v-bind="$attrs"
      :data="tableData"
      header-align="right"
    >
      <template v-for="column in columns">
        <el-table-column
          v-if="['selection'].includes(column.type)"
          v-bind="column"
          :key="column.prop"
          :align="column.align || 'center'"
          :width="column.width || 50"
        />
        <el-table-column
          v-if="['index'].includes(column.type)"
          v-bind="column"
          :key="column.prop"
          :label="column.label || '序号'"
          :width="column.width || 50"
          :align="column.align || 'center'"
          :index="(index) => index + (page - 1) * rows + 1"
        />
        <el-table-column
          v-if="!['selection', 'index'].includes(column.type)"
          v-bind="column"
          :key="column.prop"
          :header-align="column.headerAlign || 'center'"
          :min-width="column.width || flexColumnWidth(column)"
        >
          <template v-if="column.children">
            <el-table-column
              v-for="child in column.children"
              v-bind="child"
              :key="child.prop"
              :header-align="column.headerAlign || 'center'"
              :min-width="child.width || flexColumnWidth(child)"
            >
              <template slot-scope="{ row }">
                <slot name="columnEspecial" :column="child" :row="row" />
              </template>
            </el-table-column>
          </template>
          <template slot-scope="{ row }">
            <slot name="columnEspecial" :column="column" :row="row" />
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- <el-pagination
      v-on="$listeners"
      v-bind="$attrs"
      :total="tableData.length"
      :layout="'total, sizes, prev, pager, next, jumper'"
      :page-size="10"
      :current-page.sync="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
    <el-pagination
      v-on="$listeners"
      v-bind="$attrs"
      :layout="'total, sizes, prev, pager, next, jumper'"
    />
  </div>
</template>

<script>
export default {
  name: "elTableAdminPage",
  inheritAttrs: false,
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
    // 多选框显示
    selectionShow: {
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
    page: {
      type: Number,
      default: 1,
    },
    rows: {
      type: Number,
      default: 10,
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
      ],
    };
  },
  computed: {
    // 下面是pagination
    // currentPage: {
    //   get() {
    //     return this.page;
    //   },
    //   set(val) {
    //     this.$emit("update:page", val);
    //   },
    // },
    // pageSize: {
    //   get() {
    //     return this.rows;
    //   },
    //   set(val) {
    //     this.$emit("update:rows", val);
    //   },
    // },
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
        this.columns.filter((item) => item.search !== false).length - 1
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
      const str = column.label || "";
      let flexWidth = 0;
      for (const char of str) {
        if ((char >= "A" && char <= "Z") || (char >= "a" && char <= "z")) {
          // 如果是英文字符，为字符分配8个单位宽度
          flexWidth += 8;
        } else if (char >= "\u4e00" && char <= "\u9fa5") {
          // 如果是中文字符，为字符分配20个单位宽度
          flexWidth += 16;
        } else {
          // 其他种类字符，为字符分配5个单位宽度
          flexWidth += 5;
        }
      }
      if (flexWidth < 70) {
        flexWidth = 70;
      }
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

    // // 下面是pagination
    // handleSizeChange() {
    //   this.$emit("pagination", this.entitys);
    // },
    // handleCurrentChange() {
    //   this.$emit("pagination", this.entitys);
    // },
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
}
</style>

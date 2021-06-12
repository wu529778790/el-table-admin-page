<template>
  <div class="el-table-admin-page">
    <div v-if="searchShow" class="search-wriper">
      <div class="search-left">
        <div class="search-item-box">
          <div
            class="search-item-top"
            :class="{
              'border-custom': entitys.every((item) => item.show === true),
            }"
          >
            <div
              v-for="(entity, index) in entitys"
              :key="index"
              class="search-item"
            >
              <el-collapse-transition>
                <transition name="el-zoom-in-top">
                  <div
                    v-show="index === 0 ? true : entity.show"
                    class="search-content"
                  >
                    <el-select
                      v-model="entity.querySelect"
                      placeholder="请选择"
                      value-key="prop"
                      clearable
                    >
                      <el-option
                        v-for="item in entitysSelection"
                        :key="item.prop"
                        :label="item.label"
                        :value="item"
                      />
                    </el-select>
                    <slot name="searchLeft" :entitys="entitys" :index="index" />
                    <div
                      v-if="index === 0"
                      class="add-entity"
                      @click="addEntity"
                    >
                      <i class="el-icon-plus" />
                    </div>
                    <div
                      v-if="index !== 0"
                      class="add-entity"
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
            type="primary"
            @click.native="searchList(true)"
            style="height: 40px"
            >查询</el-button
          >
        </div>
      </div>
      <slot name="searchRight"></slot>
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
          :index="(index) => index + (currentPage - 1) * pageSize + 1"
        />
        <el-table-column
          v-if="!['selection', 'index'].includes(column.type)"
          v-bind="column"
          :key="column.prop"
          :header-align="column.headerAlign || 'center'"
          :show-overflow-tooltip="column.showOverflowTooltip || true"
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
    <el-pagination
      class="pagination"
      v-if="paginationShow"
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
    columns: {
      type: Array,
      default: function () {
        return [];
      },
    },
    tableData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 搜索的显示
    searchShow: {
      type: Boolean,
      default: true,
    },
    // 下面是pagination
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
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
      // 加这个show是为了解决手动修改当前页码，数据改变，dom不生效的问题(也可以加key重新渲染)
      paginationShow: true,
    };
  },
  computed: {
    entitysSelection() {
      const result = [];
      const rec = (arr) => {
        arr.map((i) => {
          if (i.children) {
            rec(i.children);
          } else {
            result.push(i);
          }
        });
      };
      rec(
        this.columns.filter(
          (item) =>
            item.search !== false &&
            !["selection", "index", "expand"].includes(item.type)
        )
      );
      return result;
    },
  },
  created() {
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
    // 监听下拉框是否变化，变化的话清空value
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
        this.entitys.push({ querySelect: {}, queryValue: "", show: true });
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
        item.querySelect = {};
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
    searchList(reSetFirstPage) {
      // 关闭多条件搜索
      this.entitys.map((item) => {
        item.show = false;
      });
      // 加这个show是为了解决手动修改当前页码，数据改变，dom不生效的问题
      this.paginationShow = false;
      this.$nextTick(() => {
        this.paginationShow = true;
        reSetFirstPage && this.$emit("update:currentPage", 1);
      });
      this.$emit("searchList", this.entitys);
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
  },
};
</script>

<style lang="scss" scoped>
.el-table-admin-page {
  .search-wriper {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    & > .search-left {
      position: relative;
      & > .search-item-box {
        position: absolute;
        z-index: 10;
        display: flex;
        .border-custom {
          border-right: solid 1px #dfe4ed;
          border-bottom: solid 1px #dfe4ed;
        }
        .search-item-top {
          padding-bottom: 3px;
          background-color: white;
          .add-entity {
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
          .search-item {
            .search-content {
              display: flex;
            }
          }
          .search-item + .search-item {
            margin: 1px 0;
          }
          .search-item:not(:nth-of-type(1)) {
            background-color: #fff;
          }
        }
      }
    }
  }
  .pagination {
    padding: 10px;
    display: flex;
    justify-content: center;
  }
}
</style>

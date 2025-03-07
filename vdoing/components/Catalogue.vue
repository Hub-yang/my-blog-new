<script>
export default {
  data() {
    return {
      pageData: null,
      isStructuring: true,
      appointDir: {},
    }
  },
  watch: {
    '$route.path': function () {
      this.getPageData()
    },
  },
  created() {
    this.getPageData()
    const sidebar = this.$themeConfig.sidebar
    if (!sidebar || sidebar === 'auto') {
      this.isStructuring = false
      console.error('目录页数据依赖于结构化的侧边栏数据，请在主题设置中将侧边栏字段设置为\'structuring\'，否则无法获取目录数据。')
    }
  },
  methods: {
    getPageData() {
      const pageComponent = this.$frontmatter.pageComponent
      if (pageComponent && pageComponent.data) {
        this.pageData = {
          ...pageComponent.data,
          title: this.$frontmatter.title,
        }
      }
      else {
        console.error('请在front matter中设置pageComponent和pageComponent.data数据')
      }
    },
    getCatalogueList() {
      const { sidebar } = this.$site.themeConfig
      const { data } = this.$frontmatter.pageComponent
      const key = data.path || data.key
      const keyArray = key.split('/')
      let catalogueList = (sidebar[`/${keyArray[0]}/`])
      if (keyArray.length > 1) {
        // 删除第一个元素，并修改原数组
        keyArray.shift()
        catalogueList = this.appointDirDeal(0, keyArray, catalogueList)
      }
      if (!catalogueList) {
        console.error('未获取到目录数据，请查看front matter中设置的path是否正确。')
      }
      return catalogueList
    },
    type(o) { // 数据类型检查
      return Object.prototype.toString.call(o).match(/\[object (.*?)\]/)[1].toLowerCase()
    },
    /**
     * 指定目录页配置处理
     * @param index 目录数组的下标
     * @param dirKeyArray 目录名称数组
     * @param catalogueList 目录对象列表
     * @returns {*}
     */
    appointDirDeal(index, dirKeyArray, catalogueList) {
      let dirKey = dirKeyArray[index]
      if (dirKey !== undefined && dirKey.includes('.')) {
        dirKey = dirKey.substring(dirKey.indexOf('.') + 1)
      }
      for (let i = 0; i < catalogueList.length; i++) {
        if (catalogueList[i].title === dirKey) {
          this.appointDir = catalogueList[i]
          if (index < dirKeyArray.length - 1) {
            this.appointDirDeal(index + 1, dirKeyArray, catalogueList[i].children)
          }
        }
      }
      return this.appointDir.children
    },
  },
}
</script>

<template>
  <div class="theme-vdoing-content">
    <div class="column-wrapper">
      <img v-if="pageData.imgUrl" :src="$withBase(pageData.imgUrl)">
      <dl class="column-info">
        <dt class="title">
          {{ pageData.title }}
        </dt>
        <dd class="description" v-html="pageData.description" />
      </dl>
    </div>
    <div v-if="isStructuring" class="catalogue-wrapper">
      <div class="catalogue-title">
        目录
      </div>
      <div class="catalogue-content">
        <template v-for="(item, index) in getCatalogueList()">
          <dl v-if="type(item) === 'array'" :key="index" class="inline">
            <dt>
              <router-link :to="item[2]">
                {{ `${index + 1}. ${item[1]}` }}
                <span v-if="item[3]" class="title-tag">
                  {{ item[3] }}
                </span>
              </router-link>
            </dt>
          </dl>
          <dl v-else-if="type(item) === 'object'" :key="index">
            <!-- 一级目录 -->
            <dt :id="(anchorText = item.title)">
              <a :href="`#${anchorText}`" class="header-anchor">#</a>
              {{ `${index + 1}. ${item.title}` }}
            </dt>
            <dd>
              <!-- 二级目录 -->
              <template v-for="(c, i) in item.children">
                <template v-if="type(c) === 'array'">
                  <router-link :key="i" :to="c[2]">
                    {{ `${index + 1}-${i + 1}. ${c[1]}` }}
                    <span v-if="c[3]" class="title-tag">
                      {{ c[3] }}
                    </span>
                  </router-link>
                </template>
                <!-- 三级目录 -->
                <div
                  v-else-if="type(c) === 'object'"
                  :key="i"
                  class="sub-cat-wrap"
                >
                  <div :id="(anchorText = c.title)" class="sub-title">
                    <a :href="`#${anchorText}`" class="header-anchor">#</a>
                    {{ `${index + 1}-${i + 1}. ${c.title}` }}
                  </div>
                  <router-link
                    v-for="(cc, ii) in c.children"
                    :key="`${index + 1}-${i + 1}-${ii + 1}`"
                    :to="cc[2]"
                  >
                    {{ `${index + 1}-${i + 1}-${ii + 1}. ${cc[1]}` }}
                    <span v-if="cc[3]" class="title-tag">
                      {{ cc[3] }}
                    </span>
                  </router-link>
                </div>
              </template>
            </dd>
          </dl>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">
.theme-vdoing-content
  margin-bottom $navbarHeight
.title-tag
  // height 1.1rem
  // line-height 1.1rem
  border 1px solid $activeColor
  color $activeColor
  font-size 0.8rem
  padding 0 0.35rem
  border-radius 0.2rem
  margin-left 0rem
  transform translate(0, -0.05rem)
  display inline-block
dl, dd
  margin 0
.column-wrapper
  margin-top 1rem
  display flex
  padding-bottom 2rem
  border-bottom 1px solid var(--borderColor)
  img
    width 80px
    height 80px
    border-radius 2px
    margin-right 1rem
  .column-info
    .title
      font-size 1.6rem
    .description
      color var(--textColor)
      opacity 0.8
      margin 0.5rem 0
.catalogue-wrapper
  .catalogue-title
    font-size 1.45rem
    margin 2rem 0
  .catalogue-content
    dl
      margin-bottom 1.8rem
      &.inline
        display inline-block
        width 50%
        margin-bottom 1rem
        @media (max-width $MQMobileNarrow)
          width 100%
        a
          width 100%
      &:not(.inline)
        dt
          margin-top -($navbarHeight)
          padding-top $navbarHeight
      dt
        font-size 1.1rem
        &:hover .header-anchor
          opacity 1
      dd
        margin-top 0.7rem
        margin-left 1rem
        a:not(.header-anchor)
          margin-bottom 0.5rem
          display inline-block
          width 50%
          &:hover
            color $activeColor
            text-decoration none
          @media (max-width 720px)
            width 100%
      .sub-cat-wrap
        margin 5px 0 8px 0
        font-size 0.95rem
        &> a
          padding-left 1rem
          box-sizing border-box
        .sub-title
          margin-top -($navbarHeight)
          padding-top $navbarHeight
          margin-bottom 6px
          font-size 1rem
        &:hover
          .header-anchor
            opacity 1
</style>

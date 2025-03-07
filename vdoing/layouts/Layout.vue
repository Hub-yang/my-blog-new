<script>
import ArchivesPage from '@theme/components/ArchivesPage.vue'
import BaseTopProgressBar from '@theme/components/BaseTopProgressBar.vue'
import BodyBgImg from '@theme/components/BodyBgImg'
import Buttons from '@theme/components/Buttons.vue'
import CategoriesPage from '@theme/components/CategoriesPage.vue'
import Footer from '@theme/components/Footer'
import Home from '@theme/components/Home.vue'
import Navbar from '@theme/components/Navbar.vue'
import Page from '@theme/components/Page.vue'
import Sidebar from '@theme/components/Sidebar.vue'
import TagsPage from '@theme/components/TagsPage.vue'
import storage from 'good-storage' // 本地存储
import _ from 'lodash'
import { resolveSidebarItems } from '../util'

const MOBILE_DESKTOP_BREAKPOINT = 719 // refer to config.styl
const NAVBAR_HEIGHT = 58 // 导航栏高度

export default {
  components: {
    BaseTopProgressBar,
    Home,
    Navbar,
    Page,
    CategoriesPage,
    TagsPage,
    ArchivesPage,
    Sidebar,
    Footer,
    Buttons,
    BodyBgImg,
  },

  data() {
    return {
      hideNavbar: false,
      isSidebarOpen: true,
      showSidebar: false,
      themeMode: 'auto',
      showWindowLB: true,
      showWindowRB: true,
    }
  },
  computed: {
    sidebarSlotTop() {
      return this.getHtmlStr('sidebarT')
    },
    sidebarSlotBottom() {
      return this.getHtmlStr('sidebarB')
    },
    pageSlotTop() {
      return this.getHtmlStr('pageT')
    },
    pageSlotBottom() {
      return this.getHtmlStr('pageB')
    },
    windowLB() {
      return this.getHtmlStr('windowLB')
    },
    windowRB() {
      return this.getHtmlStr('windowRB')
    },
    showRightMenu() {
      const { headers } = this.$page
      return (
        !this.$frontmatter.home
        && this.$themeConfig.rightMenuBar !== false
        && headers
        && headers.length
        && this.$frontmatter.sidebar !== false
      )
    },
    shouldShowNavbar() {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title
        || themeConfig.logo
        || themeConfig.repo
        || themeConfig.nav
        || this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page
      return (
        !frontmatter.home
        && frontmatter.sidebar !== false
        && this.sidebarItems.length
        && frontmatter.showSidebar !== false
      )
    },

    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath,
      )
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'hide-navbar': this.hideNavbar, // 向下滚动隐藏导航栏
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar,
          'have-rightmenu': this.showRightMenu,
          'have-body-img': this.$themeConfig.bodyBgImg,
          'only-sidebarItem':
              this.sidebarItems.length === 1
              && this.sidebarItems[0].type === 'page', // 左侧边栏只有一项时
        },
        userPageClass,
      ]
    },
  },
  watch: {
    isSidebarOpen() {
      if (this.isSidebarOpen) {
        // 侧边栏打开时，恢复导航栏显示
        this.hideNavbar = false
      }
    },
    themeMode() {
      this.setBodyClass()
    },
  },
  created() {
    const sidebarOpen = this.$themeConfig.sidebarOpen
    if (sidebarOpen === false) {
      this.isSidebarOpen = sidebarOpen
    }
  },
  beforeMount() {
    this.isSidebarOpenOfclientWidth()
    const mode = storage.get('mode') // 不放在created是因为vuepress不能在created访问浏览器api，如window
    const { defaultMode } = this.$themeConfig

    if (defaultMode && defaultMode !== 'auto' && !mode) {
      this.themeMode = defaultMode
    }
    else if (!mode || mode === 'auto' || defaultMode === 'auto') {
      // 当未切换过模式，或模式处于'跟随系统'时
      this._autoMode()
    }
    else {
      this.themeMode = mode
    }
    this.setBodyClass()

    // 引入图标库
    const social = this.$themeConfig.social
    if (social && social.iconfontCssFile) {
      const linkElm = document.createElement('link')
      linkElm.setAttribute('rel', 'stylesheet')
      linkElm.setAttribute('type', 'text/css')
      linkElm.setAttribute('href', social.iconfontCssFile)
      document.head.appendChild(linkElm)
    }
  },
  mounted() {
    const that = this
    // 修改页面标题
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        document.title = '(｡í _ ì｡)不要走呀'
      }
      else {
        document.title = 'ヾ(^▽^*)))欢迎回来!'
        this.timer = setTimeout(() => {
          document.title
              = that.$page.title == 'Home'
              ? 'ヾ(^▽^*)))欢迎访问'
              : that.$page.title || '"ヾ(^▽^*)))欢迎访问'
        }, 1000)
      }
    })
    // 初始化页面时链接锚点无法跳转到指定id的解决方案
    const hash = document.location.hash
    if (hash.length > 1) {
      const id = decodeURIComponent(hash.substring(1))
      const element = document.getElementById(id)
      if (element)
        element.scrollIntoView()
    }

    // 解决移动端初始化页面时侧边栏闪现的问题
    this.showSidebar = true
    this.$router.afterEach(() => {
      this.isSidebarOpenOfclientWidth()
    })

    // 向下滚动收起导航栏
    let p = 0
    let t = 0
    window.addEventListener(
      'scroll',
      _.throttle(() => {
        if (!this.isSidebarOpen) {
          // 侧边栏关闭时
          p = this.getScrollTop()
          if (t < p && p > NAVBAR_HEIGHT) {
            // 向下滚动
            this.hideNavbar = true
          }
          else {
            // 向上
            this.hideNavbar = false
          }
          setTimeout(() => {
            t = p
          }, 0)
        }
      }, 300),
    )
  },
  methods: {
    getHtmlStr(module) {
      const { htmlModules } = this.$themeConfig
      return htmlModules ? htmlModules[module] : ''
    },
    setBodyClass() {
      let { pageStyle = 'card', bodyBgImg } = this.$themeConfig
      if ((pageStyle !== 'card' && pageStyle !== 'line') || bodyBgImg) {
        pageStyle = 'card'
      }
      document.body.className = `theme-mode-${this.themeMode} theme-style-${pageStyle}`
    },
    getScrollTop() {
      return (
        window.pageYOffset
        || document.documentElement.scrollTop
        || document.body.scrollTop
        || 0
      )
    },
    isSidebarOpenOfclientWidth() {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        this.isSidebarOpen = false
      }
    },
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
      this.$emit('toggle-sidebar', this.isSidebarOpen)
    },
    _autoMode() {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // 系统处于深色模式
        this.themeMode = 'dark'
      }
      else {
        this.themeMode = 'light'
      }
    },
    toggleThemeMode(key) {
      if (key === 'auto') {
        this._autoMode()
      }
      else {
        this.themeMode = key
      }
      storage.set('mode', key)
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      }
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        }
        else {
          this.toggleSidebar(false)
        }
      }
    },
  },
}
</script>

<template>
  <div>
    <!-- 置顶进度条 -->
    <BaseTopProgressBar />
    <div
      class="theme-container"
      :class="pageClasses"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />

      <div class="sidebar-mask" @click="toggleSidebar(false)" />

      <div
        v-if="$themeConfig.sidebarHoverTriggerOpen !== false"
        class="sidebar-hover-trigger"
      />

      <Sidebar
        v-show="showSidebar"
        :items="sidebarItems"
        @toggle-sidebar="toggleSidebar"
      >
        <template v-if="sidebarSlotTop" #top>
          <div
            class="sidebar-slot sidebar-slot-top"
            v-html="sidebarSlotTop"
          />
        </template>
        <template v-if="sidebarSlotBottom" #bottom>
          <div
            class="sidebar-slot sidebar-slot-bottom"
            v-html="sidebarSlotBottom"
          />
        </template>
        <!-- <slot name="sidebar-top" #top />
      <slot name="sidebar-bottom" #bottom /> -->
      </Sidebar>

      <!-- 首页 -->
      <Home v-if="$page.frontmatter.home" />

      <!-- 分类页 -->
      <CategoriesPage v-else-if="$page.frontmatter.categoriesPage" />

      <!-- 标签页 -->
      <TagsPage v-else-if="$page.frontmatter.tagsPage" />

      <!-- 归档页 -->
      <ArchivesPage v-else-if="$page.frontmatter.archivesPage" />

      <!-- 文章页或其他页 -->
      <Page v-else :sidebar-items="sidebarItems">
        <template v-if="pageSlotTop" #top>
          <div class="page-slot page-slot-top" v-html="pageSlotTop" />
        </template>
        <template v-if="pageSlotBottom" #bottom>
          <div class="page-slot page-slot-bottom" v-html="pageSlotBottom" />
        </template>
        <!-- <slot
        name="page-top"
        #top
      />
      <slot
        name="page-bottom"
        #bottom
      /> -->
      </Page>

      <div class="footer-mask">
        <Footer />
      </div>

      <Buttons ref="buttons" @toggle-theme-mode="toggleThemeMode" />

      <BodyBgImg v-if="$themeConfig.bodyBgImg" />

      <!-- 自定义html插入左右下角的小窗口 -->
      <div
        v-if="windowLB"
        v-show="showWindowLB"
        class="custom-html-window custom-html-window-lb"
      >
        <div class="custom-wrapper">
          <span class="close-but" @click="showWindowLB = false">×</span>
          <div v-html="windowLB" />
        </div>
      </div>
      <div
        v-if="windowRB"
        v-show="showWindowRB"
        class="custom-html-window custom-html-window-rb"
      >
        <div class="custom-wrapper">
          <span class="close-but" @click="showWindowRB = false">×</span>
          <div v-html="windowRB" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
  .custom-html-window
    position fixed
    bottom 0
    display flex
    overflow hidden
    font-weight 350
    @media (max-width 960px)
      display none
    .custom-wrapper
      position relative
      max-width 200px
      max-height 400px
      .close-but
        cursor pointer
        position absolute
        right 0
        top 0
        font-size 1.5rem
        line-height 1.5rem
        width 1.5rem
        height 1.5rem
        opacity 0
        transition all 0.2s
        &:hover
          opacity 0.9
      &:hover
        .close-but
          opacity 0.7
    &.custom-html-window-lb
      left 0
      z-index 99
      &>*
        align-self flex-end
    &.custom-html-window-rb
      right 80px
      z-index 10
      justify-content flex-end
      &>*
        align-self flex-end
  .footer-mask
    width 100%
</style>

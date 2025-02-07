export const NAV=[
  { text: "首页", link: "/" },
  {
    text: "前端",
    link: "/web/", //目录页链接，此处link是vdoing主题新增的配置项，有二级导航时，可以点击一级导航跳到目录页
    items: [
      // 说明：以下所有link的值只是在相应md文件头部定义的永久链接（不是什么特殊编码）。另外，注意结尾是有斜杠的
      {
        text: "JavaScript",
        items: [
          { text: "JavaScript一行代码API", link: "/pages/a61298/" },
          { text: "new命令原理", link: "/pages/8143cc480faf9a11/" },
          { text: "常见排序算法", link: "/pages/YXRJ6695348/" },
          { text: "JavaScript实用API集合", link: "/pages/52e72668-01c7-47f0-92c2-16b5bb8f5d6d/" },
          { text: "查漏补缺", link: "/pages/8e8f9584-f743-44b5-a220-0c1abc3028d0/" },
        ],
      },
      {
        text: "学习笔记",
        items: [{ text: "《JavaScript教程》", link: "/note/javascript/" }],
      },
      {
        text: "项目笔记",
        items: [
          { text: "文件流导出-预览-分享", link: "/note/wechat/" },
          { text: "将页面导出为word文档", link: "/note/76706a65-3baf-4866-ad05-cb94aaecb21b/" },
          { text: "Bug记录", link: "/note/90f87867-85cf-4153-ab19-9f5bf466d783/" },
        ],
      },
    ],
  },
  {
    text: "刷题",
    link: "/ui/",
    items: [
      {
        text: "简单",
        items: [{ text: "搜索插入位置", link: "/pages/8309a5b876fc95e3/" }],
      },
      { text: "中等", link: "javascript:;" },
    ],
  },
  {
    text: "读书",
    link: "/technology/",
    items: [
      { text: "《自控力》读书笔记", link: "/pages/9a7ee40fc232253e/" },
      { text: "摘录", link: "/pages/de865423-2ebc-4031-8053-339eb5e5f6f4/" },
    ],
  },
  // {
  //   text: "杂谈",
  //   link: "/more/",
  //   items: [
  //     { text: "学习", link: "/pages/f2a556/" },
  //     { text: "面试", link: "/pages/aea6571b7a8bae86/" },
  //     { text: "心情杂货", link: "/pages/2d615df9a36a98ed/" },
  //     { text: "实用技巧", link: "/pages/baaa02/" },
  //   ],
  // },
  {
    text: "索引",
    link: "/archives/",
    items: [
      { text: "分类", link: "/categories/" },
      { text: "标签", link: "/tags/" },
      { text: "归档", link: "/archives/" },
    ],
  },
]
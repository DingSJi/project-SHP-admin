// 平台属性管理模块
import request from '@/utils/request'

// 获取一级分类数据 /admin/product/getCategory1 GET
export const reqCategory1List = request({
  url: "/admin/product/getCategory1",
  method: 'get'
})
// 获取一级分类数据 /admin/product/getCategory2/{category1Id} GET
export const reqCategory2List = (category1Id) => request({
  url: `/admin/product/getCategory2/${category1Id}`,
  method: 'get'
})
// 获取三级分类数据 /admin/product/getCategory2/{category2Id} GET
export const reqCategory3List = (category2Id) => request({
  url: `/admin/product/getCategory2/${category2Id}`,
  method: 'get'
})

// 获取平台属性数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} GET
export const reqAttrList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

// 添加或更新属性与属性值接口 /admin/product/saveAttrInfo POST
/* {
  "attrName": "",
  "attrValueList": [{"attrId": 0,"valueName": ""} ],
  "categoryId": category3Id, "categoryLevel": 3,
} */
export const reqAddOrUpdateAttr = (data) => request({
  url: '/admin/product/saveAttrInfo',
  method: 'post',
  data
})

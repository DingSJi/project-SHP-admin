//主要获取品牌管理数据
import request from '@/utils/request'

// 获取品牌列表 /admin/product/baseTrademark/{page}/{limit}   GET
export const reqTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

// 添加品牌 /admin/product/baseTrademark/save   POST  {logoUrl,tmName} 注：服务器会生成id
// 修改品牌 /admin/product/baseTrademark/update PUT {id,logoUrl,tmName}
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: "put",
      data: tradeMark
    })
  } else {
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMark
    })
  }
}

// 删除品牌 /admin/product/baseTrademark/remove/{id}  DELETE
export const reqDeleteTradeMark = (id) => request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})


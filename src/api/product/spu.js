import request from '@/utils/request'

//获取SPU列表数据 /admin/product/{page}/{limit} GET   page,limit,category3Id
export const reqSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: 'get',
  params: { category3Id }
})

// 获取某一个Spu信息  /admin/product/getSpuById/{spuId} GET
export const reqSpu = (spuId) => request({
  url: `/admin/product/getSpuById/${spuId}`,
  method: 'get'
})
// 获取某一个Spu品牌信息  /admin/product/baseTrademark/getTrademarkList GET
export const reqTradeMarkList = () => request({
  url: '/admin/product/baseTrademark/getTrademarkList',
  method: 'get'
})
// 获取某一个Spu图片  /admin/product/spuImageList/{spuId} GET
export const reqSpuImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method: 'get'
})
// 获取某一个Spu销售属性(最多三个)  /admin/product/baseSaleAttrList GET
export const reqBaseSaleAttrList = () => request({
  url: '/admin/product/baseSaleAttrList',
  method: 'get'
})

// 修改SPU(带id)|添加SPU
export const reqAddOrUpdateSpu = (spuInfo) => {
  if (spuInfo.id) {
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'post',
      data: spuInfo
    })
  } else {
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
}

// 删除spu  /admin/product/deleteSpu/{spuId} DELETE
export const reqDeteleSpu = (spuId) => request({
  url: `/admin/product/deleteSpu/${spuId}`,
  method: 'delete'
})

// 获取销售属性的数据 /admin/product/spuSaleAttrList/{spuId}  GET
export const reqSpuSaleAttrList = (spuId) => request({
  url: `/admin/product/spuSaleAttrList/${spuId}`,
  method: 'get'
})

// 获取平台属性数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} GET
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

// 添加SKU  /admin/product/saveSkuInfo  POST
export const reqAddSku = (skuInfo) => request({
  url: '/admin/product/saveSkuInfo',
  method: 'post',
  data: skuInfo
})

// 获取spu列表数据  /admin/product/findBySpuId/{spuId}  GET
export const reqSkuList = (spuId) => request({
  url: `/admin/product/findBySpuId/${spuId}`,
  method: 'get'
})
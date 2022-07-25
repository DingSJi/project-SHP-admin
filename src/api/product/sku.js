import request from '@/utils/request'

// sku列表接口  /admin/product/list/{page}/{limit}  GET
export const reqSkuList = (page,limit)=>request({
  url:`/admin/product/list/${page}/${limit}`,
  method:'get'
})

// sku下架  /admin/product/cancelSale/{skuId}   GET
export const reqCancel = (skuId)=>request({
  url:`/admin/product/cancelSale/${skuId}`,
  method:'get'
})

// sku上架  /admin/product/onSale/{skuId}   GET
export const reqSale = (skuId)=>request({
  url:`/admin/product/onSale/${skuId}`,
  method:'get'
})

// 获取sku详情 /admin/product/getSkuById/{skuId} GET
export const reqSkuById= (skuId)=>request({
  url:`/admin/product/getSkuById/${skuId}`,
  method:'get'
})
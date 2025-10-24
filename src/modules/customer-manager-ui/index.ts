const routerModules = import.meta.glob('./views/**/index.vue')
//import i18n from "@/locales";

import { getModuleRoutesMap } from '@jetlinks-web/utils'

// const getAsyncRoutesMap = () => {
//     const modules = {}
//     Object.keys(routerModules).forEach(item => {
//         const code = item.replace('./views/', '').replace('/index.vue', '')
//         const key = `${code}`
//         modules[key] = routerModules[item]
//     })

//     return modules
// }

/**
 * 额外子路由是独立于菜单管理之外的页面，比如详情，新增表单页；它们需要挂载在指定路由下。
 */
const getExtraRoutesMap = () => {
  return {}
}

const getComponents = () => ({})

export default {
  getAsyncRoutesMap: () => getModuleRoutesMap(routerModules),
  getExtraRoutesMap,
  getComponents
}

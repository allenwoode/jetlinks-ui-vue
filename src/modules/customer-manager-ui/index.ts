const routerModules = import.meta.glob('./views/**/index.vue')

const getAsyncRoutesMap = () => {
    const modules = {}
    Object.keys(routerModules).forEach(item => {
        const code = item.replace('./views/', '').replace('/index.vue', '')
        const key = `${code}`
        modules[key] = routerModules[item]
    })

    return modules
}

/**
 * 额外子路由是独立于菜单管理之外的页面，比如详情，新增表单页；它们需要挂载在指定路由下。
 */
const getExtraRoutesMap = () => {
  return {}
}

const getComponents = () => ({})

const aliasName = 'customer'

export default {
    getAsyncRoutesMap,
    getExtraRoutesMap,
    getComponents,
    aliasName
}

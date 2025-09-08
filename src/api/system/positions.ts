import { request } from '@jetlinks-web/core'

export const queryPageNoPage = (data?: any) => request.post('/position/_query/no-paging', data)

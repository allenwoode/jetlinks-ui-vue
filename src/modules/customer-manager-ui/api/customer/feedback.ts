import { request } from '@jetlinks-web/core'

// 获取列表
export const getFeedbackList_api = (data: any): Promise<any> => request.post(`/feedback/_query`, data);

// 处理反馈
export const handle_api = (data: any): Promise<any> => request.put(`/feedback/handle`, data);

// 关闭反馈状态
export const close_api = (data: any): Promise<any> => request.put(`/feedback/close/${data.id}`, data);
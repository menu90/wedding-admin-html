import Util from '@/libs/util.js';

/**
 * 用户登录
 */
export const login = params => { 
    return Util.ajax.post(`/user/login`, {
         params: params 
    });
}

/**
 * 添加角色
 * @param {*} params 
 */
export const addRoles = params => { 
    return Util.ajax.post(`/roles/add`, {
         params: params 
    });
}

/**
 * 获取可访问的菜单
 */
export const accessMenu = params =>{
     return Util.ajax.post(`/user/accessMenu`, {
         params: params 
    });
}

/**
 * 查询用户可以操作的按钮
 */
export const lookMenu = params =>{
    return Util.ajax.post(`/user/lookMenu`, {
         params: params 
    });
}
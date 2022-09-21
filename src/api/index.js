// 请求接口集合
import axios from '@/utils/request'
import store from '@/store/index'

export const register = (message) => {         //注册提交
    return axios({ // 返回一个promise实例对象
        url: '/api/reg',
        method: 'POST',
        data: message
    })
}


export const login = ({ username, password }) => {    //登录提交
    return axios({
        url: '/api/login',
        method: 'POST',
        data: {
            username,
            password
        }
    })
}

export const getUserInfo = () => {     //不能加后缀API,否则检测不是一个函数，不知原因，获用户信息
    return axios({
        url: '/my/userinfo',
        /* headers: {          //传递请求头，后续api接口多次追加，避免繁琐，在axios拦截器中进行追加
            Authorization: store.state.token
        } */
    })
}


export const getMenus = () => {
    return axios({
        url: '/my/menus',
        /*  headers: {
             Authorization: store.state.token       //重复
         } */
    })
}

//更新用户信息
export const updateUserInfo = (value) => {
    return axios({
        url: '/my/userinfo',
        method: 'PUT',
        data: value
        //请求头在axios拦截器里添加
    })
}

//更新头像
export const updateAvatar = (avatar) => {
    return axios({
        url: '/my/update/avatar',
        method: 'PATCH',
        data: {
            avatar
        }
    })
}

//更新用户密码
export const updatePwd = ({ old_pwd, new_pwd, re_pwd }) => {
    return axios({
        url: '/my/updatepwd',
        method: 'PATCH',
        data: {
            old_pwd,
            new_pwd,
            re_pwd
        }
    })
}

//获取所有文章分类情况
export const getArtCate = () => {
    return axios({
        url: '/my/cate/list',

    })
}

//添加文章分类
export const addCate = ({ cate_name, cate_alias }) => {
    return axios({
        url: '/my/cate/add',
        method: 'POST',
        data: {
            cate_name,
            cate_alias
        }
    })
}

//获取单个文章分类具体情况

export const getOneCate = (id) => {
    return axios({
        url: `/my/cate/info?id=${id}`,
        /* params: {  //query参数，自动拼接到地址上
            id
        } */
    })
}


//更新文章分类信息
export const updateCate = ({ id, cate_name, cate_alias }) => {
    return axios({
        url: '/my/cate/info',
        method: 'PUT',
        data: {
            id, cate_name, cate_alias
        }
    })
}

//删除文章分类
export const deleteCate = (id) => {
    return axios({
        url: `/my/cate/del?id=${id}`,
        method: 'DELETE'

    })
}

//发布文章,参数要的是表单对象, 不能写普通对象, axios内部会判断, 如果是表单对象, 传递的请求体会设置Content-Type: form-data与后端对应
export const loadArticle = (article) => { /* 这里又写错了，写成acticle */
    return axios({
        url: '/my/article/add',
        method: 'POST',
        data: article
    })
}


//获取所有文章详情
export const getAllArticle = ({ pagenum, pagesize, cate_id, state }) => {
    return axios({
        url: '/my/article/list',
        params: {
            pagenum, pagesize, cate_id, state
        }
    })
}

//获取单个文章的详情
export const getOneArticle = (id) => {
    return axios({
        url: '/my/article/info',
        params: {
            id
        }
    })
}

//删除文章  
export const deleteArt = (id) => {
    return axios({
        url: '/my/article/info',
        method: 'DELETE',
        params: {
            id
        }
    })
}
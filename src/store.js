import Vue from 'vue'
import Vuex from 'vuex'
import common from './components/common.vue'

Vue.use(Vuex)

const vm = Vue.prototype;

const state = {
    userInfo: {},
    noticeId: '',
    notice: '',
}

const getters = {
    userInfo: (state) => state.userInfo,
    noticeId: (state) => state.noticeId,
    notice: (state) => state.notice,
}

const actions = {
    // 任务列表
    getNotice: ({ commit }) => {
        return vm.$fly.get('/api/CompanyOption/GetNotice', { type: 2 })
        .then((res) => {
            let { returnCode, returnMsg, data } = res;
            let content = data ? data.content : '';
            commit('getNotice', content); 
            return Promise.resolve(data);
        })
    },
    // 用户中心数据
    getUserInfo: ({ commit }) => {
        return vm.$fly.get('/api/CompanyOption/CardBusinessInfo', common.connectObj())
        .then((res) => {
            let { returnCode, returnMsg, data } = res;
            if (returnCode == 100) {
                localStorage.setItem('appid', data.appid);
                commit('getUserInfo', data);                
            } else {
                vm.$toast(returnMsg);
            }
        })
    },
    // 保存公告id，用于注销时清除本地缓存
    setNoticeId: ({ commit }, id) => {
        commit('setNoticeId', id)
    },
}

const mutations = {
    getUserInfo(state, data) {
        state.userInfo = data;
    },
    getNotice(state, data) {
        state.notice = data;
    },
    setNoticeId(state, id) {
        state.noticeId = id;
    },
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})

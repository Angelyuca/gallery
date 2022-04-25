import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

const headers = {
    "Authorization": "Client-ID Hr_5AxnTJYMPmu8uG6FN8MLtIKLFQ0zgg7TF1DEKLSA",
    "Accept-Version": "v1"
}

export default new Vuex.Store({
    state: {
        images: []
    },
    mutations: {
        setImages(state, data) {
            if(data.page == 1){
                state.images = data.data
            } else state.images.push(...data.data)
        },
    },
    actions: {
        get(store, page = 1) {
            const route = `https://api.unsplash.com/photos?page=${page}`
            return axios.get(route, {headers}).then(response => {
                store.commit("setImages", {data: response.data, page})
                return response.data
            }).catch(error => {
                console.warn(error)
                return error
            })
        },
        search(store, data){
            const route = `https://api.unsplash.com/search/photos?page=${data.page}&query=${data.search}`
            return axios.get(route, {headers}).then(response => {
                store.commit("setImages", {data: response.data.results, page: data.page})
                return response.data
            }).catch(error => {
                console.warn(error)
                return error
            })
        }
    },
    getters: {},
    modules: {}
})
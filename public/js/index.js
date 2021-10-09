"use strict";

var router = new VueRouter({
    routes: [
        { path: "/search", component: Vue.component("main-search") },
        { path: "/tags", component: Vue.component("main-tags") },
        { path: "/upload", component: Vue.component("main-upload") },
        { path: "/options", component: Vue.component("main-options") },
        { path: "/view/:id", component: Vue.component("main-view") },
        { path: "/wiki/:name", component: Vue.component("main-wiki") },
        { path: "/", redirect: "/search" },
    ],
});

Vue.http.options.root = "/api";

var app = new Vue({
    router: router,
    data: {
        title: "JSBooru",
        itemsPerPage: 20,
    },
    methods: {
        setItemsPerPage: function (newValue) {
            this.itemsPerPage = newValue;
            this.saveToLocalStorage();
        },
        saveToLocalStorage: function () {
            var data = {
                itemsPerPage: this.itemsPerPage,
            };
            var dataAsDecodedString = JSON.stringify(data);
            var dataAsEncodedString = btoa(dataAsDecodedString);
            window.localStorage.setItem("options", dataAsEncodedString);
        },
        loadFromLocalStorage: function () {
            var dataAsEncodedString =
                window.localStorage.getItem("options") || "";
            var dataAsDecodedString = atob(dataAsEncodedString) || "";
            var data = {};
            try {
                data = JSON.parse(dataAsDecodedString) || {};
            } catch {
                // NO OP
            }
            this.itemsPerPage = data.itemsPerPage || 20;
        },
    },
    created: function () {
        this.loadFromLocalStorage();
    },
}).$mount("#app");

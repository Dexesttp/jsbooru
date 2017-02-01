"use strict";

var router = new VueRouter({
    routes: [
        { path: "/view/:id", component: Vue.component("main-view") },
        { path: "/wiki/:name", component: Vue.component("main-wiki") },
        { path: "/search", component: Vue.component("main-search") },
        { path: "/upload", component: Vue.component("main-upload") },
        { path: "/", redirect: "/search" },
    ],
});

Vue.http.options.root = "/api";

var app = new Vue({
    router: router,
    data: {
        title: "JSBooru",
    },
}).$mount("#app");

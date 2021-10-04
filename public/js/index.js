"use strict";

var router = new VueRouter({
    routes: [
        { path: "/search", component: Vue.component("main-search") },
        { path: "/tags", component: Vue.component("main-tags") },
        { path: "/upload", component: Vue.component("main-upload") },
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
    },
}).$mount("#app");

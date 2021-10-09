"use strict";

var Tags = Vue.component("main-tags", {
    template: "#tags-template",
    data: function () {
        return {
            entries: [],
        };
    },
    methods: {
        init: function () {
            this.getData();
        },
        setRequest: function (request) {
            router.push("/search?q=" + request);
        },
        deleteTag: function (tag) {
            // TODO
            var self = this;
            this.$http.delete(`tag/${tag.name}`).then(function () {
                self.getData();
            });
        },
        getData: function () {
            var self = this;
            this.$http
                .get("tags/list")
                .then(function (response) {
                    self.entries = response.body.sort(function (a, b) {
                        const diff = b.count - a.count;
                        if (diff !== 0) {
                            return diff;
                        }
                        return a.name.localeCompare(b.name);
                    });
                })
                .then(undefined, function (response) {
                    console.warn("Request failed on tag list");
                });
        },
    },
    created: function (to, from) {
        this.init();
    },
});

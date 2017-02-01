"use strict";

var Wiki = Vue.component("main-wiki", {
    template: "#wiki-template",
    data: function () {
        return {
            name: "",
            type: "no-type",
            count: 0,
            entries: [],
        };
    },
    methods: {
        init: function () {
            this.name = this.$route.params.name;
            this.getData();
        },
        getData: function () {
            var self = this;
            this.$http
                .get("wiki/tag/" + this.name)
                .then(function (response) {
                    self.type = response.body.type;
                    self.count = response.body.count;
                    self.entries = response.body.wiki;
                })
                .then(undefined, function (response) {
                    console.warn("Request failed on tag wiki");
                });
        },
        setRequest: function (request) {
            router.push("/search?q=" + request);
        },
        editType: function (type) {
            var self = this;
            this.$http
                .post("tag/" + this.name + "/" + type)
                .then(function (reply) {
                    self.getData();
                });
        },
    },
    created: function (to, from) {
        this.init();
    },
    watch: {
        "$route.query.q": function (to, from) {
            if (to !== from) this.init();
        },
        "$route.query.s": function (to, from) {
            if (to !== from) this.init();
        },
    },
});

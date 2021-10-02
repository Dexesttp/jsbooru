"use strict";

var View = Vue.component("main-view", {
    template: "#view-template",
    data: function () {
        return {
            id: "",
            image: null,
            tags: [],
            limitSize: true,
        };
    },
    methods: {
        init: function () {
            this.id = this.$route.params.id;
            this.selectImage();
        },
        selectImage: function () {
            var self = this;
            this.$http
                .get("image/" + this.id)
                .then(function (response) {
                    self.image = response.body;
                    self.tags = response.body.tags.sort(function (a, b) {
                        var nameA = a.name.toUpperCase();
                        var nameB = b.name.toUpperCase();
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    });
                })
                .then(undefined, function (error) {
                    console.warn(error);
                });
        },
        setRequest: function (request) {
            router.push("/search?q=" + request);
        },
        addTag: function (tags) {
            var self = this;
            var tag = tags.trim().split(" ").pop();
            if (confirm("Add the tag '" + tag + "' to this picture ?")) {
                this.$http
                    .post("image/" + this.id + "/" + tag)
                    .then(function (reply) {
                        self.selectImage();
                    });
            }
        },
        deleteTag: function (tagName) {
            var self = this;
            if (
                confirm("Delete the tag '" + tagName + "' from this picture ?")
            ) {
                this.$http
                    .delete("image/" + this.id + "/" + tagName)
                    .then(function (reply) {
                        self.selectImage();
                    });
            }
        },
        editRating: function (value) {
            if (confirm("Set the rating to '" + value + "' ?"))
                this.setImageValue("rating", value);
        },
        editUser: function (value) {
            if (confirm("Set the uploader to '" + value + "' ?"))
                this.setImageValue("user", value);
        },
        editSource: function (value) {
            if (confirm("Set the source to '" + value + "' ?"))
                this.setImageValue("source", value);
        },
        setImageValue: function (name, value) {
            var self = this;
            var data = {};
            data[name] = value;
            this.$http.post("image/" + this.id, data).then(function (reply) {
                self.selectImage();
            });
        },
        toggleSizeLimit: function () {
            this.limitSize = !this.limitSize;
        },
    },
    created: function (to, from) {
        this.init();
    },
    watch: {
        $route: function (to, from) {
            if (from !== to) this.init();
        },
    },
});

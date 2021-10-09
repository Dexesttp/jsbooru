"use strict";

var Search = Vue.component("main-search", {
    template: "#search-template",
    props: {
        itemsPerPage: {
            type: Number,
            default: 20,
        },
    },
    data: function () {
        return {
            currentTags: "",
            pos: 0,
            count: 0,
            images: [],
            tags: [],
            loaded: false,
        };
    },
    computed: {},
    methods: {
        init: function () {
            this.currentTags = this.$route.query.q || "";
            this.pos = +(this.$route.query.s || "");
            this.getItems();
        },
        getItems: function () {
            var self = this;

            this.$http
                .get("image", {
                    params: {
                        s: this.pos,
                        l: this.itemsPerPage,
                        q: this.currentTags,
                    },
                })
                .then(function (response) {
                    self.count = response.body.count;
                    self.images = response.body.result.map(function (image) {
                        return {
                            id: image._id,
                            link: "/view/" + image._id,
                            thumbnail: image.thumbnail || image.url,
                            tags: image.tags ? image.tags.join(" ") : "",
                        };
                    });
                    self.tags = response.body.tags.sort(function (a, b) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        return 0;
                    });
                })
                .then(undefined, function (response) {
                    console.warn("Request failed on image list get");
                });
        },
        selectImage: function (imageID) {
            router.push("/view/" + imageID);
        },
        setRequest: function (request) {
            this.currentTags = request.trim();
            this.goTo();
        },
        addTag: function (tag) {
            this.currentTags = (this.currentTags + " " + tag).trim();
            this.goTo();
        },
        goTo: function () {
            router.push("/search?q=" + this.currentTags);
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

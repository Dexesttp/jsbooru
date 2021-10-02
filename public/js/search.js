"use strict";

var Search = Vue.component("main-search", {
    template: "#search-template",
    data: function () {
        return {
            currTags: "",
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
            this.currTags = this.$route.query.q || "";
            this.pos = +(this.$route.query.s || "");
            this.getItems();
        },
        getItems: function () {
            var self = this;

            this.$http
                .get("image", { params: { s: this.pos, q: this.currTags } })
                .then(function (response) {
                    self.count = response.body.count;
                    self.images = response.body.result.map(function (image) {
                        return {
                            id: image._id,
                            link: "/view/" + image._id,
                            thumbnail: image.url,
                            tags: image.tags ? image.tags.join(" ") : "",
                        };
                    });
                    self.tags = response.body.tags.sort(function (a, b) {
                        if (a < b) return -1;
                        if (a > b) return 1;
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
        selectPage: function (start) {
            router.push("/search?s=" + start + "&q=" + this.currTags);
        },
        setRequest: function (request) {
            this.currTags = request.trim();
            this.goTo();
        },
        addTag: function (tag) {
            this.currTags = (this.currTags + " " + tag).trim();
            this.goTo();
        },
        goTo: function () {
            router.push("/search?q=" + this.currTags);
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

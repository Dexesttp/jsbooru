"use strict";

var Search = Vue.component('main-search', {
    template: "#search-template",
    data: function() {
        return {
            currTags: "",
            pos: 0,
            count: 0,
            images: [],
            tags: [],
            loaded: false,
        };
    },
    computed: {

    },
    methods: {
        init: function() {
            this.currTags = this.$route.query.q || "";
            this.pos = +(this.$route.query.s || "");
            this.getItems();
        },
        getItems: function() {
            var self = this;
            var ajax = new XMLHttpRequest();
            if(this.currTags)
                ajax.open('GET', "/api/image?q=" + this.currTags + "&s=" + this.pos);
            else
                ajax.open('GET', "/api/image?s=" + this.pos);
            ajax.addEventListener('loadend', function(data) {
                var json = JSON.parse(this.responseText);
                self.count = json.count;
                self.images = json.result.map(function(image) {
                    return {
                        id: image._id,
                        link: `/view?id=${image._id}`,
                        thumbnail: image.url,
                        tags: image.tags ? image.tags.join(" ") : "",
                    };
                });
                self.tags = [];
                json.result
                    .reduce(function(prev, image) {return prev.concat(image.tags || []);}, [])
                    .filter(function(i, idx, arr) {return arr.indexOf(i) === idx; })
                    .forEach(function(tagName) {
                        var ajax = new XMLHttpRequest();
                        ajax.open('GET', `/api/tag/${tagName}`);
                        ajax.addEventListener('loadend', function(data) {
                            var json = JSON.parse(this.responseText);
                            if(self.tags.every(function(t) {
                                return t.name !== json.name;
                            })) {
                                self.tags.push(json);
                                self.tags = self.tags.sort(function(a, b) {
                                    var nameA = a.name.toUpperCase();
                                    var nameB = b.name.toUpperCase();
                                    if (nameA < nameB)return -1;
                                    if (nameA > nameB)return 1;
                                    return 0;
                                });
                            }
                        });
                        ajax.send();
                    });
            });
            ajax.send();
        },
        selectImage: function(imageID) {
            router.push("/view/" + imageID);
        },
        selectPage: function(start) {
            router.push("/search?s=" + start + "&q=" + this.currTags);
        },
        setRequest: function(request) {
            this.currTags = request.trim();
            this.goTo();
        },
        addTag: function(tag) {
            this.currTags = (this.currTags + " " + tag).trim();
            console.log(this.request);
            this.goTo();
        },
        goTo: function() {
            router.push("/search?q=" + this.currTags);
        }
    },
    created: function(to, from) {
        this.init();
    },
    watch: {
        '$route.query.q': function(to, from) {
            if(to !== from) this.init();
        },
        '$route.query.s': function(to, from) {
            if(to !== from) this.init();
        }
    }
});

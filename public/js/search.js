"use strict";

var Search = Vue.component('main-search', {
    template: "#search-template",
    data: function() {
        return {
            currTags: "",
            images: [],
            tags: [],
            loaded: false,
        };
    },
    methods: {
        init: function() {
            this.currTags = this.$route.params.tags || "";
            this.getItems();
        },
        getItems: function() {
            var self = this;
            var ajax = new XMLHttpRequest();
            if(this.currTags)
                ajax.open('GET', "/api/images?q=" + this.currTags);
            else
                ajax.open('GET', "/api/images");
            ajax.addEventListener('loadend', function(data) {
                var json = JSON.parse(this.responseText);
                self.images = json.map(function(image) {
                    return {
                        id: image._id,
                        link: `/view?id=${image._id}`,
                        thumbnail: image.url,
                        tags: image.tags ? image.tags.join(" ") : "",
                    };
                });
                self.tags = [];
                json
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
            router.push("/search/" + this.currTags);
        }
    },
    created: function(to, from) {
        this.init();
    },
    watch: {
        '$route.params.tags': function(to, from) {
            if(to !== from) this.init();
        }
    }
});

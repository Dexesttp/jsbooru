"use strict";

var View = Vue.component('main-view', {
    template: "#view-template",
    data: function() {
        return {
            id: "",
            image: null,
            tags: []
        };
    },
    methods: {
        init: function() {
            this.id = this.$route.params.id;
            this.selectImage();
        },
        selectImage: function() {
            var self = this;
            var ajax = new XMLHttpRequest();
            ajax.open('GET', "/api/image/" + this.id);
            ajax.addEventListener("loadend", function(data) {
                var json = JSON.parse(this.responseText);
                self.image = json;
                self.tags = json.tags.sort(function(a, b) {
                    var nameA = a.name.toUpperCase();
                    var nameB = b.name.toUpperCase();
                    if (nameA < nameB)return -1;
                    if (nameA > nameB)return 1;
                    return 0;
                });
            });
            ajax.send();
        },
        setRequest: function(request) {
            router.push('/search?q=' + request);
        },
        addTag: function(tags) {
            var self = this;
            var tag = tags.trim().split(" ").pop();
            if(confirm("Add the tag '" + tag + "' to this picture ?")) {
                var ajax = new XMLHttpRequest();
                ajax.open('POST', "/api/image/" + this.id + "/" + tag);
                ajax.addEventListener('loadend', function(data) {
                    self.selectImage();
                });
                ajax.send();
            }
        },
        deleteTag: function(tagName) {
            var self = this;
            if(confirm("Delete the tag '" + tagName + "' from this picture ?")) {
                var ajax = new XMLHttpRequest();
                ajax.open('DELETE', "/api/image/" + this.id + "/" + tagName);
                ajax.addEventListener('loadend', function(data) {
                    self.selectImage();
                });
                ajax.send();
            }
        },
        editRating: function(value) {
            if(confirm("Set the rating to '" + value + "' ?"))
                this.setImageValue("rating", value);
        },
        editUser: function(value) {
            if(confirm("Set the uploader to '" + value + "' ?"))
                this.setImageValue("user", value);
        },
        editSource: function(value) {
            if(confirm("Set the source to '" + value + "' ?"))
                this.setImageValue("source", value);
        },
        setImageValue: function(name, value) {
            var self = this;
            var ajax = new XMLHttpRequest();
            ajax.open('POST', "/api/image/" + this.id);
            ajax.setRequestHeader("Content-Type", "application/json");
            ajax.addEventListener('loadend', function(data) {
                self.selectImage();
            });
            var data = {};
            data[name] = value;
            ajax.send(JSON.stringify(data));
        }
    },
    created: function(to, from) {
        this.init();
    },
    watch: {
        '$route': function(to, from) {
            if(from !== to) this.init();
        }
    },
});

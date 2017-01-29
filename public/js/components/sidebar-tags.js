"use strict";

Vue.component("sidebar-tags", {
    template: "#sidebar-tags-template",
    props: {
        allowDelete: Boolean,
        tags: Array,
    },
    methods: {
        searchTag: function(tagName) {
            this.$emit('select', String(tagName));
        },
        deleteTag: function(tagName) {
            this.$emit('delete', String(tagName));
        }
    }
});
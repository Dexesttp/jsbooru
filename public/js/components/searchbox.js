"use strict";

Vue.component("search-box", {
    template: "#searchbox-template",
    components: {
        autocomplete: Vue2Autocomplete
    },
    props: {
        current: String,
    },
    methods: {
        formatData: function(data) {
            return (
            `<div class="reply">
                <span class="title">${data.name}</span>
                <span class="count">(${data.count})</span>
            </div>`);
        },
        processData: function(data) {
            return data.sort(function (d1, d2) {
                if(d1.count > d2.count) return -1;
                if(d1.count < d2.count) return 1;
                return 0;
            })
        },
        getData: function(tag) {
            this.$emit("select", tag.result);
        },
    }
});
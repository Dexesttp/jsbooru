"use strict";

Vue.component("add-box", {
    template: "#addbox-template",
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
        getData: function(tag) {
            this.$emit("select", tag.result);
        },
    }
});
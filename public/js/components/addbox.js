"use strict";

Vue.component("add-box", {
    template: "#addbox-template",
    components: {
        autocomplete: Vue2Autocomplete,
    },
    props: {
        current: String,
    },
    methods: {
        processData: function (data) {
            if (data[0].match) {
                var original = data[0].query.split(" ").pop();
                data.push({
                    count: 0,
                    match: false,
                    name: original,
                    query: data[0].query,
                    result: original,
                });
            }
            return data;
        },
        formatData: function (data) {
            if (data.match) {
                return `<div class="reply">
                    <span class="title tag ${data.type}">${data.name}</span>
                    <span class="count">(${data.count})</span>
                </div>`;
            }
            return `<div class="reply">
                    <span class="title">${data.query}</span>
                    <span class="count">create</span>
                </div>`;
        },
        getData: function (tag) {
            this.$emit("select", tag.result);
        },
    },
});

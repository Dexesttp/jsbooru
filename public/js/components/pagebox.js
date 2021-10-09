"use strict";

Vue.component("page-box", {
    template: "#pagebox-template",
    props: {
        start: {
            default: 0,
            type: Number,
        },
        itemsPerPage: {
            default: 20,
            type: Number,
        },
        count: {
            default: 0,
            type: Number,
        },
        currentTags: String,
    },
    computed: {
        pages: function () {
            var arrayCount = Math.ceil(this.count / this.itemsPerPage);
            var array = [];
            var curr = 0;
            while (curr < arrayCount) {
                var value = curr * this.itemsPerPage;
                var pageUrl = "/search?s=" + value;
                if (this.currentTags) pageUrl += "&q=" + this.currentTags;
                array.push({
                    identifier: curr + 1,
                    value: value,
                    url: pageUrl,
                    selected:
                        this.start <= value &&
                        value < this.start + this.itemsPerPage,
                });
                curr++;
            }
            return array;
        },
    },
});

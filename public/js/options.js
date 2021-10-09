"use strict";

var Options = Vue.component("main-options", {
    props: {
        itemsPerPage: {
            type: Number,
            default: 20,
        },
    },
    template: "#options-template",
    methods: {
        setItemsPerPage: function (newValueString) {
            var newValue = +newValueString;
            if (isNaN(newValue) || newValue <= 0) {
                return;
            }
            this.$emit("set-items-per-page", newValue);
        },
    },
});

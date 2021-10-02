"use strict";

Vue.component("image-data", {
    template: "#image-data-template",
    props: {
        image: {
            type: Object,
            default: {},
        },
    },
    methods: {
        editRating: function (value) {
            this.$emit("editRating", value);
        },
        editUser: function (value) {
            this.$emit("editUser", value);
        },
        editSource: function (value) {
            this.$emit("editSource", value);
        },
        deleteImage: function () {
            this.$emit("deleteImage");
        },
    },
});

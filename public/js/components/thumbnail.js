"use strict";

Vue.component("image-thumbnail", {
    template: "#thumbnail-template",
    props: {
        image: Object,
    },
    methods: {
        selectImage: function () {
            this.$emit("select", String(this.image.id));
        },
    },
});

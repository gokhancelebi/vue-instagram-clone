<script setup>
const envs = import.meta.env

defineProps(['posts'])
</script>
<template>
    <div class="image-gallery-container">
        <img 
            v-for="post in posts" 
            :key="post.id" 
            :src="`${envs.VITE_IMAGE_PATH_PREFIX + post.url}`" alt="" 
        />
    </div>
</template>
<style scoped>
.image-gallery-container{
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
}
img{
    margin: 5px;
    width: 200px;
}
</style>
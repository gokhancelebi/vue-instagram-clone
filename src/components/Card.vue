<script setup>

const props = defineProps(['post'])
const envs = import.meta.env

</script>
<template>
    <ACard hoverable style="width: 240px" class="card">
      <template #cover>
        <img :alt="post.username" :src="`${envs.VITE_IMAGE_PATH_PREFIX + post.url}`" />
      </template>
      <ACardMeta :title="post.username">
        <template #description>{{ post.url + post.caption }}</template>
      </ACardMeta>
    </ACard>
</template>  
<style scoped>
.card{
  margin-bottom: 20px;
}
</style>
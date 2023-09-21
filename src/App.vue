<script setup>
import Nav from './components/Nav.vue';

import { useUserStore } from './stores/users';

import {onMounted} from 'vue'

const userStore = useUserStore()

onMounted( ( ) => {
  userStore.getUser( )
})

</script>
<template>
  <ALayout class="layout">
    <Nav />
    <RouterView />
  </ALayout>
</template>
<style scoped>

</style> 
<script setup>

import Container from './Container.vue';

import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import TimeLineCards from './TimelineCards.vue'

const userStore = useUserStore()
const { user: loggedInUser, loadingUser } = storeToRefs(userStore)

</script>
<template>
    <Container>
        <div v-if="!loadingUser">
            <TimeLineCards v-if="loggedInUser" />
            <div v-else class="timeline-container">
                <h2>
                    Log in to see posts !
                </h2>
            </div>
        </div>
        <div class="timeline-container" v-else>
            <ASpin />
        </div>
    </Container>
</template>
<style scoped>
.timeline-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
}
</style>
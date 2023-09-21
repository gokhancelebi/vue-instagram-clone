<script setup>

import { onMounted, ref } from 'vue'

import { supabase } from '../supabase';

import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';

import Card from './Card.vue';
import Observer from './Observer.vue'


const userStore = useUserStore()
const { user: loggedInUser, loadingUser } = storeToRefs(userStore)
const posts = ref([])
const loadingPosts = ref(false)
const loadingNewPosts = ref(false)

const offset = ref(0)
const loadMore = ref(true)

const fetchData = async () => {

    if (loadMore.value === true && loadingNewPosts.value === false) {

        loadingNewPosts.value = true

        const { data: followedAcccountIds } = await supabase
            .from('followers_following')
            .select('following_id')
            .eq('follower_id', loggedInUser.value.id)

        const res = await supabase
            .from('posts')
            .select()
            .in('owner_id', followedAcccountIds.map(f => f.following_id))
            .range(offset.value, offset.value + 2)
            .order('created_at', { ascending: false })

        offset.value = offset.value + 3
 

        if (res.data.length) {
            posts.value = [
                ...posts.value,
                ...res.data
            ]
        }else{
            loadMore.value = false
        }
        
        loadingNewPosts.value = false

    }

}


const fetchNextSet =  async () => {
    await fetchData()
}

onMounted(async () => {
    loadingPosts.value = true
    await fetchData()
    loadingPosts.value = false
})

</script>
<template>
    <div v-if="loggedInUser" class="timeline-container">
        <ASpin v-if="loadingPosts" />
        <div v-else class="timeline-container">
            <Card v-if="posts.length" v-for="post in posts" :key="post.id" :post="post" />
            <h1 v-else>No posts so far...</h1>
            <ASpin v-if="loadingNewPosts" />
            <Observer v-else="posts.length && !loadingNewPosts" @intersect="fetchNextSet" />
        </div>
    </div>
    <div v-else class="timeline-container">
        <h1> You should logged in first</h1>
    </div>
</template>
<style scoped>
.timeline-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
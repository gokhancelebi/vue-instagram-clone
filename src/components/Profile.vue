<script setup>

import { ref, onMounted, watch,reactive } from 'vue'
import { useRoute } from 'vue-router'

import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia'

import Container from './Container.vue';
import ImageGallery from './ImageGallery.vue';
import UserBar from './UserBar.vue';

import { supabase } from './../supabase'

const route = useRoute();
const userStore = useUserStore()
const { user: loggedInUser } = storeToRefs(userStore)
const { username } = route.params
const posts = ref([])
const loading = ref(false)
const user = ref(null)
const isFollowing = ref(false)

const userInfo = reactive({
    posts: null,
    followers: null,
    following: null
})

const addNewPost = (post) => {
    posts.value.unshift(post)
}

const fetchData = async () => {

    loading.value = true

    const { data: userData } = await supabase
        .from('users')
        .select()
        .eq('username', username)
        .single()



    if (!userData) {
        loading.value = false
        console.log('testpip ediemiyor')
        return user.value = null
    }

    user.value = userData


    const { data, error } = await supabase
        .from('posts')
        .select()
        .eq('owner_id', user.value.id)

    if (!error) {
        posts.value = data
    }

    console.log('hedef kullanıcı set', loggedInUser.value)

    await fetchIsFollowing()
    await fetchFollowerCount()
    await fetchFollowingCount()
    await fetchPostCount()
    
    loading.value = false
}


const fetchIsFollowing = async () => {

    if (loggedInUser.value && (loggedInUser.value.id !== user.value.id)) {

        const { data, error } = await supabase
            .from('followers_following')
            .select()
            .eq('follower_id', loggedInUser.value.id)
            .eq('following_id', user.value.id)
            .single()

            console.log('isFollowing',{data})

        if (data) {
            isFollowing.value = true
        }

       // console.log('follower sorgusu', loggedInUser.value, user.value, isFollowing.value)
    }

    console.log('IsFallowing' , isFollowing.value)

}



const fetchFollowingCount = async () => {
    const response = await supabase
    .from('followers_following')
    .select()
    .eq('follower_id',user.value.id)

    if(response.data){
        userInfo.following = response.data.length
    }
}

const fetchFollowerCount = async () => {
    const response = await supabase
    .from('followers_following')
    .select()
    .eq('following_id',user.value.id)

    if(response.data){
        userInfo.followers = response.data.length
    }

    console.log(response)
}

const fetchPostCount = async () => {
    const response = await supabase
    .from('posts')
    .select()
    .eq('owner_id',user.value.id)

    if(response.data){
        userInfo.posts = response.data.length
    }
 
}


const updateFollowing = (value) => {
    isFollowing.value = value
}


watch(loggedInUser, () => {
    fetchIsFollowing()
})

watch(user, () => {
    fetchIsFollowing()
})

onMounted(() => {
    fetchData()
})

</script>
<template>
    <Container>
        <div class="profile-container">
            <UserBar :key="$route.params.username" :user="user" :userInfo="userInfo" :isFollowing="isFollowing" :updateFollowing="updateFollowing" :updateFollowerCount="fetchFollowerCount" :addNewPost="addNewPost" />
            <div class="gallery-container">
                <ImageGallery v-if="!loading" :posts="posts" />
                <div v-else>
                    <ASpin />
                </div>
            </div>
        </div>
    </Container>
</template>
<style scoped>
.profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    padding-bottom: 100px;
}

.gallery-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}
</style>
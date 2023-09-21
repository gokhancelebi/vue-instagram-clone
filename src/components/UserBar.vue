<script setup>
import {ref,onMounted,watch} from 'vue'
import uploadPhotoModal from "./UploadPhotoModal.vue"
import { useUserStore } from "../stores/users";
import {useRoute} from 'vue-router'
import {storeToRefs} from 'pinia'
import {supabase} from '../supabase' 

const route = useRoute()
const {username:profileUsername} = route.params

const props = defineProps(['user','userInfo','addNewPost','isFollowing','updateFollowing','updateFollowerCount','updateFollowingCount'])


const userStore = useUserStore()
const {user} = storeToRefs(userStore)

const handleFollow = async () => {
    props.updateFollowing(true)
    await supabase.from('followers_following').insert({
        follower_id: user.value.id,
        following_id:  props.user.id
    })
    await props.updateFollowerCount()
}

const handleUnFollowUser = async () => {
    props.updateFollowing(false)
    await supabase.from('followers_following').delete()
    .eq('follower_id', user.value.id)
    .eq('following_id',  props.user.id)
    await props.updateFollowerCount()
}

</script>
<template>
    <div class="userbar-container">
        <div class="top-content">
            <ATypographyTitle :level="2">@{{ profileUsername }}</ATypographyTitle>
            <AButtonGroup  v-if="user">
                <uploadPhotoModal 
                    :addNewPost="addNewPost" 
                    v-if="profileUsername === user.username" 
                />
                <div v-if="!(profileUsername === user.username)" >
                    <AButton v-if="!props.isFollowing" @click="handleFollow" >Follow</AButton>
                    <AButton v-else="props.isFollowing" @click="handleUnFollowUser">Following</AButton>
                </div>
            </AButtonGroup>
        </div>
        <div class="bottom-content">
            <ATypographyTitle :level="5">{{ props.userInfo.posts }} Posts</ATypographyTitle>
            <ATypographyTitle :level="5">{{ props.userInfo.followers }} Followrers</ATypographyTitle>
            <ATypographyTitle :level="5">{{ props.userInfo.following }} Following</ATypographyTitle>
        </div>
    </div>
</template>
<style scoped>
.userbar-container{
    display: flex;
    padding-bottom: 75px;
    flex-direction: column;
    width: 100%;
}
.bottom-content{
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.bottom-content h5{
    margin: 0 !important;
    padding:0;
    margin-right: 30px !important;
    margin-bottom: 30px !important;
    align-items: center;
}
.top-content{
    display: flex;
    justify-content: space-between;
}
</style>
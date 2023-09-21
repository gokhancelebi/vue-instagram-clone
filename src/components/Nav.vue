<script setup>
import { RouterLink,useRouter } from 'vue-router'
import Container from './Container.vue'
import AuthModal from './AuthModal.vue';
import { ref } from 'vue'

import {useUserStore} from '../stores/users'
import {storeToRefs} from 'pinia'

const userStore = useUserStore()

const { user,loadingUser } = storeToRefs(userStore)

const searchUsername = ref("")
const router = useRouter()

const onSearch = () => {
    if(!searchUsername){
        return;
    }
    router.push(`/profile/${searchUsername.value}`)
    searchUsername.value = ""
}

const handleLogout = async ( ) => {
    await userStore.handleLogout()
}

const goToUsersProfile = () => {
    router.push(`/profile/${user.value.username}`)
}


</script>
<template>
    <ALayoutHeader>
        <Container>
            <div class="nav-container">
                <div class="left-content">
                    <RouterLink to="/">Instagram</RouterLink>
                    <AInputSearch 
                        v-model:value="searchUsername" 
                        placeholder="input search text" 
                        style="width: 200px"
                        @search="onSearch" 
                    />
                </div>
                <div class="content" v-if="!loadingUser">
                    <div class="right-content"  v-if="!user">
                        <AButtonGroup>
                            <AuthModal :isLogin="false" />
                            <AuthModal :isLogin="true" />
                        </AButtonGroup>
                    </div>
                    <div class="right-content"  v-else>
                        <AButtonGroup>
                            <AButton type="primary" @click="goToUsersProfile" >Profile</AButton>
                            <AButton type="primary" @click="handleLogout">Log Out</AButton>
                        </AButtonGroup>
                    </div>
                </div>
            </div>
        </Container>
    </ALayoutHeader>
</template>
<style scoped>
.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.left-content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
}

.right-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;

}
.content{
    display: flex;
    align-items: center;

}
</style>
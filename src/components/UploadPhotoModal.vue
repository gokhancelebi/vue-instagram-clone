<script setup>
 
import { ref } from 'vue';
import {supabase} from '../supabase'
import {useUserStore} from './../stores/users'
import {storeToRefs} from 'pinia'

const {addNewPost} = defineProps(['addNewPost'])

const userStore = useUserStore()

const{user} = storeToRefs(userStore)

const open = ref(false);
const caption = ref("")
const file = ref(null)
const errorMessage = ref("")
const successMessage = ref("")
const loading = ref(false)

const showModal = () => {
  open.value = true;
  errorMessage.value = ""
  successMessage.value = ""
  file.value = null
};
const handleOk = async () => {
  loading.value = true
  const filename = Math.floor(Math.random() * 100000000)
  if(file.value){
    const {data,error} = await supabase.storage.from('images').upload('public/'+ filename ,  file.value )
    if(!error){
      console.log("User" , user.value)
      const response = await supabase.from('posts').insert({
         url: data.path,
         caption: caption.value,
         owner_id: user.value.id
      }) 
      addNewPost({
        url: data.path,
        caption: caption.value,
        owner_id: user.value.id
      })
      successMessage.value = "Image Uploaded"
      caption.value = ""
    }else{
      errorMessage.value = error.message
    }
  }
  loading.value = false

};

const handleUploadChange = (e) => {
    if(e.target.files[0]){
      file.value = e.target.files[0]
    }
}
</script>

<template>
    <div>
      <AButton type="primary" @click="showModal">Upload a Photo</AButton>
      <AModal v-model:open="open" title="Basic Modal" @ok="handleOk">
       <div v-if="!loading">
          <input type="file" accept=".jpeg,.png" @change="handleUploadChange" />
          <AInput placholder="Caption" v-model:value="caption" :maxLenght="50" />
          <ATypographyText type="danger" v-if="errorMessage">
              {{ errorMessage }}
          </ATypographyText>
          <ATypographyText type="success" v-if="successMessage">
              {{ successMessage }}
          </ATypographyText>
        </div>
        <div class="spinner" v-else>
          <ASpin />
        </div>
      </AModal>
    </div>
</template>
<style scoped>
input {
    margin-top: 10;
    margin-bottom:10px;
}
.spinner{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
}
</style>
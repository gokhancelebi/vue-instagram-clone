
  <script setup>
  import { ref, reactive } from 'vue';

  import {useUserStore} from '../stores/users'

  import {storeToRefs} from 'pinia'


  const open = ref(false);
  
  const props = defineProps(['isLogin'])

  const userStore = useUserStore()

  const { errorMessage ,loading ,user } = storeToRefs(userStore)


  const userCredentials = reactive({
    email:"",
    username: "",
    password: ""
  })

  const showModal = () => {

    open.value = true;

  };
  
  const clearUserCredentialsInput = () => {

    userCredentials.email = ""
    userCredentials.username = ""
    userCredentials.password = ""

  }
  const handleOk =  async (e) => {

    if(props.isLogin){

     await userStore.handleLogin({
        password : userCredentials.password,
        email : userCredentials.email
      })

    }else{

      await userStore.handleSignup(userCredentials)

    } 

    if(user.value !== null){
      console.log('popup kapandi' + user.value)
      open.value = false
      userStore.clearErrorMessage()
    }

    clearUserCredentialsInput()


  };

  const handleCancel = () => {

    open.value = false;

    clearUserCredentialsInput()
    
    userStore.clearErrorMessage()

    loading.value = false

  }

  const title = props.isLogin ? 'Login' : 'Signup'

  </script>
  
  <template>
      <AButton v-if="user === null" type="primary" @click="showModal">{{ props.isLogin ? 'Login' : 'Sign Up' }}</AButton>
      <AModal v-model:open="open" :title="title" @ok="handleOk">
        <template #footer>
          <AButton key="back" @click="handleCancel">Cancel</AButton>
          <AButton key="submit" type="primary" :disabled="loading" :loading="loading" @click="handleOk">Submit</AButton>
        </template>
        <div class="input-container" v-if="!loading">

          <AInput v-model:value="userCredentials.email" placeholder="Mail" />
          <AInput  v-if="!isLogin" v-model:value="userCredentials.username" placeholder="Username" />
          <AInputPassword v-model:value="userCredentials.password" placeholder="Password" />
          <ATypographyText type="danger" v-if="errorMessage">
            {{ errorMessage }}
          </ATypographyText>
        </div>
        <div class="spinner" v-else>
          <ASpin />
        </div>
      </AModal>
    
  </template> 

<style scoped>
.spinner{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;

}
</style>
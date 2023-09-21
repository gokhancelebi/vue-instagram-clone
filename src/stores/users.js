import { ref } from 'vue'
import { defineStore } from 'pinia'
import {supabase} from '../supabase'

export const useUserStore = defineStore('users', () => {
  const user = ref(null)
  const errorMessage = ref("")
  const loading = ref(false)
  const loadingUser = ref(false)

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (credentials)  => {

    
    console.log("handleLogin action")


    const {email,password} = credentials

    
    loading.value = true

    if(!validateEmail(email)){
      loading.value = false
      return errorMessage.value = "Email is invalid"
    }

        
    if(password.length < 4){ 
      loading.value = false
      return errorMessage.value = "Password lenght is too short"
    }

    const {data:loginResponseData, error: loginResponseError} = await supabase.auth.signInWithPassword({
      email,
      password
    })


    if(loginResponseError){ 
      loading.value = false
      return errorMessage.value = loginResponseError.message
    }

    errorMessage.value = ""
    loading.value = false

    const {data: existingUser} = await supabase
    .from('users')
    .select()
    .eq('email',email)
    .single()

    user.value = {
      email: existingUser.email,
      username: existingUser.username
    }


  }

  const handleSignup = async (userCredentials)  => {

    console.log("Handle Signup")

    loading.value = true
    
    const {email, password, username} = userCredentials;
    
    if(password.length < 4){
      loading.value = false
      return errorMessage.value = "Password lenght is too short"
    }

    if(username.length < 4){
      loading.value = false
      return errorMessage.value = "Username lenght is too short"
    }
 

    if(email.length < 4){
      loading.value = false
      return errorMessage.value = "Email lenght is too short"
    }

    if(!validateEmail(email)){
      loading.value = false
      return errorMessage.value = "Email is invalid"
    }

    // VALIDATE IF USER EXISTS // 

    const {data: checkIfUserExistsResponse} = await supabase
      .from("users")
      .select()
      .eq("username",username)
      .single()

    if(checkIfUserExistsResponse){
      loading.value = false
      return errorMessage.value = "User already exists."
    }

    errorMessage.value = ""

    
    const {data,error} = await supabase.auth.signUp({
      email,
      password
    })

    if(error !== null){
      loading.value = false
      return errorMessage.value = error.message
    }

    errorMessage.value = ""


    const insertResponse = await supabase.from("users").insert({
      email,
      username
    })

    const {data: newUser} = await supabase
    .from('users')
    .select()
    .eq('email',email)
    .single()

    user.value = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    }

    loading.value = false

  }
  const handleLogout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }
  const getUser = async () => {
    
    loadingUser.value = true

    const {data,error} = await supabase.auth.getUser()
 
    
    if(!error){

      const {data:userWithEmail} = await supabase
      .from("users")
      .select()
      .eq('email', data.user.email)
      .single() 
  
      user.value = {
        username: userWithEmail.username,
        email: userWithEmail.email,
        id: userWithEmail.id
      }

    }

    loadingUser.value = false

  }
  const clearErrorMessage = () => {
    errorMessage.value = ""
  }

  

  return { user,errorMessage,loading,loadingUser,user,clearErrorMessage, handleLogin,handleLogout,handleSignup,getUser  }
})

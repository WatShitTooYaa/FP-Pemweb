<template>
    <div class="flex justify-center items-center w-full h-screen bg-neutral-200 text-neutral-900">
      <div class="m-9 p-9 w-96 bg-neutral-50 shadow-lg" style="border-radius: 5%;">
        <h1 class="font-bold text-2xl text-center">Register</h1>
        <h1 class="text-sm text-center">Create your new account.</h1>
  
        <div class="mt-8">
          <div class="lg:col-span-2">
            <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
              <div class="md:col-span-5">
                <label>Email</label><br />
                <input type="text" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="email@domain.com" v-model="email" required/>
              </div>
  
              <div class="md:col-span-5">
                <label class="password">Password</label><br />
                <input type="password" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="password" v-model="password" required/>
              </div>
  
              <div class="md:col-span-5 text-center">
                <div class="mt-3 text-center">
                  <button @click="postUser()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
                </div>
                <div class="mt-3 text-center">
                  <p>Have an account? <button @click="$router.push('/')" style="color: #3F83F8;">Login</button></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  </template>

  <script>
  import axios from "axios";
  import Swal from 'sweetalert2';
  export default {
    data() {
      return {
      };
    },
    methods: {
    async postUser() {
      await axios.post(`http://127.0.0.1:3000/api/register`, {
                email: this.email,
                password: this.password
            })
            .then((response) => {
              if(response.data == "auth/email-already-in-use") {
                Swal.fire({
                  title: 'Error!',
                  text: `Account has already use`,
                  icon: 'error',
                  timer: 1500,
                  showConfirmButton: false,
                });
              }
              else{
                Swal.fire({
                  title: 'Success!',
                  text: `Succesesfully added user ${this.email}`,
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false,
                }),
                this.$router.push({name : "login"});
                console.log(response);
                // status: success;
              }
            },
            (error) => {
                console.log(error.code);
                // status: failed;
            })
            .catch((error) => {
              console.log(error.code);
            });
    },
    
    },
    mounted() {
    },
};
</script>
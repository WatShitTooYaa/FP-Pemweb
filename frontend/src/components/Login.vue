<template>
    <div class="flex justify-center items-center w-full h-screen bg-neutral-200 text-neutral-900">
    <div class="m-9 p-9 w-96 bg-neutral-50 shadow-lg" style="border-radius: 5%;">
      <h1 class="font-bold text-2xl text-center">Login</h1>
      <h1 class="text-sm text-center">please fill out the fields below correctly.</h1>

      <div class="mt-8">
        <div class="lg:col-span-2">
          <div class="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
            
            <div class="md:col-span-5">
              <label for="email">Alamat Email</label>
              <input type="text" v-model="email" name="email" id="email" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="email@domain.com" />
            </div>
            
            <div class="md:col-span-5">
              <label for="password">Password</label>
              <input type="password" v-model="password" name="password" id="password" class="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="password" />
            </div>

            <div class="md:col-span-5 text-center">
              <div class="mt-3 text-center">
                <button @click="login()" @keyup.enter="login()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
              </div>
              <div class="mt-3 text-center">
                <p>Don't have an account? <button @click="$router.push('/register')" style="color: #3F83F8;">Register</button></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from "axios";
// import { db, auth } from "../firebase/firebase.js";

export default {
  data() {
    return {
      // status: false,
    };
  },
  methods: {
    async login() {
            let res = await axios.post(`http://127.0.0.1:3000/api/login`, {
                email: this.email,
                password: this.password
            })
            .then((response) => {
              console.log('response.data = ' + response.data);
              if(response.data == "auth/invalid-email"){
                this.validation = "Invalid email ! Please input valid email"
                Swal.fire({
                  title: 'Error!',
                  text: `${this.validation}`,
                  icon: 'error',
                  timer: 1500,
                  showConfirmButton: false,
                });
              }
              else if(response.data == "auth/missing-email"){
                this.validation = "Please input your email !"
                Swal.fire({
                  title: 'Error!',
                  text: `${this.validation}`,
                  icon: 'error',
                  timer: 1500,
                  showConfirmButton: false,
                });
              }
              else if(response.data == "auth/wrong-password"){
                this.validation = "Wrong password ! Please input valid password"
                Swal.fire({
                  title: 'Error!',
                  text: `${this.validation}`,
                  icon: 'error',
                  timer: 1500,
                  showConfirmButton: false,
                });
              }
              else if(response.data == "auth/user-not-found"){
                this.validation = "User not found !"
                Swal.fire({
                  title: 'Error!',
                  text: `${this.validation}`,
                  icon: 'error',
                  timer: 1500,
                  showConfirmButton: false,
                });
              }
              else {
                Swal.fire({
                  title: 'Success!',
                  text: `Succesesfully login user ${this.email}`,
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false,
                })
                const uid = response.data;
                console.log(uid);
                localStorage.setItem('uid', uid);
                this.$router.push({path: '/dashboard/'+ uid});
                //status: success;               
              }
            })
            .catch(
              (error) => {
                Swal.fire({
                  title: 'Error!',
                  text: `Seems like there is an error while login ${error}`,
                  icon: 'error',
                  timer: 1500,
                  showConfirmButton: false,
                });
                  console.log(error);
                  this.$router.push("/");
                  // status: failed;
              }
            );
    },
  },
};
</script>
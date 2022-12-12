import { defineStore } from "pinia";
import axios from "axios";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
} from "firebase/firestore";
import Swal from 'sweetalert2';

const firebaseConfig = {
  apiKey: "AIzaSyBG8pWMejvUW4Xgl50TfIHMjVmwHriwULQ",
  authDomain: "shortener-url-86c6e.firebaseapp.com",
  projectId: "shortener-url-86c6e",
  storageBucket: "shortener-url-86c6e.appspot.com",
  messagingSenderId: "654929913823",
  appId: "1:654929913823:web:f30fd216882bbb6463c66a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const useApp = defineStore({
    id: "App",
    state: () => ({
      users: [],
      menu: {
        edit_user: {
          show: false,
          data: {},
        }
      },
      input: {
        user: {}
      }
    }),
    actions: {
      async getUsers() {
        onSnapshot(collection(db, "users"), (querySnapshot) => {
          let users = [];
          querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
          });
          this.users = users;
        },
        error => {
          Swal.fire({
            title: 'Error!',
            text: `Seems like there is an error while connecting to Firestore<br>${error}`,
            icon: 'error',
            confirmButtonText: 'Cool'
          });
        }
        );
      },
      // async postUser() {
      //   let res = await axios.post(`http://127.0.0.1:3000/api/login`, {
      //             email: this.email,
      //             password: this.password,
      //         })
      //         .then((response) => {
      //             const uid = response.data
      //             console.log(uid)
      //             localStorage.setItem('uid', uid)
      //             this.$router.push({path: `/dashboard/${uid}`})
      //             console.log(response)
      //         })
      //         .catch((error) => {
      //             console.log(error)
      //             this.$router.push("/")
      //         })
      // },
      async addUser(user) {
        await axios.post('http://127.0.0.1:3000/users', {
          nama: user.name,
          email: user.email
        })
        .then((response) => {
          if(response.status) {
            Swal.fire({
              title: 'Success!',
              text: `Succesesfully added user ${user.name}`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        }, 
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: `Seems like there is an error while adding user ${user.name}<br>${error}`,
            icon: 'error',
            timer: 1500,
            showConfirmButton: false,
          });
        });
        this.input.user.name = '';
        this.input.user.email = '';
      },
      async deleteUser(user_id) {
        await axios.delete('http://127.0.0.1:3000/users/' + user_id)
        .then((response) => {
          if(response.status) {
            Swal.fire({
              title: 'Success!',
              text: `Succesesfully delete user ${this.users.find(user => user.id === user_id).nama}`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        }, (error) => {
          Swal.fire({
            title: 'Error!',
            text: `Seems like there is an error while deleting user ${this.users.find(user => user.id === user_id).nama}<br>${error}`,
            icon: 'error',
            timer: 1500,
            showConfirmButton: false,
          });
        }
        );
      },
      showEditUserMenu(user_id) {
        let user = this.users.find(user => user.id === user_id);
        this.menu.edit_user.data = {
          id: user.id,
          nama: user.nama,
          email: user.email,
        };
        this.menu.edit_user.show = true;
      },
      closeEditUserMenu() {
        this.menu.edit_user.data = {};
        this.menu.edit_user.show = false;
      },
      async editUser(user) {
        await axios.patch('http://127.0.0.1:3000/users/' + user.id, user)
        .then((response) => {
          if(response.status) {
            Swal.fire({
              title: 'Success!',
              text: `Succesesfully update user ${user.nama}`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        }, (error) => {
          Swal.fire({
            title: 'Error!',
            text: `Seems like there is an error while updating user ${user.nama}<br>${error}`,
            icon: 'error',
            timer: 1500,
            showConfirmButton: false,
          });
        });
        this.closeEditUserMenu();
      }
    },
});
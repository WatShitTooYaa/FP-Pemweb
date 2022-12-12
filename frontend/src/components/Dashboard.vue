<template>
  <nav class="menu-container">
  <input type="checkbox" aria-label="Toggle menu" />
    <a class="menu-logo"></a>
    <h2 class="font-bold text-2xl">Joko Kendil Ngecor Shortener Link</h2>
    <div class="menu">
        <ul>
        </ul>
        <ul>
        <li>
            <a @click="Logout()" class="bg-gray-500 hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded">
              Logout
            </a>
        </li>
        </ul>
    </div>
</nav>
  <!-- <button @click="Logout()">Sign Out</button> -->

  <!-- <div class="inputlink ml-5">
    <input type="text" placeholder="link asli" class="type rounded" v-model="flink"/>
  </div> -->

  <div class="text-center">
    <!-- <h5 class="title">Joko Kendil ngecrit</h5> -->
    <input type="text" placeholder="http://domain.com or https://domain.com" class="type rounded" style="width: 500px;" v-model="flink"/>
    <input type="text" placeholder="alias" class="alias rounded ml-9" v-model="slink"/>
    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  @click="postLink()">Submit</button>
  </div>
  
  <div class="edit text-center mt-7" v-show="editbar">
    <input type="text" placeholder="new slink" v-model="newLink.newslink" />
    <input type="text" placeholder="new url" v-model="newLink.newflink"/>
    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="editHandler(newLink.id)">Submit Edit</button>
  </div>

  <!-- <div class="list" v-for="link in links" :key="link">
    <div class="box" v-if="link.uid == userID"> -->
      
  <div class="table-responsive" style="margin-top: 50px; margin-left: 13%;">
    <table class="table table-hover table-borderless table-striped text-center">
      <thead>
        <tr>
          <th scope="col">Alias</th>
          <th scope="col">Link</th>
          <th scope="col">Count</th>
        </tr>
      </thead>
      <tbody v-for="link in links" :key="link">
        <tr v-if="link.uid == userID">
          <th> <a @click="clickLink()" target="_blank" v-bind:href="'http://127.0.0.1:5173/' + link.slink">JokoKendilNgecor/{{ link.slink }}</a></th>
          <td style="max-width: 500px; word-wrap: break-word;">{{ link.flink }}</td>
          <td scope="row">{{ link.uses }}</td>
          <td><button class="bg-yellow-400 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" @click="editLink(link.id)"> Edit </button></td>
          <td><button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" @click="deleteLink(link.id)"> Delete </button></td>
        </tr>
      </tbody>

    </table>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { initializeApp } from "firebase/app";
import { signOut, getAuth } from "firebase/auth"
import { auth } from '../firebase/firebase.js';

import axios from 'axios'

export default {
  data(){
    return {
      links: [],
      flink: "",
      slink: "",
      userID: "",
      newLink: [{
        id: "",
        newslink: "",
        newflink: "",
      }],
      editbar: false,
    }
  },
  methods: {
    async Logout() {
      try {
        signOut(auth)
        .then(() => {
          Swal.fire({
                  title: 'Success!',
                  text: `Succesesfully logout`,
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false,
                })
          localStorage.removeItem('uid')
          this.$router.push("/")
        })
      }
      catch(error){
        console.log(error)
      }
    },
    async getLink() {
      this.userID = localStorage.getItem('uid')
      // console.log(this.userID)
      const res = await axios.get('http://localhost:3000/link')
        .then((response)=>{
          this.links.push(...response.data)
          console.log(response.data)
        }
      )
    },
    async postLink() {
      const res = await axios.post('http://localhost:3000/link', {
        flink: this.flink,
        slink: this.slink,
        id: this.id,
        uid: this.userID,
        uses: 0,
      })
      .then((response) =>{
        Swal.fire({
                  title: 'Success!',
                  text: `Succesesfully add link`,
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false,
                })
        console.log(response.data)
        location.reload()
      })
    },
    async deleteLink(id) {
      const res = await axios.delete('http://localhost:3000/link/' + id)
      .then((response)=>{
        Swal.fire({
                  title: 'Success!',
                  text: `Succesesfully delete link`,
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false,
                })
        console.log(response.data)
        location.reload()
      })
    },
    // async clickLink() {
    //     const q = query(collection(db, "link"))
    //     const querySnapshot = await getDocs(q);
    //     querySnapshot.forEach((docSnap) => {
    //       id = docSnap.id
    //       const docData = docSnap.data()
    //       updateDoc(doc(db, "link", id))
    //       console.log(doc.id, " => ", doc.data());
    //     });
    //     window.location.reload()
    // },
    async editHandler(id) {
      const res = await axios.patch('http://localhost:3000/link/' + id, {
        newflink: this.newLink.newflink,
        newslink: this.newLink.newslink,
      })
      .then((response) => {
        Swal.fire({
                  title: 'Success!',
                  text: `Succesesfully edit link`,
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false,
                })
        location.reload()
        console.log(response)
      })
    },
    editLink(id){
      this.links.forEach((link) => {
        if(link.id == id){
          this.newLink.id = link.id
          this.newLink.newflink = link.flink
          this.newLink.newslink = link.slink
        }
      })
      this.editbar = true;
    },
  }, 
  mounted() {
    this.getLink();
  }
}
</script>

<style>
  .title {
    font-size: 50px;
  }
  .inputlink input{
    margin: 15px 1rem;
  }
  .box {
    display: flex;
    margin-bottom: 15px;
  }
  .content{
    margin-right: 50px;
  }
  .content {
	box-shadow: 3px 4px 0px 0px #8a2a21;
	background:linear-gradient(to bottom, #c62d1f 5%, #f24437 100%);
	background-color: "#c62d1f";
	border-radius: 25px;
	border: 3px solid #d02718;
	display: inline-block;
	cursor: pointer;
	color:#ffffff;
	font-family:Impact;
	font-size:12px;
	padding:4px 27px;
	text-decoration:none;
}
  /* button:hover {
	background:linear-gradient(to bottom, #f24437 5%, #c62d1f 100%);
	background-color:#001eff;
} */
button:active {
	position:relative;
	top:1px;
}
.type{
     padding: 4px 10px;
     font-size: 17px;
     border-width: 1px;
     border-color: #ff00e4;
     background-color: #ffffff;
     color: #000000;
     border-style: groove;
     border-radius: 12px;
     box-shadow: 0px 0px 3px rgba(66,66,66,.75);
}
 .type:focus {
     outline:none;
}
.alias{
     padding: 10px;
     font-size: 25px;
     border-width: 1px;
     border-color: #ff00e4;
     background-color: #ffffff;
     color: #000000;
     border-style: groove;
     border-radius: 12px;
     box-shadow: 0px 0px 3px rgba(66,66,66,.75);
}
 .alias:focus {
     outline:none;
}
.menu-container {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    background: #232323;
    color: #ffffff;
    padding: 20px;
    z-index: 1;
    -webkit-user-select: none;
    user-select: none;
    box-sizing: border-box;
}

.menu-logo {
    line-height: 0;
    margin: 0 10px;
}

.menu-logo img {
    max-height: 40px;
    max-width: 100px;
    flex-shrink: 0;
}

.menu-container a {
  text-decoration: none;
  color: #232323;
  transition: color 0.3s ease;
}

/* .menu-container a:hover {
  color: #00C6A7;
} */

.menu-container input {
  display: block;
  width: 35px;
  height: 25px;
  margin: 0;
  position: absolute;
  cursor: pointer;
  opacity: 0; /* hide this */
  z-index: 2; /* and place it over the hamburger */
  -webkit-touch-callout: none;
}

/* Burger menu */
.menu-container span {
    display: block;
    width: 33px;
    height: 4px;
    margin-bottom: 5px;
    position: relative;
    background: #ffffff;
    border-radius: 3px;
    z-index: 1;
    transform-origin: 4px 0px;
    transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
    background: 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
    opacity: 0.55s ease;
}

.menu-container span:first-child {
  transform-origin: 0% 0%;
}

.menu-container span:nth-child(3) {
  transform-origin: 0% 100%;
}

.menu-container input:checked ~ span {
  opacity: 1;
  transform: rotate(45deg) translate(3px,-1px);
  background: #232323;
}

.menu-container input:checked ~ span:nth-child(4) {
  opacity: 0;
  transform: rotate(0deg) scale(0.2, 0.2);
}

.menu-container input:checked ~ span:nth-child(3) {
  transform: rotate(-45deg) translate(-5px,11px);
}

.menu ul {
  list-style: none;
}

.menu li {
  padding: 10px 0;
  font-size: 22px;
}

/* mobile styles */
@media only screen and (max-width: 767px) { 
  .menu-container {
    flex-direction: column;
    align-items: flex-end;
  }
  
  .menu-logo {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .menu-logo img {
    max-height: 30px;
  }

  .menu {
    position: absolute;
    box-sizing: border-box;
    width: 300px;
    right: -300px;
    top: 0;
    margin: -20px;
    padding: 75px 50px 50px;
    background: #cdcdcd;
    -webkit-font-smoothing: antialiased;
    /* to stop flickering of text in safari */
    transform-origin: 0% 0%;
    transform: translateX(0%);
    transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
  }

  .menu-container input:checked ~ .menu {
    transform: translateX(-100%);
  }
}

/* desktop styles */
@media only screen and (min-width: 768px) { 
  .menu-container {
    width: 100%;
  }

  .menu-container a {
    color: #ffffff;
  }

  .menu-container input {
    display: none;
  }

  /* Burger menu */
  .menu-container span {
    display: none;
  }

  .menu {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .menu ul {
    display: flex;
    padding: 0;
  }

  .menu li {
    padding: 0 20px;
  }
}
</style>

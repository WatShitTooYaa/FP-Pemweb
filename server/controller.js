import express from "express";
import bodyParser from "body-parser";
import { async } from "@firebase/util";
import { db, auth } from "./firebase.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { query, collection, where, getDocs, updateDoc, doc } from 'firebase/firestore';
const router = express.Router();
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("Bismillah!");
});


router.post("/api/register", async(req, res) => {
  let email = req.body.email
  let password = req.body.password
  try{
      // const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        res.send(userCredential)
      })
      .catch((err) => {
          console.log(err)
          res.send(err.code)
      })
}
catch(err){
  console.log(err)
}
});

router.post("/api/login", async(req, res) => {
  let email = req.body.email
  let password = req.body.password
  try{
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
          const uid = user.uid;
          console.log(uid);
          // res.send(uid); 
          res.send(uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
          res.send(errorCode);
  });
  }
  catch(err){
    console.log(err)
  }
});


router.post("/link", async(req,res) => {
  try {
    var flink = req.body.flink;
    var slink = req.body.slink;
      var uid = req.body.uid;
      var uses = req.body.uses;
      db.collection("link").add({
        flink: flink,
        slink: slink,
        uid: uid,
        uses: uses,
      });
  
      res.send("Data berhasil disimpan");
    } catch (error) {
      console.log(error)
      res.send("Data gagal disimpan");
    }
  })
  
  router.get("/link", async(req,res) => {
    try{
      db.collection("link")
      .get()
      .then((querySnapshot)=>{
        let links = [];
        let id;
        querySnapshot.forEach((doc)=>{
          id = doc.id;
          links.push({id, ...doc.data()})
        })
        res.send(links)
      })
    }
    catch(err) {
      console.log(err)
    }
  })

  router.get("/api/redirectLink", async (req, res) => {
    const url = req.query.url
    let id = ''
    let uses = 0
    let flink = ''
    console.log(url)
    try {
      const q = query(collection(db, "link"), where("slink", "==", url.replace("http://127.0.0.1:5173/", "")));
      
      console.log("masuk try")
      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
          id = docSnap.id
          if (docSnap == null) {
            console.log("Cannot find associated link")
            res.send("Cannot find associated link")
          }
          else {
            const docData = docSnap.data()
            uses = parseInt(docData.uses)
            flink = docData.flink
            console.log(uses)
            console.log(flink)
            console.log(id)
            updateDoc(doc(db, "link", id), {
              uses: uses + 1
            })
            console.log(uses)
            
          }
        });
        res.send(flink)
      }
  catch (err) {
    console.log(err)
    res.send(err)
  }
})

router.delete("/link/:id", async(req, res) => {
  try {
    db.collection("link")
    .doc(req.params.id)
    .delete()
    .then(() => {
      res.send("delete berhasil")
    })
  }
  catch(error){
    res.send(error)
  }
})

router.patch("/link/:id", async(req,res) => {
  try{
    db.collection("link")
    .doc(req.params.id)
    .update({
      flink: req.body.newflink,
      slink: req.body.newslink,
    })
    .then(() => {
      res.send("Berhasil Di update")
    })
  }
  catch(error) {
    res.send(error.message)
  }
})

export default router;









































// router.get("/users", (req, res) => {
//   try {
//     db.collection("users")
//       .get()
//       .then((querySnapshot) => {
//         let users = [];
//         let id;
//         querySnapshot.forEach((doc) => {
//           id = doc.id;
//           users.push({ id, ...doc.data() });
//         });
//         res.send(users);
//       });
//   } catch (error) {
//     res.send(error);
//   }
// });

// router.post("/users", (req, res) => {
//   try {
//     var nama = req.body.nama;
//     var email = req.body.email;

//     db.collection("users").add({
//       nama: nama,
//       email: email,
//     });

//     res.send({
//       status: true,
//       message: "Data berhasil disimpan",
//     });
//   } catch (error) {
//     res.send({
//       status: false,
//       message: "Data gagal disimpan",
//     });
//   }
// });

// router.delete("/users/:id", (req, res) => {
//   try {
//     db.collection("users")
//       .doc(req.params.id)
//       .delete()
//       .then(() => {
//         res.send({
//           status: true,
//           message: "Data berhasil dihapus",
//         });
//       });
//   } catch (error) {
//     res.send({
//       status: false,
//       message: "Data gagal dihapus",
//     });
//   }
// });

// router.patch("/users/:id", (req, res) => {
//   try {
//     db.collection("users")
//       .doc(req.params.id)
//       .update({
//         nama: req.body.nama,
//         email: req.body.email,
//       })
//       .then(() => {
//         res.send({
//           status: true,
//           message: "Data berhasil diubah",
//         });
//       });
//   } catch (error) {
//     res.send({
//       status: false,
//       message: "Data gagal diubah",
//     });
//   }
// });
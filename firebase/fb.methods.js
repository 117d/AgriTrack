import app from "../config/firebase.config";
//import * as firebase from "firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";
/* USER MANAGEMENT METHODS */
export const uploadImage = async (pickedImage) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", pickedImage.uri, true);
    xhr.send(null);
  });
  try {
    // Create a ref in Firebase
    const ref = firebase.storage().ref().child(`avatars/${uuidv4()}`);

    // Upload blob to Firebase
    const snapshot = await ref.put(blob, { contentType: "image/png" });

    // Create a download URL
    const remoteURL = await snapshot.ref.getDownloadURL();
    console.log("REMOTE_URL " + remoteURL);
    // Return the URL
    return remoteURL;
  } catch (error) {
    alert(error);
  } finally {
    blob.close();
  }
};
export async function register(
  email,
  password,
  lastName,
  firstName,
  profPicUrl
) {
  try {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const data = {
          id: uid,
          email,
          lastName,
          firstName,
          photoUrl: profPicUrl,
        };
        const dbRef = firebase.firestore().collection("users");
        dbRef
          .doc(uid)
          .set(data)
          .catch((error) => {
            alert(error);
          });
      });

    const user = firebase.auth().currentUser;
  } catch (error) {
    alert(error);
  }
}

export async function signIn(email, password) {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (err) {
    alert(err);
  }
}

export async function logOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    alert(err);
  }
}

export async function editUser(userId, firstName, lastName, profPicUrl) {
  try {
    const data = {
      id: userId,
      firstName: firstName,
      lastName: lastName,
      photoUrl: profPicUrl,
    };
    const dbRef = firebase.firestore().collection("users");
    await dbRef
      .doc(userId)
      .update(data)
      .catch((error) => {
        alert(error);
      });
  } catch (err) {
    alert(err);
  }
}

export async function addField(fieldName, coordinates, area, cropType) {
  try {
    const data = {
      fieldName: fieldName,
      coordinates: coordinates,
      area: area,
      cropType: cropType,
    };
    const uid = firebase.auth().currentUser.uid;
    console.log("uid:" + uid);
    const db = firebase.firestore();
    const dbRef = db.collection("users").doc(uid).collection("fields").doc();

    await dbRef
      .set(data)
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(errorCode + errorMessage);
      });
  } catch (error) {
    alert(error);
    console.log(error);
  }
}

export async function addWorker(
  //userId,
  workerUID
) {
  try {
    const data = {
      id: workerUID,
    };
    const uid = firebase.auth().currentUser.uid;
    const db = firebase.firestore();
    const dbRef = db.collection("users").doc(uid).collection("workers").doc();
    dbRef
      .set(data)
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        alert(error);
      });
  } catch (error) {
    alert(error);
    console.log(error);
  }
}

export async function addTask(
  //userId,
  taskName,
  taskType,
  taskStatus
) {
  try {
    const data = {
      taskName: taskName,
      taskType: taskType,
      taskStatus: taskStatus,
      dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
      taskDuration: "",
    };
    const uid = firebase.auth().currentUser.uid;
    console.log("uid:" + uid);
    const db = firebase.firestore();
    const dbRef = db.collection("users").doc(uid).collection("tasks").doc();
    dbRef
      .set(data)
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        alert(error);
      });
  } catch (error) {
    alert(error);
    console.log(error);
  }
}

export async function editField(
  //userId,
  fieldId,
  fieldName,
  coordinates,
  area,
  cropType
) {
  try {
    const data = {
      id: fieldId,
      fieldName: fieldName,
      coordinates: coordinates,
      area: area,
      cropType: cropType,
    };
    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("fields");
    await dbRef
      .doc(fieldId)
      .update(data)
      .catch((error) => {
        alert(error);
      });
  } catch (error) {
    alert(error);
    console.log(error);
  }
}
export async function editTask(
  taskId,
  taskName,
  taskType,
  taskStatus,
  taskProgress,
  dateCreated,
  dateFinished
) {
  try {
    const data = {
      id: taskId,
      taskName,
      taskType,
      taskStatus,
      taskProgress,
      dateCreated,
      dateFinished,
    };
    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("tasks");
    await dbRef
      .doc(taskId)
      .update(data)
      .catch((error) => {
        alert(error);
      });
  } catch (error) {
    alert(error);
    console.log(error);
  }
}

export async function getWorkers() {
  const workers = [];
  try {
    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("workers");
    const snapshot = await dbRef.get();
    snapshot.forEach((doc) => {
      workers.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.log("problem getting workers from db: " + error);
  }
  return workers;
}

export async function deleteWorker(workerId) {
  const uid = firebase.auth().currentUser.uid;
  const dbRef = firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("workers");
  dbRef
    .doc(workerId)
    .delete.then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

/* GET FIELDS, GET TASKS */
export async function getTasks() {
  const tasks = [];
  try {
    const uid = firebase.auth().currentUser.uid;
    const dbRef = firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("tasks");
    const snapshot = await dbRef.get();
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
      //console.log("tasks from db: " + doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.log("error getting tasks from db: " + error);
  }

  return tasks;
}
export async function getFields() {
  const fields = [];
  const uid = firebase.auth().currentUser.uid;
  const dbRef = firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("fields");
  const snapshot = await dbRef.get();
  snapshot.forEach((doc) => {
    fields.push({ id: doc.id, ...doc.data() });
  });
  return fields;
}
/* DELETE FIELDS, DELETE TASKS */
export async function deleteTask(taskId) {
  const uid = firebase.auth().currentUser.uid;
  const dbRef = firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("tasks");
  dbRef
    .doc(taskId)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

export async function deleteField(fieldId) {
  const uid = firebase.auth().currentUser.uid;
  const dbRef = firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("fields");
  dbRef
    .doc(fieldId)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

export async function getTask(taskId) {
  const uid = firebase.auth().currentUser.uid;
  const dbRef = firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("tasks")
    .doc(taskId);
  //dbRef.get().then((return doc.d))
}

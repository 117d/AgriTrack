import app from "../config/firebase.config";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

/* USER MANAGEMENT METHODS */
export async function register(email, password, lastName, firstName) {
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
          fields: [],
          tasks: [],
        };
        const dbRef = firebase.firestore().collection("users");
        dbRef
          .doc(uid)
          .set(data)
          .catch((error) => {
            alert(error);
          });
      });

    const currentUser = firebase.auth().currentUser;

    /*
    const db = firebase.firestore();
    db.collection("users").doc(currentUser.uid).set({
      email: currentUser.email,
      lastName: lastName,
      firstName: firstName,
    });
    */
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

export async function editUser(userId, firstName, lastName) {
  try {
    const data = {
      id: userId,
      firstName,
      lastName,
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

export async function addField(
  //userId,
  fieldName,
  coordinates,
  perimeter,
  area,
  cropType
) {
  try {
    const data = {
      fieldName,
      coordinates,
      perimeter,
      area,
      cropType,
    };
    const uid = firebase.auth.currentUser.uid;
    const dbRef = firebase
      .firestore()
      .collection("users")
      .document(uid)
      .collection("fields");

    await dbRef.add(data).catch((error) => {
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
  taskProgress
) {
  try {
    const data = {
      taskName,
      taskType,
      taskProgress,
      dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const uid = firebase.auth.currentUser.uid;
    const dbRef = firebase
      .firestore()
      .collection("users")
      .document(uid)
      .collection("tasks");
    await dbRef.add(data).catch((error) => {
      alert(error);
    });
  } catch (error) {
    alert(error);
    console.log(error);
  }
}
/*TO BE IMPLEMENTED LATER */
//also add deleteField and deleteTask
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
      fieldName,
      coordinates,
      area,
      cropType,
    };
    const uid = firebase.auth.currentUser.uid;
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
/*TO BE IMPLEMENTED LATER */
export async function editTask(
  taskId,
  taskName,
  taskType,
  taskProgress,
  dateCreated,
  dateFinished
) {
  try {
    const data = {
      id: taskId,
      taskName,
      taskType,
      taskProgress,
      dateCreated,
      dateFinished,
    };
    const uid = firebase.auth.currentUser.uid;
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
/* GET FIELDS, GET TASKS */
export async function getTasks() {
  const uid = firebase.auth.currentUser.uid;
  const dbRef = firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("tasks");
  const snapshot = await dbRef.get();
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}
export async function getFields() {
  const uid = firebase.auth.currentUser.uid;
  const dbRef = firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("fields");
  const snapshot = await dbRef.get();
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}
/* DELETE FIELDS, DELETE TASKS */
export async function deleteTask(taskId) {
  const uid = firebase.auth.currentUser.uid;
  const dbRef = firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("tasks");
  dbRef
    .doc(taskId)
    .delete.then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

export async function deleteField(fieldId) {
  const uid = firebase.auth.currentUser.uid;
  const dbRef = firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("fields");
  dbRef
    .doc(fieldId)
    .delete.then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

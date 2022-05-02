import app from "../config/firebase.config";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

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
  userId,
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
    const dbRef = firebase
      .firestore()
      .collection("users")
      .document(userId)
      .collection("fields");
    /*
    await dbRef.add(data).catch((error) => {
      alert(error);
    });
    */
    await dbRef.update({
      fields: firebase.firestore.FieldValue.arrayUnion(data),
    });
  } catch (error) {
    alert(error);
    console.log(error);
  }
}
export async function addTask(userId, taskName, taskType, taskProgress) {
  try {
    const data = {
      taskName,
      taskType,
      taskProgress,
    };
    const dbRef = firebase
      .firestore()
      .collection("users")
      .document(userId)
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
  fieldId,
  fieldName,
  coordinates,
  perimeter,
  area,
  cropType
) {
  try {
    const data = {
      id: fieldId,
      fieldName,
      coordinates,
      perimeter,
      area,
      cropType,
    };
    const dbRef = firebase.firestore().collection("fields");
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
    const dbRef = firebase.firestore().collection("tasks");
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

export async function getTasks() {
  const dbRef = firebase.firestore().collection("tasks");
  const snapshot = await dbRef.get();
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}
export async function getFields() {
  const dbRef = firebase.firestore().collection("fields");
  const snapshot = await dbRef.get();
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}

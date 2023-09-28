import firestore from "../firebase";
function setVisibilityForGroup({ email, id }) {
  const updateFirestoreDocument = async () => {
    try {
      // Assuming you have a Firestore reference or collection where you want to update the value
      const firestoreRef = await firestore.collection("names").doc(id);
      // Get the current document data
      const docSnapshot = await firestoreRef.get();

      if (docSnapshot.exists) {
        const data = docSnapshot.data();

        // Now you can access the current value of 'visibility'
        const currentVisibility = data.visibility;
        console.log("Current visibility:", currentVisibility);
        if (currentVisibility.filter((val) => val.email === email).length == 0)
          await firestoreRef.update({
            visibility: [...currentVisibility, { email }],
          });

        console.log("Value updated successfully");
      } else {
        console.log("Document does not exist");
      }
      // Update the Firestore document with the new value

      console.log("Firestore document updated successfully.");
    } catch (error) {
      console.error("Error updating Firestore document:", error);
    }
  };
  updateFirestoreDocument();
}
export default setVisibilityForGroup;

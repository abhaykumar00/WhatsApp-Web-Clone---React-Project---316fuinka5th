import firestore from "../firebase";
import { ToastContainer, toast } from "react-toastify";
function setNewGmailInFirstore({ data }) {
  const updateFirestoreDocument = async () => {
    try {
      // Assuming you have a Firestore reference or collection where you want to update the value
      const firestoreRef = firestore
        .collection("gmail")
        .doc("3AhlXG4C0shjlHYIOB6i");

      // Update the Firestore document with the new value
      await firestoreRef.update({ names: data });
      console.log("Firestore document updated successfully.");
    } catch (error) {
      console.error("Error updating Firestore document:", error);
    }
  };
  updateFirestoreDocument();
}
export default setNewGmailInFirstore;

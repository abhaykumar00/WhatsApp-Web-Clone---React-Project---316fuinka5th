import firestore from "../firebase"; // Import the Firestore instance if not already imported
import { toast } from "react-toastify";
function handleNewGroup({ mail, email, userName, mynewRef }) {
  const createNewDocument = async () => {
    try {
      const collectionRef = firestore.collection("names");
      const newDocRef = await collectionRef.add({
        message: [],
        name1: mail.name,
        name2: userName,
        src1: mail.src,
        src2: mynewRef.current,
        gmail1: email,
        gmail2: mail.gmail,
        type: "personal",
      });
      toast.success(mail.name + " added successfully");
      console.log("this is successful", newDocRef.id);
    } catch (error) {
      toast.error("Firestore facing server issue");
      console.error("Error creating new document in Firestore:", error);
    }
  };

  createNewDocument();
}

export default handleNewGroup;

import firestore from "../firebase";
import { toast } from "react-toastify";
function deleteFirestoreDocumentById({
  id,
  setHeaderName,
  setLastSeen,
  setfetchVAlue,
  setGroupLogo,
}) {
  console.log(id, "this is id for delete");
  const deleteDocument = async () => {
    try {
      // Assuming you have a Firestore reference to the document you want to delete
      const firestoreRef = firestore.collection("names").doc(id);

      // Delete the Firestore document
      await firestoreRef.delete();
      setHeaderName("");
      setLastSeen("");
      setfetchVAlue([]);
      setGroupLogo("");
      toast.success("Group is deleted successfully");
      console.log("Firestore document deleted successfully.");
    } catch (error) {
      toast.error("Firestore facing some problem");
      console.error("Error deleting Firestore document:", error);
    }
  };

  deleteDocument();
}

export default deleteFirestoreDocumentById;

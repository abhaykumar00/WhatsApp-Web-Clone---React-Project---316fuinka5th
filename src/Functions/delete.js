import firestore from "../firebase";

function deleteFirestoreDocumentById({
  id,
  setHeaderName,
  setLastSeen,
  setfetchVAlue,
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
      console.log("Firestore document deleted successfully.");
    } catch (error) {
      console.error("Error deleting Firestore document:", error);
    }
  };

  deleteDocument();
}

export default deleteFirestoreDocumentById;

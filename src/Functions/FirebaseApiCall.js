import firestore from "../firebase";

const firebaseApiCall = async ({ setAllGmail }) => {
  // Initialize the state to hold the fetched documents
  const fetchedDocuments = [];

  // Use the useEffect hook to fetch data when the component mounts

  // const fetchFirestoreDocuments = async () => {
  try {
    // Get a reference to the "gmail" collection in Firestore
    const collectionRef = await firestore.collection("gmail");

    // Get a snapshot of the documents in the collection
    const snapshot = await collectionRef.get();

    // Initialize an array to hold the fetched documents

    // Loop through the snapshot and extract document data
    snapshot.forEach((doc) => {
      const documentData = doc.data();
      fetchedDocuments.push({
        id: doc.id,
        ...documentData,
      });
    });

    // console.log(
    //   "this is collection in the firebaseApiCall",
    //   fetchedDocuments[0].names
    // );
    // Set the fetched data in the component state
  } catch (error) {
    console.error("Error fetching documents from Firestore: ", error);
  }
  // };

  // Call the fetchFirestoreDocuments function when the component mounts
  // fetchFirestoreDocuments();
  // The empty dependency array [] ensures this effect runs only once

  // You can use the fetchedDocuments array in your component as needed

  return fetchedDocuments;
};

export default firebaseApiCall;

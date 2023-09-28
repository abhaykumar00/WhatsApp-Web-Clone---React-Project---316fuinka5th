async function upLoadPersonalMessage({
  urlOfFile = "",
  setLastSeen,
  setInputValue,
  setLastMessage,
  setCheck,
  fetchValue,
}) {
  const newValue = localStorage.getItem("gmailNameObj");
  if (id || (await urlOfFile))
    if (inputvalue || (await urlOfFile)) {
      const currentDate = await new Date();
      const a = currentDate.toString();
      const b = a.indexOf("GMT");
      const c = a.substring(0, b + 3);
      time = c;
      console.log(time);
      setLastSeen(c);
      setInputValue("");
      setLastMessage(inputvalue);
      setCheck(!check);
      setfetchVAlue([
        ...fetchValue,
        {
          name1: newValue.name1,
          name2: newValue.name2,
          gmail1: newValue.gmail1,
          gmail2: newValue.gmail2,
          class: "chatSender",
          message: inputvalue,
          time: time,
          urlOfFile: urlOfFile,
        },
      ]);

      const setValueInFirestore = async () => {
        if (localStorage.getItem("type") === "all") {
          try {
            await setDoc(doc(firestore, "names", id), {
              message: [
                ...fetchValue,
                {
                  name: userNameref.current,
                  class: "chatSender",
                  message: inputvalue || "",
                  time: time,
                  urlOfFile: urlOfFile,
                },
              ],
              name: name,
              src: imgSrc,
              type: localStorage.getItem("type"),
            });

            console.log("Value set in Firestore abhay");
          } catch (error) {
            console.error("Error setting value in Firestore:", error);
          }
        } else if (localStorage.getItem("type") === "all") {
          try {
            await setDoc(doc(firestore, "names", id), {
              message: [
                ...fetchValue,
                {
                  name: userNameref.current,
                  class: "chatSender",
                  message: inputvalue || "",
                  time: time,
                  urlOfFile: urlOfFile,
                },
              ],
              name: name,
              src: imgSrc,
              type: localStorage.getItem("type"),
            });

            console.log("Value set in Firestore abhay");
          } catch (error) {
            console.error("Error setting value in Firestore:", error);
          }
        }
      };

      setValueInFirestore();
      setUrlOfFile(null);
    }
}
export default upLoadPersonalMessage;

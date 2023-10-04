import React, { useState } from "react";
import setVisibilityForGroup from "../Functions/Visibility";
import { toast } from "react-toastify";
function GroupInfo({
  globalAllGmail,
  adminName,
  visible,
  id,
  setGroupInfo,
  email,
  groupLogo,
}) {
  console.log(
    "this is globalAllGmail",
    globalAllGmail,
    "thi sis andmin name ",
    adminName,
    "thi si ,",
    visible,
    "my email",
    email
  );

  const admin = [];
  const [usersInGroup, setUsersInGroup] = useState([
    "user1@gmail.com",
    "user2@gmail.com",
    "user3@gmail.com",
  ]);
  visible.map((user, index) => {
    user.email === email && admin.push(user.email);
    user.email === email &&
      console.log(
        "this is console of visible in group info",
        user.email,
        email
      );
  });
  const [peopleNotAdded, setPeopleNotAdded] = useState([
    "user4@gmail.com",
    "user5@gmail.com",
    "user6@gmail.com",
    "user4@gmail.com",
    "user5@gmail.com",
    "user6@gmail.com",
    "user4@gmail.com",
    "user5@gmail.com",
    "user6@gmail.com",
    "user4@gmail.com",
    "user5@gmail.com",
    "user6@gmail.com",
  ]);
  console.log("this is admin", admin);
  return (
    <div className="groupInfo-div">
      <img
        onClick={() => setGroupInfo(false)}
        className="groupInfo-div-img"
        src="https://th.bing.com/th/id/R.870b2e354b200b7f572132ffcdafb475?rik=ltt%2fuBkshly3jQ&riu=http%3a%2f%2f4.bp.blogspot.com%2f-_hPtN6OSUlI%2fUofVgda6szI%2fAAAAAAAAGSM%2fhx7TmrmEc98%2fs1600%2f1-01.jpg&ehk=3gVplgejqRblebejYhW4B1PXn6E63wth5zHAet8G0Z4%3d&risl=&pid=ImgRaw&r=0"
      />
      <div className="groupInfo-div-childdiv">
        <img src={groupLogo} className="groupInfo-div-imgGroup" />
      </div>
      <div className="groupInfo-div-div">
        <h3>Group members:</h3>
        {visible.map((user, index) => (
          <div className="groupInfoName">
            <p className="groupInfoName-p1" key={index}>
              {user.email}
            </p>
            {user.email === adminName && (
              <p className="groupInfoName-p2">admin</p>
            )}
          </div>
        ))}

        <h3>Add new People:</h3>

        {globalAllGmail.map(
          (user, index) =>
            visible.filter((valu) => valu.email === user.gmail).length ===
              0 && (
              <div
                onClick={() => {
                  if (adminName === email)
                    setVisibilityForGroup({
                      email: user.gmail,
                      id,
                    });
                  else toast.error("You are not admin");
                }}
              >
                <p className="groupInfoName-p3" key={index}>
                  {user.gmail}
                </p>
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default GroupInfo;

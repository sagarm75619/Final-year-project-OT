import React, { useEffect, useState } from "react";
import API from "./api";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("profile/")
      .then((res) => setUser(res.data))
      .catch(() => alert("Not authenticated"));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>User Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default Profile;

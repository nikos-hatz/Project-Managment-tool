import { getAuth, signOut } from "firebase/auth";

const Logout = () => {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return <button onClick={handleLogout}>Log Out</button>;
};

export default Logout;

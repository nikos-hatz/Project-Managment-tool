import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();

  const handleBack = () => {
    navigate("/login"); // Redirect to the Login page
  };

  
  

    const handleSignUp = async (e) => {
    try {
        e.preventDefault();
        setError("")
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Add user to Firestore
        await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        name: name,
        role: "Contributor",
        createdAt: new Date(),
        });


        console.log("User signed up and added to Firestore:", user.uid);
        navigate("/dashboard");
    } catch (err) {
        setError(err.message);
      console.error("Error during sign-up:", err.message);

    }
    };


  return (
    <form onSubmit={handleSignUp}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
      <button onClick={handleBack} style={{ marginTop: "20px" }}>
        Back to Login
      </button>
    </form>
  );
};

export default SignUp;

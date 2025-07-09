import { useState } from "react";
import { useAuth } from "./AuthProvider";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isPending, setIsPending] = useState(false);
  const { onSessionCreated } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const data = { username, email, password };

    try {
      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Signup failed");
      }

      const result = await res.json();

      const token = result.token;

      // Call context method to update session
      onSessionCreated(token);
    } catch (err) {
      console.error("Signup error:", err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="signupForm">
      <h1>Signup Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;

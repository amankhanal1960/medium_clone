"use client";
import { FormEvent, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    // Basic client-side validation (You should also have server-side validation)
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // try {
    //   // Here you would typically make an API call to your authentication endpoint
    //   const response = await fetch("/api/login", {
    //     // Replace with your API endpoint
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     // Redirect or update state upon successful login
    //     console.log("Login successful:", data);
    //     // Example: Redirect to dashboard
    //     // router.push('/dashboard');
    //   } else {
    //     // Handle login error
    //     setError(data.message || "Invalid email or password.");
    //   }
    // } catch (err) {
    //   setError("An error occurred. Please try again later.");
    //   console.error("Login error:", err);
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBackground">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Login
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

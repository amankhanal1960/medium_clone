"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type React from "react"; // Added import for React

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      switch (result.error) {
        case "CredentialsSignin":
          setError("Invalid email or password");
          break;
        case "UserNotFound":
          setError("User not found");
          break;
        default:
          setError("An error occurred. Please try again.");
      }
    } else {
      router.push("/membership"); // Redirect after successful login
    }
  };

  const handleSignupRedirect = () => {
    router.push("/signUp");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-customBackground">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Login
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-black">
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
              className="border text-black border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className="mt-4 text-center text-black">
          <p>
            Don&apos;t have an account?{" "}
            <button
              onClick={handleSignupRedirect}
              className="text-blue-500 hover:text-blue-700"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/ui/layout"
import axios from "axios"

export default function AuthPage() {
  const router = useRouter()
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // State for Signup form
  const [signupData, setSignupData] = useState({
    name: "",
    reg: "",
    email: "",
    department: "",
    batch: "",
    role: ""
  })

  // State for Login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })

  // Handle form field changes for both forms
  const handleSignupChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value })
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  // Registration logic using axios
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axios.post("http://localhost:8080/user/register", signupData, {
        headers: { "Content-Type": "application/json" }
      })
      console.log("Signup response:", response.data)
      // On success, you might want to redirect or automatically switch to login
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed")
      setLoading(false)
    }
  }

  // Login logic using axios (adjust the endpoint and payload as needed)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axios.post("http://localhost:8080/user/login", loginData, {
        headers: { "Content-Type": "application/json" }
      })
      console.log("Login response:", response.data)
      // On successful login, redirect accordingly
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed")
      setLoading(false)
    }
  }

  return (
      <div className="max-w-md mx-auto p-4">
        <div className="mb-4 flex justify-center">
          <button
            onClick={() => setIsSignup(false)}
            className={`px-4 py-2 ${!isSignup ? "font-bold border-b-2" : "text-gray-500"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`px-4 py-2 ${isSignup ? "font-bold border-b-2" : "text-gray-500"}`}
          >
            Sign Up
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!isSignup ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              {loading ? "Submitting..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Registration Number</label>
              <input
                type="text"
                name="reg"
                value={signupData.reg}
                onChange={handleSignupChange}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Department</label>
              <input
                type="text"
                name="department"
                value={signupData.department}
                onChange={handleSignupChange}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Batch</label>
              <input
                type="text"
                name="batch"
                value={signupData.batch}
                onChange={handleSignupChange}
                className="mt-1 block w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                name="role"
                value={signupData.role}
                onChange={handleSignupChange}
                className="mt-1 block w-full border rounded p-2"
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Hod">HOD</option>
                <option value="Staff">Staff</option>
                <option value="Student">Student</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              {loading ? "Submitting..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
  )
}
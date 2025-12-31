"use client"
import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const page = () => {

    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async () => {
        try {
            const response = await fetch("/api/user/Create/create_user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await response.json();

            if (data.user_exists) {
                console.log("User already Exists");
                window.alert("User Already Exists");
            } else if (data.new_user) {
                console.log("User Created Successfully");
                window.alert("User Created Successfully");
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            return null;
        }
    }
    return (
        <>
            <input placeholder='Name' name='name' type='text' value={name} onChange={(e) => setName(e.target.value)} required />
            <input placeholder='Email' name='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input placeholder='Password' name='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button onClick={submit}>Submit</button> <br />
            <button onClick={() => router.push("/")}>Go to Home page</button>
        </>
    )
}

export default page
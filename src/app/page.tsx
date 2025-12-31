"use client"
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

const page = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  // console.log(`Email: ${session?.user?.email}`);
  // console.log(`Role: ${session?.user?.role}`);

  if (!session) {
    return (
      <>
        <b>Please Sign in</b> <br />
        <button onClick={() => router.push("/user/Create_user")}>Create User</button> <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )
  }
  return (
    <>
      <b>Welcome</b> <br />
      <button onClick={() => router.push("/user/dashboard")}>Dashboard</button><br />
      {session.user?.role === "ADMIN" ?
        <><button onClick={() => router.push("/user/All_Users")}>All Users</button> <br /> </> : ""
      }
      <button onClick={() => signOut()}>Sign out</button>
    </>
  )
}

export default page
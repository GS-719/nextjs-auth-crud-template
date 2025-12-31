"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserData {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
}

const Page = () => {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const [isEdit, setIsEdit] = useState(false);

    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("");

    const handleDelete = async (userId: string) => {
        const ok = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
        if (!ok) return;

        const res = await fetch("/api/user/delete/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId, confirm: true }),
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.message);
            return;
        }

        alert("User deleted");
    };

    const handleUpdate = async (userId: string, newName: string, newRole: string) => {
        const isAdmin = session?.user?.role === "ADMIN";
        setNewRole(session?.user?.role ?? "");
        const res = await fetch("/api/user/Update/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: userId,
                name: newName,
                ...(isAdmin && { role: newRole }),
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            alert(error.message);
            return;
        }

        setIsEdit(false);

        alert("User updated successfully");

        router.refresh();
    };

    if (session?.user?.role === "ADMIN") {
        // Fetch user data when component mounts
        useEffect(() => {
            if (status === "authenticated") {
                getUser();
            }
        }, [status]);

        const getUser = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/user/Read/me"); // relative URL
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                console.log("User data:", data);
                setUserData(data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };
    }


    // Loading state
    if (status === "loading") {
        return <p>Loading...</p>;
    }

    // Not authenticated
    if (!session) {
        return (
            <>
                <b>Please sign in to view your dashboard</b>
                <button onClick={() => signIn()}>Sign in</button>
            </>
        );
    }

    // Show user data
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

            {loading ? (
                <p>Loading user data...</p>
            ) : userData ? (
                <div className="space-y-4">
                    <p><strong>ID:</strong> {userData.id}</p>
                    <p><strong>Name:</strong> {isEdit ?
                        <><input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} required /></> :
                        <>{userData.name || "Unnamed User"}</>}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Role:</strong> {userData.role}</p>
                    <p><strong>Created At:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
                    {isEdit ?
                        <button onClick={() => handleUpdate(userData.id, newName, newRole)}>Save</button> :
                        <button onClick={() => setIsEdit(true)}>Edit</button>
                    } <br />
                    <button onClick={() => handleDelete(userData.id)}>Delete</button> <br />
                    <button onClick={() => signOut()}>Sign Out</button> <br />
                    <button onClick={() => router.back()}>Go Back</button>
                </div>

            ) : (
                <p>No user data available</p>
            )}
        </div>
    );
};

export default Page;

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    createdAt: string;
}

export default function UserProfile() {
    const params = useParams(); // Get [id] from the URL
    const router = useRouter(); // Used for the "Back" button

    const { data: session } = useSession();

    // State management
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        useEffect(() => {
            // If there is no ID yet (route mounting), don't fetch
            if (!params?.id) return;

            const fetchUser = async () => {
                try {
                    const res = await fetch(`/api/user/Read/user/${params.id}`);

                    if (res.status === 404) {
                        throw new Error("User not found");
                    }

                    if (!res.ok) {
                        throw new Error("Failed to fetch user details");
                    }

                    const data: User = await res.json();
                    setUser(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchUser();
        }, [params?.id]);

    }
    // 1. Loading State
    if (loading) {
        return (
            <div>
                <p>Loading user profile...</p>
            </div>
        );
    }

    // 2. Error State
    if (error) {
        return (
            <div>
                <p>{error}</p>
                <button
                    onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
        );
    }

    // 3. Success State (Display User)
    return (
        <div>
            {/* Back Button */}
            <button
                onClick={() => router.back()}>
                ← Back to list
            </button>

            {/* Profile Card */}
            <div>

                {/* Header / Avatar Area */}
                <div>
                    <h1>{isEdit ?
                        <><input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} required /></> :
                        <>{user?.name || "Unnamed User"}</>}
                    </h1>
                    <p>
                        {isEdit ?
                            <><select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                                <option value="ADMIN">ADMIN</option>
                                <option value="USER">USER</option>
                                <option value="NULL">NULL</option>
                            </select></> :
                            <>{user?.role || "User"}</>}
                    </p>
                </div>

                {/* Details List */}
                <div>
                    <div>
                        <span>Email: </span>
                        <span>{user?.email}</span>
                    </div>

                    <div>
                        <span>User ID: </span>
                        <span>{user?.id}</span>
                    </div>

                    <div>
                        <span>Joined On: </span>
                        <span>
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : "Unknown"}
                        </span>
                    </div>
                </div>
                <div>
                    {user ? <>
                        {isEdit ?
                            <button onClick={() => handleUpdate(user.id, newName, newRole)}>Save</button> :
                            <button onClick={() => setIsEdit(true)}>Edit</button>
                        }
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </> : null}
                </div>
            </div>
        </div>
    );
}

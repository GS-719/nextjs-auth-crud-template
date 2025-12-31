"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Define the shape of the User data coming from your API
interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    createdAt: string;
}

interface ApiResponse {
    data: User[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export default function UserList() {
    const router = useRouter();
    const { data: session } = useSession();

    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10); // Default to 10, can be changed to 30/50
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    if (session?.user?.role === "ADMIN") {

        // Function to fetch data
        const loadUsers = async (pageToLoad: number, resetList: boolean = false) => {
            if (loading) return;
            setLoading(true);

            try {
                const res = await fetch(`/api/user/Read/list?page=${pageToLoad}&limit=${limit}`);

                if (!res.ok) throw new Error("Failed to fetch");

                const response: ApiResponse = await res.json();
                const newUsers = response.data;

                if (resetList) {
                    setUsers(newUsers);
                } else {
                    // Append new users to the existing list (WhatsApp/Feed style)
                    setUsers((prev) => [...prev, ...newUsers]);
                }

                // Check if we have reached the total number of users
                // If the current list size + new batch size >= total, stop.
                const currentCount = resetList ? newUsers.length : users.length + newUsers.length;
                setHasMore(currentCount < response.meta.total);

            } catch (error) {
                console.error("Error loading users:", error);
            } finally {
                setLoading(false);
            }
        };

        // Initial Load & When Limit changes
        useEffect(() => {
            setPage(1); // Reset to page 1
            loadUsers(1, true); // Fetch and replace existing list
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [limit]); // Re-run if user changes "10, 30, 50" dropdown

        // Handle "Load More" click
        const handleLoadMore = () => {
            const nextPage = page + 1;
            setPage(nextPage);
            loadUsers(nextPage, false); // Fetch and append
        };

        return (
            <div>
                <div>
                    <h1>User Directory</h1>

                    {/* Gmail/System style selector for batch size */}
                    <div>
                        <label>Show rows:</label>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>

                {/* User List Display */}
                <div>
                    <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Role</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Created At</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Get User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                        {user.name || "No Name"}
                                    </td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                        {user.email}
                                    </td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                        {user.role || "User"}
                                    </td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                        <button onClick={() => router.push(`/user/Get_User/${user.id}`)}>Get User</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                {/* Load More Button (The "Read More" logic) */}
                <div>
                    {loading && <p>Loading more users...</p>}

                    {!loading && hasMore && (
                        <button onClick={handleLoadMore}>
                            Load More Users
                        </button>
                    )}

                    {!loading && !hasMore && users.length > 0 && (
                        <p>You have reached the end of the list.</p>
                    )}

                    {!loading && users.length === 0 && (
                        <p>No users found.</p>
                    )}

                    {session?.user?.role === "ADMIN" ? null : <b>Please Sign in as ADMIN to check the users</b>}
                </div>
            </div>
        );
    } else {
        return (
            <>
                <b>Please Login as ADMIN to visit this page</b>
            </>
        )
    }
}

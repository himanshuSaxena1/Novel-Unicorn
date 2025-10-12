// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (status === "authenticated" && session.user.id) {
                try {
                    const res = await api.get("/user")
                    if (res.status !== 200) {
                        toast.error("Failed to load user data.")
                    }
                    const userData = res.data.user
                    setUser(userData);
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUser();
    }, [status, session]);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (status === "unauthenticated") return <div className="text-center py-10">Please log in.</div>;

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex flex-col items-center space-y-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.avatar || "/default-avatar.png"} alt={user?.username} />
                        <AvatarFallback>{user?.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {user?.firstName} {user?.lastName}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">@{user?.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                        <p className="text-xl text-yellow-600 dark:text-yellow-400 font-semibold">
                            Coins: {user?.coinBalance || 0}
                        </p>
                    </div>
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700 dark:hover:from-yellow-700 dark:hover:to-orange-700 rounded-lg py-2">
                        Edit Profile
                    </Button>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Account Details
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Role: {user?.role || "USER"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Joined: {new Date(user?.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Stats
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Novels: {user?._count?.novels || 0}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Chapters: {user?._count?.chapters || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
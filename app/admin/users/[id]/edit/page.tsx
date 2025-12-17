// app/edit-user/page.js
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery, useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import api from "@/lib/axios"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query";

interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string
  role: string
  coinBalance: number
}

const EditUserPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter()
  const { id } = useParams()
  const [formData, setFormData] = useState<User>({
    id: "",
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    avatar: "",
    role: "USER",
    coinBalance: 0,
  })

  // Fetch user data
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await api.get(`/admin/users/${id}`)
      if (response.status !== 200) throw new Error("Failed to fetch user")
      return response.data
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        coinBalance: user.coinBalance ?? 0, 
      });
    }
  }, [user]);

  // Mutation for updating user
  const mutation = useMutation({
    mutationFn: async (updatedData: Partial<User>) => {
      const response = await api.patch(`/admin/users/${id}`, updatedData); // Remove manual JSON/stringify
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("User updated successfully");

      // Update cache immediately
      queryClient.setQueryData(["user", id], data);

      // Optionally invalidate list
      queryClient.invalidateQueries({ queryKey: ["users"] });

      router.push("/admin/users");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "coinBalance" ? (value === "" ? "" : Number(value)) : value,
    }));
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Loading user data...
      </div>
    )
  }

  if (error) return <div>Error user user</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(UserRole).map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          disabled
        />
        <Input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <Input
          name="firstName"
          value={formData.firstName || ""}
          onChange={handleChange}
          placeholder="First Name"
        />
        <Input
          name="lastName"
          value={formData.lastName || ""}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <Input
          name="avatar"
          value={formData.avatar || ""}
          onChange={handleChange}
          placeholder="Avatar URL"
        />
        <Input
          name="coinBalance"
          type="number"
          min="0"
          value={formData.coinBalance ?? ""}
          onChange={handleChange}
          placeholder="Coin Balance"
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  )
}

export default EditUserPage
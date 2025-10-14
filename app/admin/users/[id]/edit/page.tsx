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
      const response = await api.get(`/user/${id}`)
      if (response.status !== 200) throw new Error("Failed to fetch user")
      return response.data
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (user) {
      setFormData(user)
    }
  }, [user])

  // Mutation for updating user
  const mutation = useMutation({
    mutationFn: async (updatedData: Partial<User>) => {
      const response = await api.patch(`/user/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      if (!response) throw new Error("Failed to update user")
      return response.data
    },
    onSuccess: () => {
      toast.success("User updated successfully")
      router.push("/admin/users") 
    },
    onError: (error) => {
      toast.error(`${error.message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Loading novel data...
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
          value={formData.coinBalance}
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
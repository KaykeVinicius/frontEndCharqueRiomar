import { api } from "@/lib/api"
import { User } from "@/app/@types/User"

export const userApi = {
  getAll: () => api.get<User[]>("/users"),
}

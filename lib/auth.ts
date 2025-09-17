"use client"

export const auth = {
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken")
    }
    return null
  },

  getUser: () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      return user ? JSON.parse(user) : null
    }
    return null
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Erro no logout:", error)
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
    }
  },

  isAuthenticated: () => {
    return !!auth.getToken()
  },
}

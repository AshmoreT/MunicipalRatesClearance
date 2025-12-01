import { useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import AdminLoginForm from "@/components/AdminLoginForm";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const navigate = useLocation()[1];
  const { toast } = useToast();

  // Check if already logged in
  const { data: session } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/admin/session"],
  });

  useEffect(() => {
    if (session?.authenticated) {
      navigate("/admin/dashboard");
      setLocation("/admin/dashboard");
    }
  }, [session, setLocation, navigate]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/login", credentials);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard.",
      });
      navigate("/admin/dashboard");
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (data: any) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex items-center justify-center px-4 py-20">
        <AdminLoginForm onLogin={handleLogin} />
      </main>
    </div>
  );
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

export function useProducts() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      // Safety: Handle both wrapped and unwrapped formats during migration
      return res.data?.data || res.data || []; 
    }
  });

  // Ensure 'products' is always an array for the UI
  const products = Array.isArray(data) ? data : [];

  const addProduct = useMutation({
    mutationFn: (newProduct: any) => api.post("/products", newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  return { products, isLoading, addProduct };
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

export function useProducts() {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    }
  });

  const addProduct = useMutation({
    mutationFn: (newProduct: any) => api.post("/products", newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  return { products, isLoading, addProduct };
}

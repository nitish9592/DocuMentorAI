import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useGenerateAISummary() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (documentId: number) => {
      const response = await apiRequest("POST", `/api/documents/${documentId}/summary`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

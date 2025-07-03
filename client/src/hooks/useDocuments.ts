import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Document } from "@shared/schema";

export function useDocuments() {
  return useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });
}

export function useDocument(id: number) {
  return useQuery<Document>({
    queryKey: ["/api/documents", id],
    enabled: !!id,
  });
}

export function useDocumentStats() {
  return useQuery({
    queryKey: ["/api/stats"],
  });
}

export function useSearchDocuments(query: string) {
  return useQuery<Document[]>({
    queryKey: ["/api/documents/search", query],
    enabled: !!query && query.length > 0,
  });
}

export function useFilteredDocuments(filter: string) {
  return useQuery<Document[]>({
    queryKey: ["/api/documents/filter", filter],
    enabled: !!filter,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("pdf", file);
      
      const response = await apiRequest("POST", "/api/upload", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/documents/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

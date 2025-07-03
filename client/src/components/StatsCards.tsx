import { FileText, Bot, Database, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDocumentStats } from "@/hooks/useDocuments";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCards() {
  const { data: stats, isLoading } = useDocumentStats();

  const cards = [
    {
      title: "Total Documents",
      value: stats?.totalDocuments || 0,
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "AI Summaries",
      value: stats?.aiSummaries || 0,
      icon: Bot,
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Storage Used",
      value: stats?.storageUsed || "0 GB",
      icon: Database,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Recent Activity",
      value: stats?.recentActivity || "No activity",
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <Card key={index} className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-2" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground mt-2">
                      {card.value}
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

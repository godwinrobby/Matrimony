import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, MessageCircle, Star } from "lucide-react";

const DashboardStats = () => {
  const stats = [
    {
      icon: Users,
      label: "Total Profiles",
      value: "1,247",
      change: "+12%",
      bgClass: "bg-gradient-romantic",
    },
    {
      icon: Heart,
      label: "Matches Made",
      value: "89",
      change: "+23%",
      bgClass: "bg-gradient-sunset",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      value: "3,456",
      change: "+8%",
      bgClass: "bg-gradient-soft",
    },
    {
      icon: Star,
      label: "Premium Members",
      value: "342",
      change: "+15%",
      bgClass: "bg-gradient-romantic",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-romantic transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-success font-medium">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgClass}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
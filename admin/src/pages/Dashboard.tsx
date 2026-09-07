import DashboardStats from "@/components/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, TrendingUp, Users } from "lucide-react";

const Dashboard = () => {
  const recentActivity = [
    {
      id: 1,
      type: "interest",
      user: "Priya Sharma",
      action: "sent you an interest",
      time: "2 minutes ago",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      type: "message",
      user: "Rahul Gupta",
      action: "sent you a message",
      time: "15 minutes ago",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      type: "match",
      user: "Anjali Iyer",
      action: "viewed your profile",
      time: "1 hour ago",
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      type: "interest",
      user: "Vikash Rathore",
      action: "accepted your interest",
      time: "2 hours ago",
      avatar: "/placeholder.svg",
    },
    {
      id: 5,
      type: "match",
      user: "Meera Joshi",
      action: "shortlisted your profile",
      time: "5 hours ago",
      avatar: "/placeholder.svg",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "interest":
        return <Heart className="h-4 w-4 text-primary" />;
      case "message":
        return <MessageCircle className="h-4 w-4 text-primary" />;
      default:
        return <Users className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's your matrimony overview.
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent transition-colors">
                  <Avatar>
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback className="bg-gradient-soft text-primary">
                      {activity.user.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      <span className="text-primary">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  {getActivityIcon(activity.type)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="romantic" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Browse New Profiles
            </Button>
            <Button variant="soft" className="w-full justify-start">
              <Heart className="h-4 w-4 mr-2" />
              View Interests Received
            </Button>
            <Button variant="interest" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Check Messages
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Upgrade Membership
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
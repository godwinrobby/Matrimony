import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCheck, 
  Heart, 
  CreditCard, 
  TrendingUp, 
  Star,
  MessageSquare,
  Shield,
  Calendar,
  Filter
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "12,457",
      change: "+12%",
      changeType: "positive",
      icon: Users
    },
    {
      title: "Active Profiles",
      value: "8,234",
      change: "+8%",
      changeType: "positive", 
      icon: UserCheck
    },
    {
      title: "Interests Sent",
      value: "2,567",
      change: "+23%",
      changeType: "positive",
      icon: Heart
    },
    {
      title: "Premium Members",
      value: "1,890",
      change: "+15%",
      changeType: "positive",
      icon: CreditCard
    },
    {
      title: "Success Stories",
      value: "456",
      change: "+18%",
      changeType: "positive",
      icon: Star
    },
    {
      title: "Messages Today",
      value: "3,467",
      change: "+5%",
      changeType: "positive",
      icon: MessageSquare
    }
  ];

  const recentActivities = [
    {
      type: "verification",
      message: "New profile verification request from Priya Sharma",
      time: "2 minutes ago",
      status: "pending"
    },
    {
      type: "interest",
      message: "500+ interests sent in the last hour",
      time: "15 minutes ago", 
      status: "success"
    },
    {
      type: "complaint",
      message: "New complaint filed by user ID #12345",
      time: "1 hour ago",
      status: "urgent"
    },
    {
      type: "success",
      message: "New success story submitted by Anjali & Rohit",
      time: "2 hours ago",
      status: "success"
    },
    {
      type: "payment",
      message: "Premium membership purchased by Kavya Reddy",
      time: "3 hours ago",
      status: "success"
    }
  ];

  const pendingTasks = [
    {
      title: "Photo Verification",
      count: 23,
      priority: "high"
    },
    {
      title: "Document Verification", 
      count: 15,
      priority: "medium"
    },
    {
      title: "Profile Approval",
      count: 31,
      priority: "medium"
    },
    {
      title: "Complaint Resolution",
      count: 12,
      priority: "high"
    },
    {
      title: "Success Story Review",
      count: 8,
      priority: "low"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your matrimony platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-soft transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-gradient-soft flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  activity.status === 'urgent' ? 'bg-red-500' :
                  activity.status === 'success' ? 'bg-green-500' :
                  'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
                <Badge 
                  variant={
                    activity.status === 'urgent' ? 'destructive' :
                    activity.status === 'success' ? 'default' :
                    'secondary'
                  }
                  className="text-xs"
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {task.count} items pending
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      task.priority === 'high' ? 'destructive' :
                      task.priority === 'medium' ? 'default' :
                      'secondary'
                    }
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                  <span className="text-lg font-bold text-primary">
                    {task.count}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
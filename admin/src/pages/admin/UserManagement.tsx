import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle,
  XCircle,
  Crown,
  MapPin,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");

  const users = [
    {
      id: "U001",
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 98765 43210",
      age: 26,
      location: "Mumbai, Maharashtra",
      caste: "Brahmin",
      subcaste: "Smartha",
      status: "active",
      membership: "premium",
      verified: true,
      joinDate: "2024-01-15",
      lastLogin: "2 hours ago",
      profileCompletion: 95,
      avatar: "/placeholder.svg"
    },
    {
      id: "U002", 
      name: "Anjali Patel",
      email: "anjali.patel@email.com",
      phone: "+91 87654 32109",
      age: 24,
      location: "Ahmedabad, Gujarat",
      caste: "Patel",
      subcaste: "Kadva Patel",
      status: "active",
      membership: "basic",
      verified: true,
      joinDate: "2024-02-20",
      lastLogin: "1 day ago",
      profileCompletion: 78,
      avatar: "/placeholder.svg"
    },
    {
      id: "U003",
      name: "Kavya Reddy",
      email: "kavya.reddy@email.com", 
      phone: "+91 76543 21098",
      age: 28,
      location: "Hyderabad, Telangana",
      caste: "Reddy",
      subcaste: "Kappu",
      status: "pending",
      membership: "premium",
      verified: false,
      joinDate: "2024-03-10",
      lastLogin: "3 days ago",
      profileCompletion: 65,
      avatar: "/placeholder.svg"
    },
    {
      id: "U004",
      name: "Sneha Gupta",
      email: "sneha.gupta@email.com",
      phone: "+91 65432 10987",
      age: 25,
      location: "Delhi, India",
      caste: "Agarwal", 
      subcaste: "Bisa Agarwal",
      status: "suspended",
      membership: "basic",
      verified: true,
      joinDate: "2024-01-08",
      lastLogin: "1 week ago",
      profileCompletion: 88,
      avatar: "/placeholder.svg"
    },
    {
      id: "U005",
      name: "Riya Singh",
      email: "riya.singh@email.com",
      phone: "+91 54321 09876",
      age: 27,
      location: "Bangalore, Karnataka",
      caste: "Rajput",
      subcaste: "Chauhan",
      status: "active",
      membership: "premium",
      verified: true,
      joinDate: "2024-02-14",
      lastLogin: "5 hours ago",
      profileCompletion: 92,
      avatar: "/placeholder.svg"
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesMembership = membershipFilter === "all" || user.membership === membershipFilter;
    
    return matchesSearch && matchesStatus && matchesMembership;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMembershipBadge = (membership: string) => {
    return membership === "premium" ? (
      <Badge className="bg-gradient-romantic text-white border-0">
        <Crown className="h-3 w-3 mr-1" />
        Premium
      </Badge>
    ) : (
      <Badge variant="outline">Basic</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all registered users and their profiles.
          </p>
        </div>
        <Button>
          <Eye className="h-4 w-4 mr-2" />
          View All
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={membershipFilter} onValueChange={setMembershipFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Membership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location & Caste</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Profile %</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {user.age} years • ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.email}</div>
                      <div className="text-muted-foreground">{user.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.location}
                      </div>
                      <div className="text-muted-foreground">
                        {user.caste} - {user.subcaste}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(user.status)}
                      {user.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {!user.verified && <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getMembershipBadge(user.membership)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-romantic"
                          style={{ width: `${user.profileCompletion}%` }}
                        />
                      </div>
                      <span className="text-sm">{user.profileCompletion}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        {user.status !== "suspended" ? (
                          <DropdownMenuItem>
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
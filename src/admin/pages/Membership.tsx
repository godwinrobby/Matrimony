import { useState } from "react";
import MembershipCard from "@/admin/components/MembershipCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { Button } from "@/admin/components/ui/button";
import { Badge } from "@/admin/components/ui/badge";
import { Star, Crown, Sparkles, Heart, Users, MessageCircle, Check, X } from "lucide-react";

const Membership = () => {
  const [viewMode, setViewMode] = useState<"plans" | "compare">("plans");

  const membershipPlans = [
    {
      id: "basic",
      name: "Basic",
      price: 999,
      duration: "month",
      icon: Star,
      features: [
        "View up to 20 profiles per day",
        "Send up to 5 interests per day",
        "Basic search filters",
        "Profile visibility",
        "Email support",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 2499,
      duration: "3 months",
      icon: Crown,
      popular: true,
      features: [
        "Unlimited profile views",
        "Unlimited interests",
        "Advanced search filters",
        "Priority listing",
        "Message read receipts",
        "Priority customer support",
        "Profile highlighting",
      ],
    },
    {
      id: "platinum",
      name: "Platinum",
      price: 4999,
      duration: "6 months",
      icon: Sparkles,
      premium: true,
      features: [
        "All Premium features",
        "Profile spotlight",
        "Personalized matchmaking",
        "Video call feature",
        "Dedicated relationship manager",
        "Profile verification badge",
        "Advanced privacy controls",
        "Mobile app priority features",
      ],
    },
  ];

  const comparisonFeatures = [
    { feature: "Profile Views Per Day", basic: "20", premium: "Unlimited", platinum: "Unlimited" },
    { feature: "Express Interest", basic: "5/day", premium: "Unlimited", platinum: "Unlimited" },
    { feature: "Advanced Search", basic: false, premium: true, platinum: true },
    { feature: "Message Read Receipts", basic: false, premium: true, platinum: true },
    { feature: "Priority Listing", basic: false, premium: true, platinum: true },
    { feature: "Profile Highlighting", basic: false, premium: true, platinum: true },
    { feature: "Profile Spotlight", basic: false, premium: false, platinum: true },
    { feature: "Video Calls", basic: false, premium: false, platinum: true },
    { feature: "Dedicated Support", basic: false, premium: false, platinum: true },
    { feature: "Verification Badge", basic: false, premium: false, platinum: true },
  ];

  const currentPlan = "premium"; // This would come from user data

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
          Membership Plans
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Choose the perfect plan to find your soulmate. Upgrade your experience with advanced features and priority support.
        </p>
      </div>

      {/* Current Plan Status */}
      <Card className="bg-gradient-soft border-primary shadow-romantic">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-primary">Current Plan: Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Active until March 15, 2024 • Auto-renewal enabled
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-romantic text-white">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Toggle View */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === "plans" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("plans")}
          >
            View Plans
          </Button>
          <Button
            variant={viewMode === "compare" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("compare")}
          >
            Compare Features
          </Button>
        </div>
      </div>

      {viewMode === "plans" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {membershipPlans.map((plan) => (
            <MembershipCard key={plan.id} plan={plan} />
          ))}
        </div>
      ) : (
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-center">Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Features</th>
                    <th className="text-center py-4 px-4">
                      <div className="flex flex-col items-center">
                        <Star className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="font-semibold">Basic</span>
                        <span className="text-sm text-muted-foreground">₹999/month</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4">
                      <div className="flex flex-col items-center">
                        <Crown className="h-6 w-6 text-primary mb-2" />
                        <span className="font-semibold">Premium</span>
                        <span className="text-sm text-muted-foreground">₹2499/3 months</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-4">
                      <div className="flex flex-col items-center">
                        <Sparkles className="h-6 w-6 text-primary mb-2" />
                        <span className="font-semibold">Platinum</span>
                        <span className="text-sm text-muted-foreground">₹4999/6 months</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-accent/50">
                      <td className="py-3 px-4 font-medium">{item.feature}</td>
                      <td className="py-3 px-4 text-center">
                        {typeof item.basic === "boolean" ? (
                          item.basic ? (
                            <Check className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          item.basic
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof item.premium === "boolean" ? (
                          item.premium ? (
                            <Check className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          item.premium
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof item.platinum === "boolean" ? (
                          item.platinum ? (
                            <Check className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          item.platinum
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center shadow-soft">
          <CardContent className="p-6">
            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Success Stories</h3>
            <p className="text-sm text-muted-foreground">
              Over 10,000 successful matches and counting
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center shadow-soft">
          <CardContent className="p-6">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Verified Profiles</h3>
            <p className="text-sm text-muted-foreground">
              100% verified profiles for your safety and security
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center shadow-soft">
          <CardContent className="p-6">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">
              Round-the-clock customer support for premium members
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Membership;
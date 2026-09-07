import { Card, CardContent, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { Button } from "@/admin/components/ui/button";
import { Badge } from "@/admin/components/ui/badge";
import { Check, Star, Crown, Sparkles } from "lucide-react";
import { useToast } from "@/admin/hooks/use-toast";

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  premium?: boolean;
  icon: any;
}

interface MembershipCardProps {
  plan: MembershipPlan;
}

const MembershipCard = ({ plan }: MembershipCardProps) => {
  const { toast } = useToast();
  const Icon = plan.icon;

  const handleSubscribe = () => {
    toast({
      title: "Subscription Initiated!",
      description: `You've selected the ${plan.name} plan. Redirecting to payment...`,
    });
  };

  return (
    <Card 
      className={`relative hover:shadow-elegant transition-all duration-300 transform hover:scale-105 ${
        plan.popular ? 'border-primary shadow-romantic' : ''
      } ${plan.premium ? 'bg-gradient-soft border-primary' : ''}`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-gradient-romantic text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className={`p-3 rounded-full ${plan.premium ? 'bg-gradient-romantic' : 'bg-gradient-sunset'}`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
        <div className="text-3xl font-bold text-primary">
          ₹{plan.price}
          <span className="text-sm font-normal text-muted-foreground">/{plan.duration}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Check className="h-5 w-5 text-success flex-shrink-0" />
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button
          variant={plan.premium ? "romantic" : plan.popular ? "interest" : "default"}
          className="w-full"
          onClick={handleSubscribe}
        >
          Choose {plan.name}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
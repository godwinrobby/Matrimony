import { Card, CardContent } from "@/admin/components/ui/card";
import { Button } from "@/admin/components/ui/button";
import { Badge } from "@/admin/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/admin/components/ui/avatar";
import { Heart, MessageCircle, MapPin, Briefcase, GraduationCap, Calendar, Ruler, Languages, BadgeCheck } from "lucide-react";
import { useToast } from "@/admin/hooks/use-toast";

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    height?: string;
    location: string;
    profession: string;
    education: string;
    religion: string;
    caste?: string;
    motherTongue?: string;
    manglik?: string;
    image: string;
    status: "online" | "offline";
    premium: boolean;
  };
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const { toast } = useToast();

  const handleExpressInterest = () => {
    toast({
      title: "Interest Sent!",
      description: `Your interest has been sent to ${profile.name}.`,
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "Message Sent!",
      description: `Message delivered to ${profile.name}.`,
    });
  };

  return (
    <Card className="hover:shadow-romantic transition-all duration-300 transform hover:scale-105 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <Avatar className="w-full h-64 rounded-none">
            <AvatarImage src={profile.image} className="object-cover" />
            <AvatarFallback className="w-full h-64 rounded-none bg-gradient-soft flex items-center justify-center text-2xl font-bold text-primary">
              {profile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute top-4 right-4 flex gap-2">
            {profile.premium && (
              <Badge className="bg-gradient-romantic text-primary-foreground border-0">
                Premium
              </Badge>
            )}
            <Badge variant={profile.status === "online" ? "default" : "secondary"}>
              {profile.status}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-4">
            <Badge variant="outline" className="bg-background/90 backdrop-blur text-xs">
              ID: {profile.id}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-1">
              {profile.name}
              <BadgeCheck className="h-4 w-4 text-primary" />
            </h3>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1" />{profile.age} yrs</span>
            {profile.height && <span className="flex items-center"><Ruler className="h-3.5 w-3.5 mr-1" />{profile.height}</span>}
            {profile.motherTongue && <span className="flex items-center"><Languages className="h-3.5 w-3.5 mr-1" />{profile.motherTongue}</span>}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{profile.location}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{profile.profession}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 mr-2 shrink-0" />
              <span className="truncate">{profile.education}</span>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">{profile.religion}</Badge>
            {profile.caste && <Badge variant="outline" className="text-xs">{profile.caste}</Badge>}
            {profile.manglik && (
              <Badge variant="outline" className="text-xs">
                Manglik: {profile.manglik}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="interest" size="sm" className="flex-1" onClick={handleExpressInterest}>
              <Heart className="h-4 w-4 mr-2" />
              Interest
            </Button>
            <Button variant="soft" size="sm" className="flex-1" onClick={handleSendMessage}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/admin/components/ui/card";
import { Button } from "@/admin/components/ui/button";
import { Input } from "@/admin/components/ui/input";
import { Label } from "@/admin/components/ui/label";
import { Textarea } from "@/admin/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/admin/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/admin/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/admin/components/ui/avatar";
import { useToast } from "@/admin/hooks/use-toast";
import { User, Heart, GraduationCap, Briefcase, MapPin, Camera } from "lucide-react";

const EditProfile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");

  const handleSave = () => {
    toast({
      title: "Profile Updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
          Edit Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Keep your profile updated to attract the right matches.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Basic</span>
          </TabsTrigger>
          <TabsTrigger value="religion" className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Religion</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="career" className="flex items-center space-x-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Career</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-soft text-primary text-2xl">
                    JS
                  </AvatarFallback>
                </Avatar>
                <Button variant="soft">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Sharma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" defaultValue="1995-06-15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select defaultValue="male">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Select defaultValue="5-8">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-0">5'0"</SelectItem>
                      <SelectItem value="5-1">5'1"</SelectItem>
                      <SelectItem value="5-2">5'2"</SelectItem>
                      <SelectItem value="5-3">5'3"</SelectItem>
                      <SelectItem value="5-4">5'4"</SelectItem>
                      <SelectItem value="5-5">5'5"</SelectItem>
                      <SelectItem value="5-6">5'6"</SelectItem>
                      <SelectItem value="5-7">5'7"</SelectItem>
                      <SelectItem value="5-8">5'8"</SelectItem>
                      <SelectItem value="5-9">5'9"</SelectItem>
                      <SelectItem value="5-10">5'10"</SelectItem>
                      <SelectItem value="5-11">5'11"</SelectItem>
                      <SelectItem value="6-0">6'0"</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select defaultValue="never-married">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never-married">Never Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about">About Me</Label>
                <Textarea 
                  id="about" 
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                  defaultValue="I am a software engineer with a passion for technology and innovation. I enjoy reading, traveling, and spending time with family."
                />
              </div>
              
              <Button variant="romantic" onClick={handleSave}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="religion" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Religious & Cultural Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="religion">Religion</Label>
                  <Select defaultValue="hindu">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindu">Hindu</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="christian">Christian</SelectItem>
                      <SelectItem value="sikh">Sikh</SelectItem>
                      <SelectItem value="buddhist">Buddhist</SelectItem>
                      <SelectItem value="jain">Jain</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caste">Caste</Label>
                  <Input id="caste" defaultValue="General" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcaste">Sub-Caste</Label>
                  <Input id="subcaste" defaultValue="" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherTongue">Mother Tongue</Label>
                  <Select defaultValue="hindi">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="marathi">Marathi</SelectItem>
                      <SelectItem value="gujarati">Gujarati</SelectItem>
                      <SelectItem value="bengali">Bengali</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                      <SelectItem value="punjabi">Punjabi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gothra">Gothra</Label>
                  <Input id="gothra" defaultValue="" placeholder="Optional" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manglik">Manglik</Label>
                  <Select defaultValue="no">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="dont-know">Don't Know</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button variant="romantic" onClick={handleSave}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Education Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="highestEducation">Highest Education</Label>
                  <Select defaultValue="bachelors">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="professional">Professional Degree</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="educationField">Field of Study</Label>
                  <Input id="educationField" defaultValue="Computer Science" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">College/University</Label>
                  <Input id="college" defaultValue="IIT Mumbai" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Select defaultValue="2018">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 30 }, (_, i) => {
                        const year = 2024 - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="additionalQualifications">Additional Qualifications</Label>
                <Textarea 
                  id="additionalQualifications" 
                  placeholder="Any certifications, additional courses, etc."
                  className="min-h-[80px]"
                />
              </div>
              
              <Button variant="romantic" onClick={handleSave}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Career Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input id="occupation" defaultValue="Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Tech Solutions Pvt Ltd" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select defaultValue="3-5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income</Label>
                  <Select defaultValue="5-10">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-3">0-3 Lakhs</SelectItem>
                      <SelectItem value="3-5">3-5 Lakhs</SelectItem>
                      <SelectItem value="5-10">5-10 Lakhs</SelectItem>
                      <SelectItem value="10-15">10-15 Lakhs</SelectItem>
                      <SelectItem value="15-25">15-25 Lakhs</SelectItem>
                      <SelectItem value="25+">25+ Lakhs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workLocation">Work Location</Label>
                  <Input id="workLocation" defaultValue="Mumbai, Maharashtra" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workType">Work Type</Label>
                  <Select defaultValue="private">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private Sector</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="business">Business/Self-Employed</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="not-working">Not Working</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button variant="romantic" onClick={handleSave}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Partner Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preferredAgeMin">Preferred Age (Min)</Label>
                  <Select defaultValue="24">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => {
                        const age = 20 + i;
                        return (
                          <SelectItem key={age} value={age.toString()}>
                            {age} years
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredAgeMax">Preferred Age (Max)</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => {
                        const age = 25 + i;
                        return (
                          <SelectItem key={age} value={age.toString()}>
                            {age} years
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredHeight">Preferred Height</Label>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Height</SelectItem>
                      <SelectItem value="5-0+">5'0" and above</SelectItem>
                      <SelectItem value="5-3+">5'3" and above</SelectItem>
                      <SelectItem value="5-6+">5'6" and above</SelectItem>
                      <SelectItem value="5-9+">5'9" and above</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredEducation">Preferred Education</Label>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Education</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="postgraduate">Post Graduate</SelectItem>
                      <SelectItem value="professional">Professional Degree</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredLocation">Preferred Location</Label>
                  <Input id="preferredLocation" defaultValue="Mumbai, Delhi, Bangalore" placeholder="City or state preferences" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredIncome">Preferred Income</Label>
                  <Select defaultValue="any">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Income</SelectItem>
                      <SelectItem value="3+">3+ Lakhs</SelectItem>
                      <SelectItem value="5+">5+ Lakhs</SelectItem>
                      <SelectItem value="10+">10+ Lakhs</SelectItem>
                      <SelectItem value="15+">15+ Lakhs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="partnerExpectations">Partner Expectations</Label>
                <Textarea 
                  id="partnerExpectations" 
                  placeholder="Describe what you're looking for in a life partner..."
                  className="min-h-[100px]"
                  defaultValue="Looking for a caring, understanding partner who values family traditions and has modern outlook towards life."
                />
              </div>
              
              <Button variant="romantic" onClick={handleSave}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditProfile;
import { useState } from "react";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

const Profiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAge, setFilterAge] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterCaste, setFilterCaste] = useState("all");
  const [filterMotherTongue, setFilterMotherTongue] = useState("all");

  const profiles = [
    {
      id: "M10021",
      name: "Priya Sharma",
      age: 26,
      height: "5'4\"",
      location: "Mumbai, Maharashtra",
      profession: "Software Engineer at TCS",
      education: "B.Tech - Computer Science, IIT Bombay",
      religion: "Hindu",
      caste: "Brahmin - Gaur",
      motherTongue: "Hindi",
      manglik: "No",
      image: "/placeholder.svg",
      status: "online" as const,
      premium: true,
    },
    {
      id: "M10022",
      name: "Anjali Patel",
      age: 24,
      height: "5'3\"",
      location: "Ahmedabad, Gujarat",
      profession: "Doctor (MBBS) at Apollo",
      education: "MBBS - B.J. Medical College",
      religion: "Hindu",
      caste: "Patel - Kadva",
      motherTongue: "Gujarati",
      manglik: "No",
      image: "/placeholder.svg",
      status: "offline" as const,
      premium: false,
    },
    {
      id: "M10023",
      name: "Kavya Reddy",
      age: 28,
      height: "5'5\"",
      location: "Hyderabad, Telangana",
      profession: "Marketing Manager at Deloitte",
      education: "MBA - ISB Hyderabad",
      religion: "Hindu",
      caste: "Reddy - Kapu",
      motherTongue: "Telugu",
      manglik: "Yes",
      image: "/placeholder.svg",
      status: "online" as const,
      premium: true,
    },
    {
      id: "M10024",
      name: "Sneha Gupta",
      age: 25,
      height: "5'2\"",
      location: "New Delhi, Delhi",
      profession: "PGT Teacher, DPS",
      education: "M.A., B.Ed - Delhi University",
      religion: "Hindu",
      caste: "Agarwal - Bisa",
      motherTongue: "Hindi",
      manglik: "No",
      image: "/placeholder.svg",
      status: "online" as const,
      premium: false,
    },
    {
      id: "M10025",
      name: "Riya Singh",
      age: 27,
      height: "5'6\"",
      location: "Bangalore, Karnataka",
      profession: "Senior Data Analyst at Infosys",
      education: "M.Sc. Statistics - IIT Kanpur",
      religion: "Hindu",
      caste: "Rajput - Chauhan",
      motherTongue: "Hindi",
      manglik: "Anshik",
      image: "/placeholder.svg",
      status: "offline" as const,
      premium: true,
    },
    {
      id: "M10026",
      name: "Meera Joshi",
      age: 23,
      height: "5'3\"",
      location: "Pune, Maharashtra",
      profession: "UI/UX Designer at Persistent",
      education: "B.Des - Symbiosis Institute of Design",
      religion: "Hindu",
      caste: "Brahmin - Deshastha",
      motherTongue: "Marathi",
      manglik: "No",
      image: "/placeholder.svg",
      status: "online" as const,
      premium: false,
    },
    {
      id: "M10027",
      name: "Divya Iyer",
      age: 26,
      height: "5'4\"",
      location: "Chennai, Tamil Nadu",
      profession: "Chartered Accountant",
      education: "CA, B.Com - Loyola College",
      religion: "Hindu",
      caste: "Brahmin - Iyer",
      motherTongue: "Tamil",
      manglik: "No",
      image: "/placeholder.svg",
      status: "online" as const,
      premium: true,
    },
    {
      id: "M10028",
      name: "Neha Verma",
      age: 29,
      height: "5'5\"",
      location: "Jaipur, Rajasthan",
      profession: "IAS Officer",
      education: "M.A. Political Science - JNU",
      religion: "Hindu",
      caste: "Rajput - Rathore",
      motherTongue: "Hindi",
      manglik: "Yes",
      image: "/placeholder.svg",
      status: "offline" as const,
      premium: true,
    },
    {
      id: "M10029",
      name: "Pooja Nair",
      age: 25,
      height: "5'3\"",
      location: "Kochi, Kerala",
      profession: "Research Scientist at ISRO",
      education: "PhD Aerospace - IISc Bangalore",
      religion: "Hindu",
      caste: "Nair - Kiryathil",
      motherTongue: "Malayalam",
      manglik: "No",
      image: "/placeholder.svg",
      status: "online" as const,
      premium: true,
    },
  ];

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.caste.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAge = filterAge === "all" ||
                      (filterAge === "20-25" && profile.age >= 20 && profile.age <= 25) ||
                      (filterAge === "26-30" && profile.age >= 26 && profile.age <= 30) ||
                      (filterAge === "31-35" && profile.age >= 31 && profile.age <= 35);

    const matchesLocation = filterLocation === "all" || profile.location.includes(filterLocation);
    const matchesCaste = filterCaste === "all" || profile.caste.startsWith(filterCaste);
    const matchesMT = filterMotherTongue === "all" || profile.motherTongue === filterMotherTongue;

    return matchesSearch && matchesAge && matchesLocation && matchesCaste && matchesMT;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
          Browse Matrimony Profiles
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover verified Hindu matrimony profiles from trusted families across India.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, city, caste, or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAge} onValueChange={setFilterAge}>
              <SelectTrigger>
                <SelectValue placeholder="Age Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="20-25">20-25 years</SelectItem>
                <SelectItem value="26-30">26-30 years</SelectItem>
                <SelectItem value="31-35">31-35 years</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCaste} onValueChange={setFilterCaste}>
              <SelectTrigger>
                <SelectValue placeholder="Caste" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Castes</SelectItem>
                <SelectItem value="Brahmin">Brahmin</SelectItem>
                <SelectItem value="Rajput">Rajput / Kshatriya</SelectItem>
                <SelectItem value="Agarwal">Agarwal / Vaishya</SelectItem>
                <SelectItem value="Patel">Patel / Patidar</SelectItem>
                <SelectItem value="Reddy">Reddy</SelectItem>
                <SelectItem value="Nair">Nair</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMotherTongue} onValueChange={setFilterMotherTongue}>
              <SelectTrigger>
                <SelectValue placeholder="Mother Tongue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Marathi">Marathi</SelectItem>
                <SelectItem value="Gujarati">Gujarati</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
                <SelectItem value="Telugu">Telugu</SelectItem>
                <SelectItem value="Malayalam">Malayalam</SelectItem>
                <SelectItem value="Punjabi">Punjabi</SelectItem>
                <SelectItem value="Bengali">Bengali</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProfiles.length} of {profiles.length} profiles
            </p>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters to find more profiles.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profiles;

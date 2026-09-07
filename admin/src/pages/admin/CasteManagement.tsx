import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Book,
  Users,
  TreePine
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CasteManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const castes = [
    {
      id: 1,
      name: "Brahmin",
      description: "Traditional priest and teacher caste",
      subcastes: ["Smartha", "Iyengar", "Iyer", "Gaur", "Kanyakubja"],
      userCount: 1245,
      status: "active"
    },
    {
      id: 2,
      name: "Kshatriya",
      description: "Traditional warrior and ruler caste",
      subcastes: ["Rajput", "Maratha", "Thakur", "Chauhan", "Rathore"],
      userCount: 956,
      status: "active"
    },
    {
      id: 3,
      name: "Vaishya",
      description: "Traditional merchant and trader caste",
      subcastes: ["Agarwal", "Baniya", "Jain", "Maheshwari", "Oswal"],
      userCount: 1187,
      status: "active"
    },
    {
      id: 4,
      name: "Patel",
      description: "Gujarati farming community",
      subcastes: ["Kadva Patel", "Leva Patel", "Chaudhary", "Patidar"],
      userCount: 834,
      status: "active"
    },
    {
      id: 5,
      name: "Reddy",
      description: "Telugu farming and landowning community",
      subcastes: ["Kappu", "Kamma", "Velama", "Golla"],
      userCount: 623,
      status: "active"
    },
    {
      id: 6,
      name: "Nair",
      description: "Kerala warrior community",
      subcastes: ["Menon", "Pillai", "Kurup", "Panicker"],
      userCount: 445,
      status: "active"
    }
  ];

  const gotras = [
    { id: 1, name: "Bharadwaj", caste: "Brahmin", description: "Ancient sage lineage" },
    { id: 2, name: "Kashyap", caste: "Brahmin", description: "Sage Kashyap lineage" },
    { id: 3, name: "Atri", caste: "Brahmin", description: "Sage Atri lineage" },
    { id: 4, name: "Vashishtha", caste: "Brahmin", description: "Sage Vashishtha lineage" },
    { id: 5, name: "Jamadagni", caste: "Brahmin", description: "Sage Jamadagni lineage" },
    { id: 6, name: "Gautam", caste: "Brahmin", description: "Sage Gautam lineage" },
    { id: 7, name: "Viswamitra", caste: "Brahmin", description: "Sage Viswamitra lineage" }
  ];

  const filteredCastes = castes.filter(caste =>
    caste.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caste.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCaste = () => {
    toast({
      title: "Caste Added",
      description: "New caste has been added successfully.",
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
            Caste Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage castes, subcastes, and gotras for the matrimony platform.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Caste
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Caste</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="caste-name">Caste Name</Label>
                <Input id="caste-name" placeholder="Enter caste name" />
              </div>
              <div>
                <Label htmlFor="caste-description">Description</Label>
                <Textarea id="caste-description" placeholder="Enter description" />
              </div>
              <div>
                <Label htmlFor="subcastes">Subcastes (comma separated)</Label>
                <Textarea id="subcastes" placeholder="Enter subcastes separated by commas" />
              </div>
              <Button onClick={handleAddCaste} className="w-full">
                Add Caste
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search castes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Castes Management */}
        <div className="lg:col-span-2">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Castes & Subcastes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Caste</TableHead>
                    <TableHead>Subcastes</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCastes.map((caste) => (
                    <TableRow key={caste.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{caste.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {caste.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {caste.subcastes.slice(0, 3).map((subcaste) => (
                            <Badge key={subcaste} variant="outline" className="text-xs">
                              {subcaste}
                            </Badge>
                          ))}
                          {caste.subcastes.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{caste.subcastes.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{caste.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Gotras Management */}
        <div>
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                Gotras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gotras.map((gotra) => (
                  <div key={gotra.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{gotra.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {gotra.description}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {gotra.caste}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Gotra
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Gotra</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="gotra-name">Gotra Name</Label>
                      <Input id="gotra-name" placeholder="Enter gotra name" />
                    </div>
                    <div>
                      <Label htmlFor="gotra-caste">Associated Caste</Label>
                      <Input id="gotra-caste" placeholder="Enter caste name" />
                    </div>
                    <div>
                      <Label htmlFor="gotra-description">Description</Label>
                      <Textarea id="gotra-description" placeholder="Enter description" />
                    </div>
                    <Button className="w-full">
                      Add Gotra
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CasteManagement;

import { User } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Avatar, 
  AvatarFallback, 
  AvatarImage
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface UserActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

// Mock data for user activity
const mockActivities: UserActivity[] = [
  {
    id: "1",
    type: "login",
    description: "User logged in",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    type: "role_change",
    description: "User role changed from Client to Photographer",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    type: "shoot_assigned",
    description: "Assigned to shoot #12345",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
];

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onEdit: () => void;
}

export function UserProfileDialog({
  open,
  onOpenChange,
  user,
  onEdit,
}: UserProfileDialogProps) {
  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge className="mt-2">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
            </div>
          </div>

          <div className="flex-1">
            <Tabs defaultValue="info">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="info">Profile Info</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.username && (
                    <div>
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                  )}
                  
                  {user.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  )}
                  
                  {user.company && (
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{user.company}</p>
                    </div>
                  )}
                  
                  {user.createdAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Account Created</p>
                      <p className="font-medium">
                        {format(new Date(user.createdAt), "PPP")}
                      </p>
                    </div>
                  )}
                  
                  {user.lastLogin && (
                    <div>
                      <p className="text-sm text-muted-foreground">Last Login</p>
                      <p className="font-medium">
                        {format(new Date(user.lastLogin), "PPP 'at' p")}
                      </p>
                    </div>
                  )}
                </div>
                
                {user.bio && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Bio</p>
                    <p className="mt-1">{user.bio}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="activity" className="pt-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Recent Activity</h3>
                  <div className="space-y-4">
                    {mockActivities.map(activity => (
                      <div key={activity.id} className="border-b pb-3">
                        <div className="flex justify-between">
                          <p className="font-medium">{activity.description}</p>
                          <Badge variant="outline">{activity.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(activity.timestamp), "PPP 'at' p")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="stats" className="pt-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Account Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Total Shoots</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Completed Shoots</p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                      <p className="text-2xl font-bold">4.8</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Response Time</p>
                      <p className="text-2xl font-bold">1.2h</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Separator className="my-4" />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onEdit}>
            Edit Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

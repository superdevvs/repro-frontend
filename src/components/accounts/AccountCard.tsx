
import { useState } from "react";
import { User, Role } from "@/components/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit,
  UserCog,
  Ban,
  Key,
  LogIn,
  Bell,
  Link
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";

interface AccountCardProps {
  user: User;
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onResetPassword: (user: User) => void;
  onImpersonate: (user: User) => void;
  onManageNotifications: (user: User) => void;
  onLinkClientBranding: (user: User) => void;
  onViewProfile: (user: User) => void;
  isActive?: boolean;
}

export function AccountCard({
  user,
  onEdit,
  onChangeRole,
  onToggleStatus,
  onResetPassword,
  onImpersonate,
  onManageNotifications,
  onLinkClientBranding,
  onViewProfile,
  isActive = true
}: AccountCardProps) {
  const [hovering, setHovering] = useState(false);

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'admin': return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case 'photographer': return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case 'client': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 'editor': return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card 
      className={`overflow-hidden transition-all ${
        isActive ? "" : "opacity-60"
      } ${
        hovering ? "shadow-md" : "shadow-sm"
      }`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => onViewProfile(user)}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 rounded-full hover:bg-muted" onClick={(e) => e.stopPropagation()}>
              <MoreVertical className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { 
                e.stopPropagation();
                onEdit(user);
              }}>
                <Edit className="mr-2 h-4 w-4" /> Edit User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { 
                e.stopPropagation();
                onChangeRole(user);
              }}>
                <UserCog className="mr-2 h-4 w-4" /> Change Role
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { 
                e.stopPropagation();
                onToggleStatus(user);
              }}>
                <Ban className="mr-2 h-4 w-4" /> {isActive ? "Deactivate" : "Activate"} Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { 
                e.stopPropagation();
                onResetPassword(user);
              }}>
                <Key className="mr-2 h-4 w-4" /> Reset Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { 
                e.stopPropagation();
                onImpersonate(user);
              }}>
                <LogIn className="mr-2 h-4 w-4" /> Impersonate User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { 
                e.stopPropagation();
                onManageNotifications(user);
              }}>
                <Bell className="mr-2 h-4 w-4" /> Notification Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { 
                e.stopPropagation();
                onLinkClientBranding(user);
              }}>
                <Link className="mr-2 h-4 w-4" /> Link Client/Branding
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {user.company && (
          <p className="text-sm mb-2">
            <span className="font-medium">Company:</span> {user.company}
          </p>
        )}
        {user.phone && (
          <p className="text-sm mb-2">
            <span className="font-medium">Phone:</span> {user.phone}
          </p>
        )}
        {user.lastLogin && (
          <p className="text-sm text-muted-foreground">
            Last login: {formatDistance(new Date(user.lastLogin), new Date(), { addSuffix: true })}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Badge className={getRoleBadgeColor(user.role)}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
        {!isActive && <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>}
      </CardFooter>
    </Card>
  );
}

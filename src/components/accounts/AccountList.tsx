
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Check, X } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistance } from "date-fns";
import { User, Role } from "@/components/auth/AuthProvider";

interface AccountListProps {
  users: Array<User & { active?: boolean }>;
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onResetPassword: (user: User) => void;
  onImpersonate: (user: User) => void;
  onManageNotifications: (user: User) => void;
  onLinkClientBranding: (user: User) => void;
  onViewProfile: (user: User) => void;
}

export function AccountList({
  users,
  onEdit,
  onChangeRole,
  onToggleStatus,
  onResetPassword,
  onImpersonate,
  onManageNotifications,
  onLinkClientBranding,
  onViewProfile,
}: AccountListProps) {
  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'admin': return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200 border-purple-200 dark:border-purple-800";
      case 'photographer': return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border-blue-200 dark:border-blue-800";
      case 'client': return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 border-green-200 dark:border-green-800";
      case 'editor': return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 border-amber-200 dark:border-amber-800";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800";
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
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <TableCell onClick={() => onViewProfile(user)}>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getRoleBadgeColor(user.role)} border`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{user.company || "-"}</TableCell>
              <TableCell>
                {user.lastLogin ? (
                  formatDistance(new Date(user.lastLogin), new Date(), { addSuffix: true })
                ) : (
                  "Never"
                )}
              </TableCell>
              <TableCell>
                {user.active ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 border-green-200 dark:border-green-800">
                    <Check className="mr-1 h-3 w-3" /> Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 border-red-200 dark:border-red-800">
                    <X className="mr-1 h-3 w-3" /> Inactive
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onChangeRole(user)}>
                      Change Role
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                      {user.active ? "Deactivate" : "Activate"} Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onResetPassword(user)}>
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onImpersonate(user)}>
                      Impersonate User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onManageNotifications(user)}>
                      Notification Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onLinkClientBranding(user)}>
                      Link Client/Branding
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

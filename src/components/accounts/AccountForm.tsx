
import { useState, useEffect } from "react";
import { User, Role } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImageUpload } from "@/components/profile/ImageUpload";

// Define allowed roles for the form
type FormRole = 'admin' | 'photographer' | 'client' | 'editor';

const accountFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(['admin', 'photographer', 'client', 'editor'] as const),
  phone: z.string().optional(),
  company: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  isActive: z.boolean().default(true),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AccountFormValues) => void;
  initialData?: User;
}

export function AccountForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: AccountFormProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "client" as FormRole,
      phone: "",
      company: "",
      avatar: "",
      bio: "",
      username: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      // Convert Role to FormRole if needed
      const role: FormRole = initialData.role === 'superadmin' 
        ? 'admin' 
        : (initialData.role as FormRole);
        
      form.reset({
        name: initialData.name,
        email: initialData.email,
        role,
        phone: initialData.phone || "",
        company: initialData.company || "",
        avatar: initialData.avatar || "",
        bio: initialData.bio || "",
        username: initialData.username || "",
        // Use initialData.isActive if it exists, otherwise default to true
        isActive: (initialData as any).isActive !== undefined ? (initialData as any).isActive : true,
      });
      setAvatarUrl(initialData.avatar || "");
    } else {
      form.reset({
        name: "",
        email: "",
        role: "client",
        phone: "",
        company: "",
        avatar: "",
        bio: "",
        username: "",
        isActive: true,
      });
      setAvatarUrl("");
    }
  }, [initialData, form, open]);

  const handleSubmit = (values: AccountFormValues) => {
    if (avatarUrl) {
      values.avatar = avatarUrl;
    }
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Account" : "Add New Account"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update user account details"
              : "Create a new user account"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex justify-center mb-4">
              <ImageUpload
                initialImage={avatarUrl}
                onChange={(url) => {
                  setAvatarUrl(url);
                  form.setValue("avatar", url);
                }}
                className="h-24 w-24 mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="photographer">Photographer</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description about the user"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Account Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value ? "Account is active" : "Account is deactivated"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update Account" : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

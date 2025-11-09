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
import { useToast } from "@/hooks/use-toast";

// Define allowed roles for the form
type FormRole = 'admin' | 'photographer' | 'client' | 'editor';

// + add username and bio into the schema
const accountFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(['admin', 'photographer', 'client', 'editor'] as const),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().trim().min(1,"City is required"),
  state: z.string().trim().min(1,"State is required"),
  zipcode: z.string().trim().min(1,"Zip Code is required"),
  company: z.string().optional(),
  licenseNumber: z.string().optional(),
  avatar: z.string().optional(),
  companyNotes: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(), // <-- ADDED
  bio: z.string().optional(), // <-- ADDED
  isActive: z.boolean().default(true),
})
.refine(
  (data) => (data.role === "client" ? !!data.licenseNumber?.trim() : true),
  { message: "License number is required for clients", path: ["licenseNumber"] }
);

export type AccountFormValues = z.infer<typeof accountFormSchema>;



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
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "client" as FormRole,
      phone: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      company: "",
      licenseNumber: "",
      avatar: "",
      companyNotes: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if(open){
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
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        zipcode: initialData.zipcode || "",
        company: initialData.company || "",
        avatar: initialData.avatar || "",
        companyNotes: initialData.companyNotes || "",
        // username: initialData.username || "",
        // Use initialData.isActive if it exists, otherwise default to true
        isActive: (initialData).isActive !== undefined ? (initialData).isActive : true,
      });
      setAvatarUrl(initialData.avatar || "");
    } else {
      form.reset({
        name: "",
        email: "",
        role: "client",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        company: "",
        avatar: "",
        companyNotes: "",
        // username: "",
        isActive: true,
      });
      setAvatarUrl("");
    }
  }
  }, [initialData, form, open]);

  const handleSubmit = async (values: AccountFormValues) => {
    console.log("Form submitted with values:", values);
    if (avatarUrl) {
      // Backend expects a file for avatar; we currently store URL only in UI.
      // Skip sending avatar to API to avoid validation error.
      values.avatar = avatarUrl;
    }

    // If editing, delegate to parent and return
    if (initialData) {
      onSubmit(values);
      onOpenChange(false);
      return;
    }

    // Creating: call backend API here
    try {
      setSubmitting(true);
      const token = (typeof window !== 'undefined') ? (localStorage.getItem('authToken') || localStorage.getItem('token')) : null;
      if (!token) {
        throw new Error('Not authenticated');
      }

      const username = (values as any).username && (values as any).username!.trim().length > 0
        ? (values as any).username!.trim()
        : (values.email?.split('@')[0] || values.name.replace(/\s+/g, '').toLowerCase());

      const formData = new FormData();
      formData.append('name', values.name || '');
      formData.append('email', values.email || '');
      formData.append('username', username);
      if (values.phone) formData.append('phone_number', values.phone);
      if (values.company) formData.append('company_name', values.company);
      formData.append('role', values.role || 'client');
      if (values.bio) formData.append('bio', values.bio);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!res.ok) {
        const errTxt = await res.text();
        throw new Error(errTxt || 'Failed to create user');
      }

      const json = await res.json();
      const created = json.user;

      // Inform parent so it can update local list (include id)
      onSubmit({
        id: String(created.id),
        name: created.name,
        email: created.email,
        role: created.role,
        phone: created.phone_number,
        company: created.company_name,
        avatar: created.avatar,
        bio: created.bio,
      } as any);

      toast({ title: 'User created', description: `${created.name} added successfully.` });
      onOpenChange(false);
    } catch (e: any) {
      console.error('Create account failed', e);
      toast({ title: 'Create failed', description: e?.message || 'Unable to create user', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* <DialogTitle>{initialData ? "Edit Account" : "Add New Account"}</DialogTitle> */}
          <DialogTitle>
            {initialData
              ? "Update user account details"
              : "Create a new user account"}
          </DialogTitle>
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
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
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License number</FormLabel>
                    <FormControl>
                      <Input placeholder="LI0123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
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
              /> */}
            </div>

            <FormField
              control={form.control}
              name="companyNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
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
            /> */}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  console.log("✅ Create Account button clicked");
                  form.handleSubmit(handleSubmit)();
                }}
              >
                {initialData ? "Update Account" : "Create Account"}
              </Button>

            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { partners, roles } from "@/config/enums";
// import { createUser } from "@/lib/actions";
import { catchError, cn } from "@/lib/utils";
import { type SignupPayload, signupSchema } from "@/lib/validations/auth";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValues: SignupPayload = {
  role: "member",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  affiliation: "",
};

function Signup({ setIsOpen, className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [expertiseFields, setExpertiseFields] = React.useState([
    { expertise: "", order: 0 },
  ]);
  const [educationFields, setEducationFields] = React.useState([
    { education: "", order: 0 },
  ]);

  const form = useForm<SignupPayload>({
    resolver: zodResolver(signupSchema),
    defaultValues,
    mode: "onChange",
  });

  const selectedRole = form.watch("role");

  // Handle adding expertise fields
  const addExpertiseField = () => {
    setExpertiseFields([
      ...expertiseFields,
      { expertise: "", order: expertiseFields.length },
    ]);
    form.setValue("expertise", expertiseFields);
  };

  // Handle adding education fields
  const addEducationField = () => {
    setEducationFields([
      ...educationFields,
      { education: "", order: educationFields.length },
    ]);
    form.setValue("education", educationFields);
  };

  // Handle expertise field changes
  const handleExpertiseChange = (index: number, value: string) => {
    const updatedFields = [...expertiseFields];
    updatedFields[index].expertise = value;
    setExpertiseFields(updatedFields);
    form.setValue("expertise", updatedFields);
  };

  // Handle education field changes
  const handleEducationChange = (index: number, value: string) => {
    const updatedFields = [...educationFields];
    updatedFields[index].education = value;
    setEducationFields(updatedFields);
    form.setValue("education", updatedFields);
  };

  function onSubmit(data: SignupPayload) {
    startTransition(async () => {
      try {
        console.log({ data });
        // const result = await createUser(data);
        // if (result.error) throw new Error(result.error);
        toast.success("Your account has been created");
        if (setIsOpen) {
          setIsOpen(false);
        }
      } catch (err) {
        catchError(err);
      }
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
        {...props}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                {error ? (
                  <HoverCard>
                    <HoverCardTrigger>
                      <Icons.alert
                        strokeWidth={1.5}
                        className="size-3.5 text-destructive"
                      />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <FormMessage>{error.message}</FormMessage>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <FormLabel>Full Name</FormLabel>
                )}
                <FormControl>
                  <Input placeholder="Dr. Kwame Adisa" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                {error ? (
                  <HoverCard>
                    <HoverCardTrigger>
                      <Icons.alert
                        strokeWidth={1.5}
                        className="size-3.5 text-destructive"
                      />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <FormMessage>{error.message}</FormMessage>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <FormLabel>Email</FormLabel>
                )}
                <FormControl>
                  <Input type="email" placeholder="adisa@ssrg.org" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                {error ? (
                  <HoverCard>
                    <HoverCardTrigger>
                      <Icons.alert
                        strokeWidth={1.5}
                        className="size-3.5 text-destructive"
                      />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <FormMessage>{error.message}</FormMessage>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <FormLabel>Password</FormLabel>
                )}
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                {error ? (
                  <HoverCard>
                    <HoverCardTrigger>
                      <Icons.alert
                        strokeWidth={1.5}
                        className="size-3.5 text-destructive"
                      />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <FormMessage>{error.message}</FormMessage>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <FormLabel>Confirm Password</FormLabel>
                )}
                <FormControl>
                  <PasswordInput placeholder="********" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="affiliation"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                {error ? (
                  <HoverCard>
                    <HoverCardTrigger>
                      <Icons.alert
                        strokeWidth={1.5}
                        className="size-3.5 text-destructive"
                      />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <FormMessage>{error.message}</FormMessage>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <FormLabel>Affiliation (Optional)</FormLabel>
                )}
                <FormControl>
                  <Input
                    placeholder="Your organization or affiliation"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Role selection */}
          <FormField
            control={form.control}
            name="role"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                {error ? (
                  <HoverCard>
                    <HoverCardTrigger>
                      <Icons.alert
                        strokeWidth={1.5}
                        className="size-3.5 text-destructive"
                      />
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <FormMessage>{error.message}</FormMessage>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <FormLabel>Account Type</FormLabel>
                )}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.values.map((role) => (
                      <SelectItem
                        key={role}
                        className="capitalize"
                        value={role}
                      >
                        {role}
                      </SelectItem>
                    ))}
                    {/* <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="affiliate">Affiliate</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem> */}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {/* Conditional fields based on role */}
        {selectedRole === "researcher" && (
          <Card className="p-1 border bg-muted/20">
            <CardContent className="pt-4 space-y-4">
              <h3 className="font-medium">Researcher Information</h3>

              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    {error ? (
                      <HoverCard>
                        <HoverCardTrigger>
                          <Icons.alert
                            strokeWidth={1.5}
                            className="size-3.5 text-destructive"
                          />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <FormMessage>{error.message}</FormMessage>
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      <FormLabel>Title</FormLabel>
                    )}
                    <FormControl>
                      <Input placeholder="Your professional title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    {error ? (
                      <HoverCard>
                        <HoverCardTrigger>
                          <Icons.alert
                            strokeWidth={1.5}
                            className="size-3.5 text-destructive"
                          />
                        </HoverCardTrigger>
                        <HoverCardContent>
                          <FormMessage>{error.message}</FormMessage>
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      <FormLabel>Bio</FormLabel>
                    )}
                    <FormControl>
                      <Textarea
                        placeholder="Short professional biography"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Expertise fields */}
              <div className="space-y-2">
                <FormLabel>Areas of Expertise</FormLabel>
                {expertiseFields.map((field, index) => (
                  <div key={index} className="flex mb-2">
                    <Input
                      type="text"
                      value={field.expertise}
                      onChange={(e) =>
                        handleExpertiseChange(index, e.target.value)
                      }
                      placeholder="Area of expertise"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExpertiseField}
                  className="text-xs"
                >
                  + Add another expertise
                </Button>
              </div>

              {/* Education fields */}
              <div className="space-y-2">
                <FormLabel>Education</FormLabel>
                {educationFields.map((field, index) => (
                  <div key={index} className="flex mb-2">
                    <Input
                      type="text"
                      value={field.education}
                      onChange={(e) =>
                        handleEducationChange(index, e.target.value)
                      }
                      placeholder="Education"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEducationField}
                  className="text-xs"
                  disabled={isPending}
                >
                  + Add another education
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedRole === "partner" && (
          <Card className="p-1 border bg-muted/20">
            <CardContent className="pt-4 space-y-4">
              <h3 className="font-medium">Partner Information</h3>

              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Organization name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your organization"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partnerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select partner type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {partners.values.map((partner) => (
                          <SelectItem
                            key={partner}
                            className="capitalize"
                            value={partner}
                          >
                            {partner}
                          </SelectItem>
                        ))}
                        {/* <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="nonprofit">Non-profit</SelectItem>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="industry">Industry</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}
        <Button isPending={isPending} className="w-full" type="submit">
          Create Account
        </Button>
      </form>
    </Form>
  );
}

export { Signup };

// const data = {
//   "name": "Richard Dallington",
//   "email": "emrrich@gmail.com",
//   "affiliation": "unnana",
//   "password": "Beater@8",
//   "role": "researcher",
//   "title": "muilsnnkd",
//   "bio": "some bio text",
//   "expertise": [
//       {
//           "expertise": "community research",
//           "order": 0
//       },
//       {
//           "expertise": "artificial inteligence",
//           "order": 1
//       }
//   ],
//   "education": [
//       {
//           "education": "unn",
//           "order": 0
//       },
//       {
//           "education": "unizik",
//           "order": 1
//       }
//   ],
//   "website": "https://udeme.com",
//   "description": "Some descriptive texts",
//   "partnerType": "academic",
//   "organization": "Ellsa Group",
//   "confirmPassword": "Beater@8"
// }

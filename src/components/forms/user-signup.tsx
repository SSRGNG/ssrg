"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorTitle } from "@/components/forms/error-title";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { partners, roles } from "@/config/enums";
import { createUser } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { signupSchema, type SignupPayload } from "@/lib/validations/auth";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValues: SignupPayload = {
  name: "",
  email: "",
  affiliation: "",
  password: "",
  confirmPassword: "",
  role: "member",
  // Researcher fields
  title: "",
  bio: "",
  expertise: [{ expertise: "", order: 0 }],
  education: [{ education: "", order: 0 }],
  x: "",
  orcid: "",
  // Partner fields
  organization: "",
  partnerType: undefined,
  description: "",
  website: undefined,
  // logo: "",
};

function UserSignup({ setIsOpen, className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const form = useForm<SignupPayload>({
    resolver: zodResolver(signupSchema),
    defaultValues,
    mode: "onTouched",
  });

  const selectedRole = form.watch("role");

  const {
    fields: expertiseFields,
    append: appendExpertise,
    remove: removeExpertise,
  } = useFieldArray({
    control: form.control,
    name: "expertise",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  function onSubmit(data: SignupPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });
        const result = await createUser(data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Your account has been created successfully!",
        });
        if (setIsOpen) {
          setIsOpen(false);
        }
        router.push("/");
      } catch (error) {
        console.error("Failed to create account:", error);
        toast.error("Error", {
          description: "Something went wrong. Please try again.",
        });
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
        {/* Basic User Information */}
        <div className="space-y-4">
          <h3 className="text-lg">Account Information</h3>
          <Separator className="-mt-2" />

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Full Name" />
                  <FormControl>
                    <Input placeholder="Irene R. Davis" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Email Address" />
                  <FormControl>
                    <Input placeholder="e.g., irene@ssrg.org" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="affiliation"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Affiliation" />
                <FormControl>
                  <Input
                    placeholder="University, Organization, or Company"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Where you work or study</FormDescription>
              </FormItem>
            )}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Password" />
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle
                    fieldState={fieldState}
                    title="Confirm Password"
                  />
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormDescription className="-mt-2">
            Must be at least 8 characters with uppercase, lowercase, number, and
            special character
          </FormDescription>

          <FormField
            control={form.control}
            name="role"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="User Role" />
                <Select
                  // onValueChange={field.onChange}
                  onValueChange={(value) => {
                    field.onChange(value);
                    // console.log({ value });
                    console.log(form.formState.errors);

                    // Reset role-specific fields when changing roles
                    if (value !== "researcher") {
                      form.setValue("title", undefined);
                      form.setValue("bio", undefined);
                      form.setValue("x", undefined);
                      form.setValue("orcid", undefined);
                      form.setValue("expertise", []);
                      form.setValue("education", []);
                    }

                    if (value !== "partner") {
                      form.setValue("organization", undefined);
                      form.setValue("partnerType", undefined);
                      form.setValue("description", undefined);
                      form.setValue("website", undefined);
                      form.setValue("logo", undefined);
                    }
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.values
                      .filter((role) => role !== "admin")
                      .map((role) => (
                        <SelectItem
                          key={role}
                          className="capitalize"
                          value={role}
                        >
                          {role}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the role that best describes you
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        {/* Researcher Fields - Show only if role is researcher */}
        {selectedRole === "researcher" && (
          <div className="space-y-4">
            <h3 className="text-lg">Researcher Information</h3>
            <Separator className="-mt-2" />

            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Academic Title" />
                  <FormControl>
                    <Input
                      placeholder="e.g., Research Director, Community Development"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Biography" />
                  <FormControl>
                    <Textarea
                      placeholder="Brief professional biography"
                      className="min-h-24"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Optional researcher fields */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="x"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <ErrorTitle
                      fieldState={fieldState}
                      title="X (Twitter) Handle"
                    />
                    <FormControl>
                      <Input
                        placeholder="e.g., @KwameAdisa"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orcid"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <ErrorTitle fieldState={fieldState} title="ORCID ID" />
                    <FormControl>
                      <Input
                        placeholder="e.g., 0000-0002-1825-0097"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/* Expertise Fields */}
            <div className="space-y-4">
              <h4 className="text-base">Areas of Expertise</h4>

              {expertiseFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`expertise.${index}.expertise`}
                    render={({ field, fieldState }) => (
                      <FormItem className="w-full">
                        <ErrorTitle
                          fieldState={fieldState}
                          title={`Expertise ${index + 1}`}
                        />
                        <FormControl>
                          <Input
                            placeholder="e.g., Community Development"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`expertise.${index}.order`}
                    render={({ field, fieldState }) => (
                      <FormItem className="w-20">
                        <ErrorTitle fieldState={fieldState} title="Order" />
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeExpertise(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  appendExpertise({
                    expertise: "",
                    order: expertiseFields.length,
                  })
                }
              >
                <PlusCircle />
                Add Expertise
              </Button>
            </div>

            {/* Education Fields */}
            <div className="space-y-4">
              <h4 className="text-base">Education</h4>

              {educationFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`education.${index}.education`}
                    render={({ field, fieldState }) => (
                      <FormItem className="w-full">
                        <ErrorTitle
                          fieldState={fieldState}
                          title={`Degree ${index + 1}`}
                        />
                        <FormControl>
                          <Input
                            placeholder="e.g., Ph.D. in Urban Planning, University of California, Berkeley"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`education.${index}.order`}
                    render={({ field, fieldState }) => (
                      <FormItem className="w-20">
                        <ErrorTitle fieldState={fieldState} title="Order" />
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  appendEducation({
                    education: "",
                    order: educationFields.length,
                  })
                }
              >
                <PlusCircle />
                Add Education
              </Button>
            </div>
          </div>
        )}

        {/* Partner Fields - Show only if role is partner */}
        {selectedRole === "partner" && (
          <div className="space-y-4">
            <h3 className="text-lg">Partner Information</h3>
            <Separator className="-mt-2" />

            <FormField
              control={form.control}
              name="organization"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle
                    fieldState={fieldState}
                    title="Organization Name"
                  />
                  <FormControl>
                    <Input
                      placeholder="e.g., HelpAge International"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partnerType"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Partner Type" />
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
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
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle
                    fieldState={fieldState}
                    title="Organization Description"
                  />
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of your organization"
                      className="min-h-24"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Website URL" />
                  <FormControl>
                    <Input
                      placeholder="e.g., https://helpage.org"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle
                    fieldState={fieldState}
                    title="Organization Logo URL"
                  />
                  <FormControl>
                    <Input
                      placeholder="e.g., https://example.org/logo.png"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    {"Optional: URL to your organization's logo"}
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          variant="brand"
          isPending={isPending}
        >
          Create Account
        </Button>
      </form>
    </Form>
  );
}

export { UserSignup };

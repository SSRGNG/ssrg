"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from "lucide-react";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorTitle } from "@/components/forms/error-title";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { getNonResearchers } from "@/lib/actions";
import { NonResearchers } from "@/lib/actions/queries";
import { createResearcher } from "@/lib/actions/researcher";
import { cn } from "@/lib/utils";
import {
  createResearcherSchema,
  type CreateResearcherPayload,
} from "@/lib/validations/researcher";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

type AvailableUser = NonResearchers[number];
const defaultValues: Omit<CreateResearcherPayload, "userId"> = {
  title: "",
  bio: "",
  x: "",
  orcid: "",
  featured: false,
  expertise: [{ expertise: "", order: 0 }],
  education: [{ education: "", order: 0 }],
  areas: [],
};

function CreateResearcher({ setIsOpen, className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = React.useState(false);
  const [availableUsers, setAvailableUsers] = React.useState<NonResearchers>(
    []
  );
  const [selectedUser, setSelectedUser] = React.useState<AvailableUser | null>(
    null
  );

  const form = useForm<CreateResearcherPayload>({
    resolver: zodResolver(createResearcherSchema),
    defaultValues: {
      userId: "",
      ...defaultValues,
    },
    mode: "onTouched",
  });

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

  async function onClick() {
    setIsFetchingUsers(true);
    try {
      const result = await getNonResearchers();
      setAvailableUsers(result);
    } catch {
      toast.error("Error", {
        description: "Failed to load available users",
      });
    } finally {
      setIsFetchingUsers(false);
    }
  }

  async function onSubmit(data: CreateResearcherPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });
        const result = await createResearcher(data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Researcher profile created successfully!",
        });

        if (setIsOpen) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Failed to create researcher profile:", error);
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
        {/* User Selection */}
        <FormField
          control={form.control}
          name="userId"
          render={({ fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Select User" />
              <Popover modal open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between h-14"
                      onClick={onClick}
                    >
                      {selectedUser ? (
                        <div className="flex flex-col items-start">
                          <span className="font-medium">
                            {selectedUser.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {selectedUser.email}
                            {selectedUser.affiliation &&
                              ` • ${selectedUser.affiliation}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {isFetchingUsers
                            ? "Loading users..."
                            : "Select user..."}
                        </span>
                      )}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 min-w-[var(--radix-popover-trigger-width)]">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandList>
                      <CommandEmpty>
                        {isFetchingUsers
                          ? "Loading..."
                          : "No available users found."}
                      </CommandEmpty>
                      <CommandGroup>
                        {availableUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.name} ${user.email}`}
                            onSelect={() => {
                              setSelectedUser(user);
                              form.setValue("userId", user.id);
                              setOpen(false);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Check
                              className={cn(
                                "size-4",
                                selectedUser?.id === user.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {user.email}
                                {user.affiliation && ` • ${user.affiliation}`}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select a user to create a researcher profile for
              </FormDescription>
            </FormItem>
          )}
        />
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
                />
              </FormControl>
              <FormDescription>
                Your professional title or position
              </FormDescription>
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
                  placeholder="Brief professional biography describing your research interests and background..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of your research background and interests
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Optional social/professional fields */}
        <div className="grid xs:grid-cols-2 gap-4">
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
                    placeholder="e.g., @researcher"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
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
                <FormDescription>Optional</FormDescription>
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
                  <FormItem className="flex-1">
                    <ErrorTitle
                      fieldState={fieldState}
                      title={`Expertise ${index + 1}`}
                    />
                    <FormControl>
                      <Input
                        placeholder="e.g., Community Development, Urban Planning"
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
                        min="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
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
                // disabled={expertiseFields.length === 1}
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
                  <FormItem className="flex-1">
                    <ErrorTitle
                      fieldState={fieldState}
                      title={`Education ${index + 1}`}
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
                        min="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
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
                // disabled={educationFields.length === 1}
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

        <Button
          type="submit"
          className="w-full"
          variant="brand"
          isPending={isPending}
        >
          {isPending ? "Creating..." : "Create Researcher Profile"}
        </Button>
      </form>
    </Form>
  );
}

export { CreateResearcher };

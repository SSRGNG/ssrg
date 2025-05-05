"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from "lucide-react";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorTitle } from "@/components/forms/error-title";
import { Icons } from "@/components/shared/icons";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createResearchArea } from "@/lib/actions/research-areas";
import { cn } from "@/lib/utils";
import {
  type CreateResearchAreaPayload,
  createResearchAreaSchema,
} from "@/lib/validations/research-area";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
type IconName = keyof typeof Icons;

const iconNames = Object.keys(Icons) as IconName[];

const defaultValues: CreateResearchAreaPayload = {
  title: "",
  icon: iconNames.find((ico) => ico === "users") ?? "",
  image: "",
  description: "",
  detail: "",
  href: "",
  linkText: "",
  questions: [{ question: "", order: 0 }],
  methods: [{ title: "", description: "", order: 0 }],
  findings: [{ finding: "", order: 0 }],
};

function CreateResearchArea({ setIsOpen, className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const form = useForm<CreateResearchAreaPayload>({
    resolver: zodResolver(createResearchAreaSchema),
    defaultValues,
    mode: "onTouched",
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const {
    fields: methodFields,
    append: appendMethod,
    remove: removeMethod,
  } = useFieldArray({
    control: form.control,
    name: "methods",
  });

  const {
    fields: findingFields,
    append: appendFinding,
    remove: removeFinding,
  } = useFieldArray({
    control: form.control,
    name: "findings",
  });

  function onSubmit(data: CreateResearchAreaPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });
        const result = await createResearchArea(data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Research area created successfully!",
        });
        if (setIsOpen) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Failed to create research area:", error);
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
        {/* Main Research Area Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <Separator />

          <div className="grid xs:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Title" />
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
              name="icon"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Icon" />
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between h-9 px-3 font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && (
                            <IconPreview iconName={field.value as IconName} />
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 min-w-[var(--radix-popover-trigger-width)]">
                      <Command>
                        <CommandInput placeholder="Search icon..." />
                        <CommandList>
                          <CommandEmpty>No icon found.</CommandEmpty>
                          <CommandGroup>
                            {iconNames.map((iconName) => (
                              <CommandItem
                                value={iconName}
                                key={iconName}
                                onSelect={() => {
                                  form.setValue("icon", iconName);
                                  setOpen(false);
                                }}
                              >
                                {/* {iconName} */}
                                <IconPreview iconName={iconName} />
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    iconName === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Image URL" />
                <FormControl>
                  <Input
                    placeholder="e.g., /images/research/communities.webp"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Path to the image representing this research area
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Description" />
                <FormControl>
                  <Textarea
                    placeholder="Brief description of the research area"
                    className="min-h-12"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A concise summary that will appear on the research areas
                  overview
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="detail"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle
                  fieldState={fieldState}
                  title="Detailed Description"
                />
                <FormControl>
                  <Textarea
                    placeholder="Comprehensive description of the research area"
                    className="min-h-36"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A more detailed explanation that will appear on the individual
                  research area page
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="grid xs:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="href"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Page URL" />
                  <FormControl>
                    <Input
                      placeholder="e.g., /research/areas/community-development"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {"The URL path for this research area's detail page"}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkText"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Link Text" />
                  <FormControl>
                    <Input
                      placeholder="e.g., Explore Community Development Research"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Text for the &ldquo;read more&rdquo; link
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Research Questions */}
        <div className="space-y-4">
          <h3>Research Questions</h3>
          <Separator />

          {questionFields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <FormField
                control={form.control}
                name={`questions.${index}.question`}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <ErrorTitle
                      fieldState={fieldState}
                      title={`Question ${index + 1}`}
                    />
                    <FormControl>
                      <Textarea
                        placeholder="Enter a research question"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`questions.${index}.order`}
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
                onClick={() => removeQuestion(index)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              appendQuestion({
                question: "",
                order: questionFields.length,
              })
            }
          >
            <PlusCircle />
            Add Question
          </Button>
        </div>

        {/* Research Methods */}
        <div className="space-y-4">
          <h3>Research Methods</h3>
          <Separator />

          {methodFields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 border p-4 sm:p-6 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Method {index + 1}</h4>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeMethod(index)}
                >
                  <Trash2 />
                </Button>
              </div>

              <FormField
                control={form.control}
                name={`methods.${index}.title`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <ErrorTitle fieldState={fieldState} title="Title" />
                    <FormControl>
                      <Input placeholder="Method title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`methods.${index}.description`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <ErrorTitle fieldState={fieldState} title="Description" />
                    <FormControl>
                      <Textarea placeholder="Method description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`methods.${index}.order`}
                render={({ field, fieldState }) => (
                  <FormItem>
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
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              appendMethod({
                title: "",
                description: "",
                order: methodFields.length,
              })
            }
          >
            <PlusCircle />
            Add Method
          </Button>
        </div>

        {/* Research Findings */}
        <div className="space-y-4">
          <h3>Research Findings</h3>
          <Separator />

          {findingFields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <FormField
                control={form.control}
                name={`findings.${index}.finding`}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <ErrorTitle
                      fieldState={fieldState}
                      title={`Finding ${index + 1}`}
                    />
                    <FormControl>
                      <Textarea placeholder="Research finding" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`findings.${index}.order`}
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
                onClick={() => removeFinding(index)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              appendFinding({ finding: "", order: findingFields.length })
            }
          >
            <PlusCircle />
            Add Finding
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            // onClick={() => router.push("/admin/research-areas")}
          >
            Cancel
          </Button>
          <Button type="submit" variant={"brand"} isPending={isPending}>
            Create Research Area
          </Button>
        </div>
      </form>
    </Form>
  );
}

function IconPreview({ iconName }: { iconName: IconName }) {
  const Comp = Icons[iconName];
  return (
    <div className="flex items-start gap-2">
      <span className="size-[1.625rem] border rounded-lg inline-flex justify-center items-center bg-brand/20">
        <Comp className="size-4 text-brand" />
      </span>{" "}
      {iconName}
      {/* <span className="leading-none pb-0.5">{iconName}</span> */}
    </div>
  );
}

export { CreateResearchArea };

// const data = {
//   title: "Community Development",
//   icon: "users",
//   image: "/images/research/communities.webp",
//   description:
//     "Investigating models of community-led development and governance to strengthen social cohesion and resilience.",
//   detail:
//     "Communities are often best positioned to identify their needs and develop contextually appropriate solutions. Our research explores how to effectively support community agency while addressing structural barriers. Through collaborative methodologies, we document successful approaches to community empowerment that can be adapted and scaled across different contexts.",
//   href: "/research/areas/community-development",
//   linkText: "Explore Community Development Research",
//   questions: [
//     {
//       question:
//         "How can participatory governance models improve community outcomes?",
//       order: 0,
//     },
//     {
//       question:
//         "What factors contribute to sustainable community-led initiatives?",
//       order: 1,
//     },
//   ],
//   methods: [
//     {
//       title: "Participatory Action Research",
//       description:
//         "We engage community members as co-researchers throughout the research process, ensuring studies address community-identified priorities and build local research capacity.",
//       order: 0,
//     },
//     {
//       title: "Social Network Analysis",
//       description:
//         "We map relationships between community stakeholders to understand information flows, resource distribution, and power dynamics that affect community development outcomes.",
//       order: 1,
//     },
//   ],
//   findings: [
//     {
//       finding:
//         "Community-led initiatives show greater sustainability when they include robust local governance structures and transparent decision-making processes",
//       order: 0,
//     },
//     {
//       finding:
//         "Digital tools can significantly enhance participation in community planning, particularly among traditionally underrepresented groups",
//       order: 1,
//     },
//   ],
// };

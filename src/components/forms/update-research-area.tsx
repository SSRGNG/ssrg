"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from "lucide-react";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorTitle } from "@/components/forms/error-title";
import { Icons } from "@/components/shared/icons";
import { ImageSelector } from "@/components/shared/image-selector";
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
import { AdminAreasData } from "@/lib/actions/queries";
import { updateResearchArea } from "@/lib/actions/research-areas";
import { cn } from "@/lib/utils";
import {
  type UpdateResearchAreaPayload,
  updateResearchAreaSchema,
} from "@/lib/validations/research-area";

type Area = AdminAreasData[number];
type Props = React.ComponentPropsWithoutRef<"form"> & {
  researchArea: Area;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
type IconName = keyof typeof Icons;

const iconNames = Object.keys(Icons) as IconName[];

function UpdateResearchArea({
  researchArea,
  setIsOpen,
  className,
  ...props
}: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const form = useForm<UpdateResearchAreaPayload>({
    resolver: zodResolver(updateResearchAreaSchema),
    defaultValues: {
      title: researchArea.title,
      icon: researchArea.icon,
      image: researchArea.image,
      description: researchArea.description,
      detail: researchArea.detail,
      href: researchArea.href,
      linkText: researchArea.linkText,
      questions: researchArea.questions || [],
      methods: researchArea.methods || [],
      findings: researchArea.findings || [],
      publications: researchArea.publications || [],
    },
    mode: "onChange",
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

  const {
    fields: publicationFields,
    append: appendPublication,
    remove: removePublication,
  } = useFieldArray({
    control: form.control,
    name: "publications",
  });

  function onSubmit(data: UpdateResearchAreaPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });
        const result = await updateResearchArea(researchArea.id, data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Research area updated successfully!",
        });
        if (setIsOpen) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Failed to update research area:", error);
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
                  <Popover modal open={open} onOpenChange={setOpen}>
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
                  {/* <Input
                    placeholder="e.g., /images/research/communities.webp"
                    {...field}
                  /> */}
                  <ImageSelector
                    value={field.value}
                    onValueChange={field.onChange}
                    triggerClassName="w-full"
                    placeholder="Upload or Select Image"
                  />
                </FormControl>
                <FormDescription>
                  Upload a new image or select from previously uploaded images
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

        {/* Publications */}
        <div className="space-y-4">
          <h3>Associated Publications</h3>
          <Separator />

          {publicationFields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <FormField
                control={form.control}
                name={`publications.${index}.publicationId`}
                render={({ field, fieldState }) => (
                  <FormItem className="w-full">
                    <ErrorTitle
                      fieldState={fieldState}
                      title={`Publication ID ${index + 1}`}
                    />
                    <FormControl>
                      <Input placeholder="Publication UUID" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`publications.${index}.order`}
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
                onClick={() => removePublication(index)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              appendPublication({
                publicationId: "",
                order: publicationFields.length,
              })
            }
          >
            <PlusCircle />
            Add Publication
          </Button>
        </div>

        <Button
          type="submit"
          variant={"brand"}
          className="w-full"
          isPending={isPending}
        >
          Update Research Area
        </Button>
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
    </div>
  );
}

export { UpdateResearchArea };

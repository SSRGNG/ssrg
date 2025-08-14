"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { ProfileResearcher } from "@/lib/actions/queries";
import { updateResearcher } from "@/lib/actions/researcher";
import { catchError, cn } from "@/lib/utils";
import {
  updateResearcherSchema,
  type UpdateResearcherPayload,
} from "@/lib/validations/researcher";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  researcher: ProfileResearcher;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function UpdateResearcherProfile({
  researcher,
  setIsOpen,
  className,
  ...props
}: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<UpdateResearcherPayload>({
    resolver: zodResolver(updateResearcherSchema),
    defaultValues: {
      id: researcher.id,
      userId: researcher.userId,
      title: researcher.title,
      bio: researcher.bio,
      x: researcher.x,
      orcid: researcher.orcid,
      featured: researcher.featured,
      expertise:
        researcher.expertise && researcher.expertise.length > 0
          ? researcher.expertise.map((exp, idx) => ({
              expertise: exp,
              order: idx,
            }))
          : [{ expertise: "", order: 0 }],
      education:
        researcher.education && researcher.education.length > 0
          ? researcher.education.map((edu, idx) => ({
              education: edu,
              order: idx,
            }))
          : [{ education: "", order: 0 }],
      areas:
        researcher.areas && researcher.areas.length > 0
          ? researcher.areas.map((area) => ({ areaId: area.id }))
          : [],
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

  async function onSubmit(data: UpdateResearcherPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });
        const result = await updateResearcher(data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Researcher profile updated successfully!",
        });

        if (setIsOpen) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Failed to update researcher profile:", error);
        catchError(error);
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
        <FormField
          control={form.control}
          name="userId"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="User ID" />
              <FormControl>
                <Input {...field} value={field.value || ""} disabled />
              </FormControl>
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
          {isPending ? "Updating..." : "Update Researcher Profile"}
        </Button>
      </form>
    </Form>
  );
}

export { UpdateResearcherProfile };

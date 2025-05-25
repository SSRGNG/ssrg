"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { sampleFrameworks } from "@/config/constants";
import { createMultipleFrameworks } from "@/lib/actions/research";
import { cn } from "@/lib/utils";
import {
  type CreateFrameworkPayload,
  type MultipleFrameworksPayload,
  multipleFrameworksSchema,
} from "@/lib/validations/research";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultFramework: CreateFrameworkPayload = {
  title: "",
  description: "",
  order: 0,
  href: "",
  linkText: "",
};

function CreateResearchFrameworks({ setIsOpen, className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<MultipleFrameworksPayload>({
    resolver: zodResolver(multipleFrameworksSchema),
    defaultValues: {
      frameworks: [defaultFramework],
    },
    mode: "onTouched",
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "frameworks",
  });

  const addFramework = () => {
    const nextOrder =
      Math.max(
        ...fields.map((_, index) =>
          form.getValues(`frameworks.${index}.order`)
        ),
        0
      ) + 1;
    append({ ...defaultFramework, order: nextOrder });
  };

  const addSampleFrameworks = () => {
    const currentCount = fields.length;
    const frameworksWithUpdatedOrder = sampleFrameworks.map(
      (framework, index) => ({
        ...framework,
        order: currentCount + index,
      })
    );

    frameworksWithUpdatedOrder.forEach((framework) => append(framework));
    toast.success("Sample frameworks added!", {
      description: `Added ${frameworksWithUpdatedOrder.length} research frameworks`,
    });
  };

  const clearAll = () => {
    // Remove all but keep one empty framework
    const fieldsToRemove = fields.slice(1);
    fieldsToRemove.forEach((_, index) => remove(index + 1));
    form.reset({ frameworks: [defaultFramework] });
  };

  const moveAndReorder = (from: number, to: number) => {
    move(from, to);
    const updatedFields = form.getValues("frameworks").map((f, idx) => ({
      ...f,
      order: idx,
    }));
    form.setValue("frameworks", updatedFields);
  };

  function onSubmit(data: MultipleFrameworksPayload) {
    startTransition(async () => {
      try {
        const result = await createMultipleFrameworks(data);

        if (result.error) {
          toast.error(result.details ? "Validation Error" : "Error", {
            description:
              result.error +
              (result.details ? ` ${JSON.stringify(result.details)}` : ""),
          });
          return;
        }

        if (result.success) {
          toast.success("Processing Complete!", {
            description: result.message,
          });
        }

        if (setIsOpen) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Failed to create frameworks:", error);
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
        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            size="sm"
            onClick={addSampleFrameworks}
            disabled={isPending}
          >
            Add Samples
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1"
            size="sm"
            onClick={clearAll}
            disabled={isPending || fields.length <= 1}
          >
            Clear All
          </Button>
        </div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="space-y-4 border p-4 sm:p-6 rounded-lg"
          >
            <div className="flex items-center">
              <h4 className="font-medium">Framework {index + 1}</h4>
              {fields.length > 1 && (
                <React.Fragment>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => moveAndReorder(index, index - 1)}
                    disabled={index === 0 || isPending}
                    className="ml-auto rounded-r-none"
                    aria-label="Move Up"
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => moveAndReorder(index, index + 1)}
                    disabled={index === fields.length - 1 || isPending}
                    aria-label="Move Down"
                    className="rounded-none"
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={isPending}
                    aria-label="Remove Framework"
                    className="rounded-l-none"
                  >
                    <Trash2 />
                  </Button>
                </React.Fragment>
              )}
            </div>

            <FormField
              control={form.control}
              name={`frameworks.${index}.title`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Title" />
                  <FormControl>
                    <Input
                      placeholder="e.g., Theory of Change Framework"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`frameworks.${index}.description`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Description" />
                  <FormControl>
                    <Textarea
                      placeholder="Detailed explanation of the framework and its application in social solutions research..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a comprehensive description of how this framework is
                    used in your research context.
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="grid xs:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`frameworks.${index}.href`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <ErrorTitle fieldState={fieldState} title="Link URL" />
                    <FormControl>
                      <Input
                        placeholder="https://example.com/framework-guide"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      External link to framework resources.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`frameworks.${index}.linkText`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <ErrorTitle fieldState={fieldState} title="Link Text" />
                    <FormControl>
                      <Input placeholder="View Framework Guide" {...field} />
                    </FormControl>
                    <FormDescription>
                      Text to display for the external link.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`frameworks.${index}.order`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Order" />
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    <strong>Note:</strong> The order you assign to frameworks
                    determines how they appear in listings.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          onClick={addFramework}
          disabled={isPending}
          className="w-full"
        >
          <Plus />
          Add Another Framework
        </Button>

        <Separator />

        <Button
          type="submit"
          variant="brand"
          className="w-full"
          isPending={isPending}
        >
          Create {fields.length} Research{" "}
          {fields.length === 1 ? "Framework" : "Frameworks"}
        </Button>
      </form>
    </Form>
  );
}

export { CreateResearchFrameworks };

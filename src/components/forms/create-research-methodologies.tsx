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
import { sampleMethodologies } from "@/config/constants";
import { createMultipleResearchMethodologies } from "@/lib/actions/research";
import { cn } from "@/lib/utils";
import {
  type CreateMethodologyPayload,
  type MultipleMethodologiesPayload,
  multipleMethodologiesSchema,
} from "@/lib/validations/research";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultMethodology: CreateMethodologyPayload = {
  title: "",
  description: "",
  order: 0,
};

function CreateResearchMethodologies({
  setIsOpen,
  className,
  ...props
}: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<MultipleMethodologiesPayload>({
    resolver: zodResolver(multipleMethodologiesSchema),
    defaultValues: {
      methodologies: [defaultMethodology],
    },
    mode: "onTouched",
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "methodologies",
  });

  const addMethodology = () => {
    const nextOrder =
      Math.max(
        ...fields.map((_, index) =>
          form.getValues(`methodologies.${index}.order`)
        ),
        0
      ) + 1;
    append({ ...defaultMethodology, order: nextOrder });
  };

  const addSampleMethodologies = () => {
    const currentCount = fields.length;
    const methodologiesWithUpdatedOrder = sampleMethodologies.map(
      (methodology, index) => ({
        ...methodology,
        order: currentCount + index,
      })
    );

    methodologiesWithUpdatedOrder.forEach((methodology) => append(methodology));
    toast.success("Sample methodologies added!", {
      description: `Added ${methodologiesWithUpdatedOrder.length} research methodologies`,
    });
  };

  const clearAll = () => {
    // Remove all but keep one empty methodology
    const fieldsToRemove = fields.slice(1);
    fieldsToRemove.forEach((_, index) => remove(index + 1));
    form.reset({ methodologies: [defaultMethodology] });
  };

  const moveAndReorder = (from: number, to: number) => {
    move(from, to);
    const updatedFields = form.getValues("methodologies").map((m, idx) => ({
      ...m,
      order: idx,
    }));
    form.setValue("methodologies", updatedFields);
  };

  function onSubmit(data: MultipleMethodologiesPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });
        const result = await createMultipleResearchMethodologies(data);

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
        console.error("Failed to create research methodologies:", error);
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
            onClick={addSampleMethodologies}
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
              <h4 className="font-medium">Methodology {index + 1}</h4>
              {fields.length > 1 && (
                <React.Fragment>
                  {/* <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => move(index, Math.max(0, index - 1))}
                    disabled={index === 0 || isPending}
                    className="ml-auto"
                  >
                    <GripVertical />
                  </Button> */}
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
                    aria-label="Remove Methodology"
                    className="rounded-l-none"
                  >
                    <Trash2 />
                  </Button>
                </React.Fragment>
              )}
            </div>

            <FormField
              control={form.control}
              name={`methodologies.${index}.title`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Title" />
                  <FormControl>
                    <Input
                      placeholder="e.g., Participatory Action Research (PAR)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`methodologies.${index}.description`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Description" />
                  <FormControl>
                    <Textarea
                      placeholder="Detailed explanation of the research methodology and its application in social solutions research..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a comprehensive description of how this methodology
                    is used in your research context.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`methodologies.${index}.order`}
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
                    <strong>Note:</strong> The order you assign to methodologies
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
          onClick={addMethodology}
          disabled={isPending}
          className="w-full"
        >
          <Plus />
          Add Another Methodology
        </Button>

        <Separator />

        {/* <div className="flex gap-3"> */}
        <Button
          type="submit"
          variant="brand"
          // className="flex-1"
          className="w-full"
          isPending={isPending}
        >
          Create {fields.length} Research{" "}
          {fields.length === 1 ? "Methodology" : "Methodologies"}
        </Button>
        {/* {setIsOpen && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
        </div> */}
      </form>
    </Form>
  );
}

export { CreateResearchMethodologies };

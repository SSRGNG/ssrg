"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorTitle } from "@/components/forms/error-title";
import { ImageSelector } from "@/components/shared/image-selector";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/actions";
import { cn } from "@/lib/utils";
import {
  updateUserSchema,
  type UpdateUserPayload,
} from "@/lib/validations/auth";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  user: {
    userId: string;
    name: string;
    image: string | null;
    affiliation: string | null;
  };
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function UpdateUser({ user, setIsOpen, className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<UpdateUserPayload>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      affiliation: user.affiliation || "",
      image: user.image || "",
    },
    mode: "onTouched",
  });

  function onSubmit(data: UpdateUserPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });
        const result = await updateUser(user.userId, data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Your profile has been updated successfully!",
        });
        if (setIsOpen) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
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
          name="image"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Image Url" />
              <FormControl>
                <ImageSelector
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  endpoint="profileImageUploader"
                  imageStrategy={{
                    type: "filters",
                    filters: {
                      userId: user.userId,
                      categories: ["profile_picture"],
                    },
                  }}
                  triggerClassName="w-full"
                  placeholder="Upload or Select Profile Image"
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

        <Button
          type="submit"
          className="w-full"
          variant="brand"
          isPending={isPending}
        >
          Update Profile
        </Button>
      </form>
    </Form>
  );
}

export { UpdateUser };

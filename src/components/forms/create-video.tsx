"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Building2,
  CalendarIcon,
  ChevronDown,
  ExternalLink,
  Loader2,
  Mail,
  PlusCircle,
  Trash2,
  User,
  Youtube,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import {
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
  type Control,
} from "react-hook-form";
import { toast } from "sonner";

import { ErrorTitle } from "@/components/forms/error-title";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { videoCats, videoResearcherRoles } from "@/config/enums";
import { AuthorSearchResult, AuthResearcher } from "@/lib/actions/queries";
import { searchAuthors } from "@/lib/actions/search";
import { createVideo, getYouTubeVideoData } from "@/lib/actions/videos";
import { cn } from "@/lib/utils";
import {
  createVideoSchema,
  extractYouTubeId,
  type CreateVideoInput,
} from "@/lib/validations/videos";

type FormControl = Control<CreateVideoInput>;

type Researcher = AuthResearcher;

type Props<TContext> = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  context?: TContext;
};

type AuthorFieldsProps = {
  index: number;
  remove: () => void;
  control: FormControl;
  researcher?: Researcher;
};

function AuthorSelector({
  onSelect,
  selectedAuthor,
  placeholder = "Search for a researcher or author...",
  researcher,
}: {
  onSelect: (researcher: AuthorSearchResult | null) => void;
  selectedAuthor?: AuthorSearchResult | null;
  placeholder?: string;
  researcher?: Researcher;
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<
    AuthorSearchResult[]
  >([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const performSearch = React.useCallback(async (query: string) => {
    if (!query.trim()) return [];

    setIsSearching(true);
    try {
      const result = await searchAuthors(query, 20);
      return result.success ? result.results || [] : [];
    } catch (error) {
      console.error("Search error:", error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const debouncedSearch = React.useMemo(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    return (query: string) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const results = await performSearch(query);
        setSearchResults(results);
      }, 500);
    };
  }, [performSearch]);

  React.useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, debouncedSearch]);

  React.useEffect(() => {
    if (!open) {
      setSearchResults([]);
      setSearchQuery("");
    }
  }, [open]);

  const getAuthorDisplayName = (author: AuthorSearchResult) => {
    return author.data.name;
  };

  const getAuthorDetails = (author: AuthorSearchResult) => {
    const details = [];
    if (author.data.email) details.push(author.data.email);
    if (author.data.affiliation) details.push(author.data.affiliation);
    return details.join(" • ");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedAuthor ? (
            <div className="flex items-center gap-2">
              <UserAvatar
                user={{}}
                className="size-5"
                fallbackClassName="rounded-full"
                imageClassName="rounded-full"
                iconClassName="size-3"
              />
              <span className="truncate">
                {getAuthorDisplayName(selectedAuthor)}
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="min-w-[var(--radix-popover-trigger-width)]"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search researchers and authors..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isSearching && <CommandEmpty>Searching...</CommandEmpty>}

            {!isSearching && searchQuery.trim() && searchResults.length > 0 && (
              <CommandGroup heading="Search Results">
                {searchResults.map((res) => (
                  <CommandItem
                    key={`${res.type}-${res.data.name}`}
                    onSelect={() => {
                      onSelect(res);
                      setOpen(false);
                    }}
                    className="gap-3"
                  >
                    <UserAvatar
                      user={{ name: res.data.name }}
                      className="rounded-full"
                      fallbackClassName="rounded-full"
                      imageClassName="rounded-full"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="truncate">{res.data.name}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        {getAuthorDetails(res)}
                      </span>
                    </div>
                    <Badge
                      variant={
                        res.type === "researcher" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {res.type === "researcher" ? "Researcher" : "Author"}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {!isSearching &&
              searchQuery.trim() &&
              searchResults.length === 0 && (
                <CommandEmpty>
                  No researchers or authors found for &ldquo;{searchQuery}
                  &rdquo;
                </CommandEmpty>
              )}

            {!isSearching &&
              !searchQuery.trim() &&
              researcher &&
              !selectedAuthor && (
                <CommandGroup heading="You">
                  <CommandItem
                    onSelect={() => {
                      onSelect({
                        type: "researcher",
                        data: {
                          researcherId: researcher.id,
                          name: researcher.name,
                          email: researcher.email,
                          affiliation: researcher.affiliation,
                          orcid: researcher.orcid,
                        },
                      });
                      setOpen(false);
                    }}
                    className="gap-3"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={researcher.avatar ?? ""} />
                      <AvatarFallback className="text-xs">
                        {researcher.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{researcher.name} (You)</span>
                      <span className="text-xs text-muted-foreground">
                        {[researcher.email, researcher.affiliation]
                          .filter(Boolean)
                          .join(" • ")}
                      </span>
                    </div>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Researcher
                    </Badge>
                  </CommandItem>
                </CommandGroup>
              )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function AuthorFields({
  index,
  remove,
  control,
  researcher,
}: AuthorFieldsProps) {
  const { setValue } = useFormContext();
  const currentAuthor = useWatch({
    control,
    name: `authors.${index}`,
  });

  const videoResRoles = React.useMemo(() => videoResearcherRoles.items, []);

  const selectedAuthor = React.useMemo(() => {
    if (!currentAuthor) return null;
    // return {
    //   type: currentAuthor.authorId ? "author" : "researcher" as const,
    //   data: {name: currentAuthor.name,
    //       email: currentAuthor.email || "",
    //       affiliation: currentAuthor.affiliation || "",
    //       orcid: currentAuthor.orcid || "",
    //       authorId: currentAuthor.authorId ?? undefined}
    // }
    if (currentAuthor.researcherId && !currentAuthor.id) {
      return {
        type: "researcher" as const,
        data: {
          researcherId: currentAuthor.researcherId,
          name: currentAuthor.name,
          email: currentAuthor.email || "",
          affiliation: currentAuthor.affiliation || "",
          orcid: currentAuthor.orcid || "",
        },
      };
    } else if (currentAuthor.id) {
      return {
        type: "author" as const,
        data: {
          id: currentAuthor.id,
          name: currentAuthor.name,
          email: currentAuthor.email || "",
          affiliation: currentAuthor.affiliation || "",
          orcid: currentAuthor.orcid || "",
          researcherId: currentAuthor.researcherId || null,
        },
      };
    }
  }, [currentAuthor]);

  const handleAuthorSelect = (res: AuthorSearchResult | null) => {
    if (res) {
      setValue(`authors.${index}`, {
        order: index,
        role: currentAuthor?.role || "host",
        name: res.data.name,
        email: res.data.email,
        affiliation: res.data.affiliation,
        orcid: res.data.orcid,
        id: res.type === "author" ? res.data.id : undefined,
        researcherId: res.type === "researcher" ? res.data.researcherId : null,
      });
    } else {
      setValue(`authors.${index}`, {
        order: index,
        role: currentAuthor.role || "host",
        name: "",
        email: "",
        affiliation: "",
        orcid: "",
        id: undefined,
        researcherId: null,
      });
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="size-4" />
          <span className="font-medium">Author {index + 1}</span>
          {selectedAuthor && (
            <Badge
              variant={
                selectedAuthor.type === "researcher" ? "default" : "secondary"
              }
              className="text-xs"
            >
              {selectedAuthor.type === "researcher" ? "Researcher" : "Author"}
            </Badge>
          )}
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={remove}
        >
          <Trash2 />
        </Button>
      </div>

      <div className="space-y-3">
        <FormLabel>Select Researcher or Author</FormLabel>
        <AuthorSelector
          onSelect={handleAuthorSelect}
          selectedAuthor={selectedAuthor}
          placeholder="Search for an existing researcher.or author.."
          researcher={researcher}
        />
      </div>

      {selectedAuthor && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <UserAvatar
              user={{}}
              className="rounded-full"
              fallbackClassName="rounded-full"
              imageClassName="rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium">{selectedAuthor.data.name}</p>
              {selectedAuthor.data.email && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="size-3" />
                  {selectedAuthor.data.email}
                </p>
              )}
              {selectedAuthor.data.affiliation && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building2 className="size-3" />
                  {selectedAuthor.data.affiliation}
                </p>
              )}
              {selectedAuthor.data.orcid && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <ExternalLink className="size-3" />
                  ORCID: {selectedAuthor.data.orcid}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <FormField
        control={control}
        name={`authors.${index}.role`}
        render={({ field, fieldState }) => (
          <FormItem>
            <ErrorTitle fieldState={fieldState} title="Role" />
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {videoResRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}

function CreateVideo<TContext>({
  setIsOpen,
  context,
  className,
  ...props
}: Props<TContext>) {
  const [isPending, startTransition] = React.useTransition();
  const [isLoadingYouTube, setIsLoadingYouTube] = React.useState(false);
  const router = useRouter();

  const researcher = context as Researcher | undefined;
  const form = useForm<CreateVideoInput>({
    resolver: zodResolver(createVideoSchema),
    defaultValues: {
      title: "",
      description: "",
      youtubeUrl: "",
      publishedAt: new Date().toISOString(),
      category: undefined,
      series: "",
      creatorId: researcher?.userId,
      metadata: {
        youtubeId: "",
        duration: "PT0M0S",
      },
      isPublic: true,
      isFeatured: false,
      authors: [
        {
          role: "host",
          order: 0,
          name: researcher?.name,
          email: researcher?.email,
          affiliation: researcher?.affiliation,
          orcid: researcher?.orcid,
          researcherId: researcher?.id,
        },
      ],
    },
    mode: "onTouched",
  });
  // (property) authors?: ({
  //     order?: number | undefined;
  //     name?: string | undefined;
  //     isCorresponding?: boolean | undefined;
  //     id?: string | undefined;
  //     email?: string | null | undefined;
  //     affiliation?: string | null | undefined;
  //     orcid?: string | ... 1 more ... | undefined;
  //     researcherId?: string | ... 1 more ... | undefined;
  //     contribution?: string | ... 1 more ... | undefined;
  // } | undefined)[] | undefined

  // (property) authors?: ({
  //     videoId?: string | undefined;
  //     authorId?: string | undefined;
  //     order?: number | undefined;
  //     role?: "other" | "presenter" | "interviewer" | "interviewee" | "moderator" | "panelist" | ... 4 more ... | undefined;
  // } | undefined)[] | undefined
  const {
    fields: authorFields,
    append: appendAuthor,
    remove: removeAuthor,
  } = useFieldArray({
    control: form.control,
    name: "authors",
  });

  const youtubeUrl = form.watch("youtubeUrl");
  const videoCategories = React.useMemo(() => videoCats.items, []);

  // Auto-populate from YouTube URL
  React.useEffect(() => {
    if (!youtubeUrl) return;

    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) return;

    const timeoutId = setTimeout(async () => {
      setIsLoadingYouTube(true);
      try {
        const youtubeData = await getYouTubeVideoData(videoId);
        // console.log({ youtubeData });
        if (youtubeData) {
          if (!form.getValues("title")) {
            form.setValue("title", youtubeData.title);
          }
          if (!form.getValues("description")) {
            form.setValue("description", youtubeData.description);
          }
          form.setValue("publishedAt", youtubeData.publishedAt); // make a date
          form.setValue("metadata", {
            youtubeId: videoId,
            duration: youtubeData.duration,
            definition: youtubeData.definition,
            thumbnailUrl: youtubeData.thumbnailUrl,
            viewCount: youtubeData.viewCount,
            likeCount: youtubeData.likeCount,
            commentCount: youtubeData.commentCount,
            language: youtubeData.language,
            captions: youtubeData.captions,
          });
          toast.success("Video data loaded from YouTube!");
        } else {
          form.setValue("metadata", {
            youtubeId: videoId,
            duration: "PT0M0S", // Default duration
          });
          toast.error("Failed to load YouTube video data");
        }
      } catch (error) {
        console.error("Error loading YouTube data:", error);
        // Set minimum required metadata
        form.setValue("metadata", {
          youtubeId: videoId,
          duration: "PT0M0S",
        });
        toast.error("Failed to load YouTube video data");
      } finally {
        setIsLoadingYouTube(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [youtubeUrl, form]);

  const addAuthor = React.useCallback(() => {
    const newOrder = authorFields.length;
    appendAuthor({
      role: "host",
      order: newOrder,
      name: "",
      email: "",
      affiliation: "",
      orcid: "",
      researcherId: null,
    });
  }, [authorFields.length, appendAuthor]);

  const removeAuthorField = React.useCallback(
    (index: number) => {
      removeAuthor(index);
      const currentAuthors = form.getValues().authors;
      if (currentAuthors?.length) {
        currentAuthors.forEach((_, newIndex) => {
          const currentOrderPath = `authors.${newIndex}.order` as const;
          if (form.getValues(currentOrderPath) !== newIndex) {
            form.setValue(currentOrderPath, newIndex, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        });
      }
    },
    [removeAuthor, form]
  );

  const onSubmit = React.useCallback(
    (data: CreateVideoInput) => {
      // console.log("Form errors:", form.formState.errors);

      // Check if form is valid
      if (Object.keys(form.formState.errors).length > 0) {
        console.log("Form validation failed:", form.formState.errors);
        toast.error("Validation Error", {
          description: "Please check the form for errors.",
        });
        return;
      }
      startTransition(async () => {
        try {
          const youtubeId = extractYouTubeId(data.youtubeUrl);
          if (!youtubeId) {
            toast.error("Invalid YouTube URL");
            return;
          }

          const metadata = {
            ...data.metadata,
            youtubeId: data.metadata?.youtubeId || youtubeId,
            duration: data.metadata?.duration || "PT0M0S",
          };

          const payload = {
            ...data,
            metadata,
            youtubeId,
            publishedAt: new Date(data.publishedAt),
            recordedAt: data.recordedAt ? new Date(data.recordedAt) : undefined,
          };

          // console.log({ payload });

          const result = await createVideo(payload);

          if (!result.success) {
            if (result.error === "Duplicate youTube ID detected") {
              toast.error("Duplicate Youtube ID", {
                description: result.details as string,
                action: result.duplicateId
                  ? {
                      label: "View Existing",
                      onClick: () =>
                        router.push(
                          `/publications/videos/${result.duplicateId}`
                        ),
                    }
                  : undefined,
              });
            } else {
              // Handle different types of details
              let description = result.error || "Failed to create video";

              if (result.details) {
                if (Array.isArray(result.details)) {
                  // Format Zod validation errors nicely
                  const errorMessages = result.details
                    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                    .join("; ");
                  description = `${description}. ${errorMessages}`;
                } else {
                  description = result.details;
                }
              }

              toast.error("Validation Error", {
                description: description,
              });
            }
            return;
          }

          toast.success("Success", {
            description: "Video created successfully!",
          });

          form.reset();
          setIsOpen?.(false);
        } catch (error) {
          console.error("Failed to create video:", error);
          toast.error("Error", {
            description: "Something went wrong. Please try again.",
          });
        }
      });
    },
    [form, setIsOpen, router]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
        {...props}
      >
        {/* Category and YouTube URL */}
        <div className="grid xs:grid-cols-2 sm:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <FormItem className="sm:col-span-1">
                <ErrorTitle fieldState={fieldState} title="Category" />
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {videoCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="youtubeUrl"
            render={({ field, fieldState }) => (
              <FormItem className="sm:col-span-3">
                <ErrorTitle fieldState={fieldState} title="YouTube URL" />
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      {...field}
                      className="pl-10"
                    />
                    <Youtube className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    {isLoadingYouTube && (
                      <Loader2 className="absolute right-3 top-3 size-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                </FormControl>
                {/* <FormDescription>
                  Enter a YouTube URL to automatically populate video details
                </FormDescription> */}
              </FormItem>
            )}
          />
        </div>

        {/* Series and Title */}
        <div className="grid xs:grid-cols-2 sm:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="series"
            render={({ field, fieldState }) => (
              <FormItem className="sm:col-span-1">
                <ErrorTitle fieldState={fieldState} title="Series" />
                <FormControl>
                  <Input
                    placeholder="e.g., Research Spotlight Series"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem className="sm:col-span-3">
                <ErrorTitle fieldState={fieldState} title="Title" />
                <FormControl>
                  <Input
                    placeholder="Video title (auto-populated from YouTube)"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Description" />
              <FormControl>
                <Textarea
                  placeholder="Video description (auto-populated from YouTube)"
                  className="min-h-24"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Dates */}
        <div className="grid xs:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="publishedAt"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Published Date" />
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "px-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? date.toISOString() : null);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the video was published on YouTube
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recordedAt"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Recorded Date" />
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "px-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? date.toISOString() : null);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When the video was actually recorded (optional)
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        {/* Authors Section */}
        <div className="space-y-4">
          {authorFields.length === 0 ? (
            <div className="flex items-center justify-between">
              <h3>Authors</h3>
              <Button type="button" variant="secondary" onClick={addAuthor}>
                <PlusCircle />
                Add Author
              </Button>
            </div>
          ) : (
            <h3>Authors</h3>
          )}

          {authorFields.map((field, index) => (
            <AuthorFields
              key={field.id}
              index={index}
              remove={() => removeAuthorField(index)}
              control={form.control}
              researcher={researcher}
            />
          ))}
          {authorFields.length !== 0 && (
            <Button type="button" variant="secondary" onClick={addAuthor}>
              <PlusCircle />
              Add Author
            </Button>
          )}
        </div>

        {/* Status */}
        <div className="grid xs:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isPublic"
            render={({ field, fieldState }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <ErrorTitle fieldState={fieldState} title="Public" />
                  <FormDescription>
                    Make this video publicly visible
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field, fieldState }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <ErrorTitle fieldState={fieldState} title="Featured" />
                  <FormDescription>
                    Feature this video on the homepage
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          variant={"brand"}
          className="w-full"
          disabled={isPending}
          // disabled={isPending || isLoadingYouTube}
        >
          {isPending ? "Creating..." : "Create Video"}
        </Button>
      </form>
    </Form>
  );
}

export { CreateVideo };

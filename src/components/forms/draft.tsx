// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { format } from "date-fns";
// import {
//   Building2,
//   CalendarIcon,
//   ChevronDown,
//   ExternalLink,
//   Mail,
//   Plus,
//   User,
//   UserPlus,
//   X,
// } from "lucide-react";
// import * as React from "react";
// import {
//   useFieldArray,
//   useForm,
//   type Control,
//   // type FieldArrayWithId,
//   type Path,
// } from "react-hook-form";
// import { toast } from "sonner";

// import { ErrorTitle } from "@/components/forms/error-title";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";
// import { publications } from "@/config/enums";
// import { createAuthor, createPublication } from "@/lib/actions/publications";
// import {
//   AuthorData,
//   AuthorSearchResult,
//   AuthResearcher,
// } from "@/lib/actions/queries";
// import { searchAuthors } from "@/lib/actions/search";
// import { cn } from "@/lib/utils";
// import {
//   createPublicationSchema,
//   type CreatePublicationPayload,
// } from "@/lib/validations/publication";

// type FormControl = Control<CreatePublicationPayload>;
// type ControlledInputProps = {
//   control: FormControl;
//   name: Path<CreatePublicationPayload>;
//   title: string;
//   placeholder?: string;
//   type?: string;
// };

// type Researcher = AuthResearcher;
// // type Author = AuthorData
// type AuthorFieldsProps = {
//   // field: FieldArrayWithId<CreatePublicationPayload, "authors", "id">;
//   index: number;
//   remove: () => void;
//   control: Control<CreatePublicationPayload>;
//   researcher?: Researcher;
//   onSelectExistingAuthor: (index: number, author: AuthorSearchResult) => void;
// };
// type Props<TContext> = React.ComponentPropsWithoutRef<"form"> & {
//   setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
//   context?: TContext;
// };
// type CreateAuthorDialogProps = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onAuthorCreated: (author: AuthorData) => void;
// };

// // Create New Author Dialog Component
// function CreateAuthorDialog({
//   open,
//   onOpenChange,
//   onAuthorCreated,
// }: CreateAuthorDialogProps) {
//   const [isCreating, setIsCreating] = React.useState(false);
//   const [authorData, setAuthorData] = React.useState({
//     name: "",
//     email: "",
//     affiliation: "",
//     orcid: "",
//   });

//   const handleCreate = async () => {
//     if (!authorData.name.trim()) {
//       toast.error("Name is required");
//       return;
//     }

//     setIsCreating(true);
//     try {
//       const result = await createAuthor({
//         name: authorData.name,
//         email: authorData.email || undefined,
//         affiliation: authorData.affiliation || undefined,
//         orcid: authorData.orcid || undefined,
//       });

//       if (!result.success) {
//         toast.error(result.error || "Failed to create author");
//         return;
//       }

//       if (result.author) {
//         onAuthorCreated(result.author);
//         toast.success("Author created successfully");
//         setAuthorData({ name: "", email: "", affiliation: "", orcid: "" });
//         onOpenChange(false);
//       }
//     } catch (error) {
//       console.error("Error creating author:", error);
//       toast.error("Failed to create author");
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Create New Author</DialogTitle>
//           <DialogDescription>
//             {"Add a new author who isn't in the system yet."}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           <div className="space-y-2">
//             <FormLabel>Full Name *</FormLabel>
//             <Input
//               placeholder="e.g., Irene R. Davis"
//               value={authorData.name}
//               onChange={(e) =>
//                 setAuthorData((prev) => ({ ...prev, name: e.target.value }))
//               }
//             />
//           </div>

//           <div className="space-y-2">
//             <FormLabel>Email</FormLabel>
//             <Input
//               type="email"
//               placeholder="irene@unn.edu"
//               value={authorData.email}
//               onChange={(e) =>
//                 setAuthorData((prev) => ({ ...prev, email: e.target.value }))
//               }
//             />
//           </div>

//           <div className="space-y-2">
//             <FormLabel>Affiliation</FormLabel>
//             <Input
//               placeholder="University, Organization, or Company"
//               value={authorData.affiliation}
//               onChange={(e) =>
//                 setAuthorData((prev) => ({
//                   ...prev,
//                   affiliation: e.target.value,
//                 }))
//               }
//             />
//           </div>

//           <div className="space-y-2">
//             <FormLabel>ORCID ID</FormLabel>
//             <Input
//               placeholder="0000-0000-0000-0000"
//               value={authorData.orcid}
//               onChange={(e) =>
//                 setAuthorData((prev) => ({ ...prev, orcid: e.target.value }))
//               }
//             />
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleCreate}
//             disabled={isCreating || !authorData.name.trim()}
//           >
//             {isCreating ? "Creating..." : "Create Author"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // Author Search and Select Component
// function AuthorSelector({
//   onSelect,
//   selectedAuthor,
//   placeholder = "Search for an author...",
//   researcher,
// }: {
//   onSelect: (author: AuthorSearchResult | null) => void;
//   selectedAuthor?: AuthorSearchResult | null;
//   placeholder?: string;
//   researcher?: Researcher;
// }) {
//   const [open, setOpen] = React.useState(false);
//   const [searchQuery, setSearchQuery] = React.useState("");
//   const [searchResults, setSearchResults] = React.useState<
//     AuthorSearchResult[]
//   >([]);
//   const [isSearching, setIsSearching] = React.useState(false);
//   const [showCreateDialog, setShowCreateDialog] = React.useState(false);

//   const performSearch = React.useCallback(
//     async (query: string): Promise<AuthorSearchResult[]> => {
//       if (!query.trim()) return [];

//       setIsSearching(true);
//       try {
//         const result = await searchAuthors(query, 20);

//         // Add debugging logs
//         console.log("Search result:", result);

//         if (!result.success) {
//           console.error("Search failed:", result.error);
//           return [];
//         }

//         console.log("Search results:", result.results);
//         return result.results || [];
//       } catch (error) {
//         console.error("Search error:", error);
//         return [];
//       } finally {
//         setIsSearching(false);
//       }
//     },
//     []
//   );

//   // Debounce search to avoid too many API calls
//   const debouncedSearch = React.useMemo(() => {
//     const timeoutRef = { current: null as NodeJS.Timeout | null };

//     return (query: string) => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }

//       // Clear results immediately when starting a new search
//       if (query.trim()) {
//         setSearchResults([]);
//       }

//       setIsSearching(true);
//       timeoutRef.current = setTimeout(async () => {
//         const results = await performSearch(query);
//         setSearchResults(results);
//         setIsSearching(false);
//       }, 300);
//     };
//   }, [performSearch]);

//   React.useEffect(() => {
//     if (searchQuery.trim()) {
//       debouncedSearch(searchQuery);
//     } else {
//       setSearchResults([]);
//       setIsSearching(false);
//     }
//   }, [searchQuery, debouncedSearch]);

//   // Clear results when dropdown closes
//   // React.useEffect(() => {
//   //   if (!open) {
//   //     setSearchResults([]);
//   //     setSearchQuery("");
//   //   }
//   // }, [open]);

//   // Add this debug effect
//   React.useEffect(() => {
//     console.log("Current searchResults state:", searchResults);
//     console.log("Current searchQuery:", searchQuery);
//     console.log("Current isSearching:", isSearching);
//   }, [searchResults, searchQuery, isSearching]);

//   const handleAuthorCreated = (newAuthor: AuthorData) => {
//     const authorResult: AuthorSearchResult = {
//       type: "author",
//       data: newAuthor,
//     };
//     onSelect(authorResult);
//     setOpen(false);
//   };

//   const getAuthorDisplayName = (author: AuthorSearchResult) => {
//     const { data } = author;
//     if (author.type === "researcher") {
//       return `${data.name} (Researcher)`;
//     }
//     return data.name;
//   };

//   const getAuthorDetails = (author: AuthorSearchResult) => {
//     const { data } = author;
//     const details = [];
//     if (data.email) details.push(data.email);
//     if (data.affiliation) details.push(data.affiliation);
//     return details.join(" • ");
//   };

//   return (
//     <React.Fragment>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             className="w-full justify-between"
//           >
//             {selectedAuthor ? (
//               <div className="flex items-center gap-2">
//                 {selectedAuthor.type === "researcher" && (
//                   <Avatar className="h-5 w-5">
//                     <AvatarImage src={selectedAuthor.data.avatar ?? ""} />
//                     <AvatarFallback className="text-xs">
//                       {selectedAuthor.data.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")}
//                     </AvatarFallback>
//                   </Avatar>
//                 )}
//                 <span className="truncate">
//                   {getAuthorDisplayName(selectedAuthor)}
//                 </span>
//                 <Badge
//                   variant={
//                     selectedAuthor.type === "researcher"
//                       ? "default"
//                       : "secondary"
//                   }
//                   className="text-xs"
//                 >
//                   {selectedAuthor.type === "researcher"
//                     ? "Researcher"
//                     : "Author"}
//                 </Badge>
//               </div>
//             ) : (
//               placeholder
//             )}
//             <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent
//           className="min-w-[var(--radix-popover-trigger-width)]"
//           align="start"
//         >
//           <Command>
//             <CommandInput
//               placeholder="Search authors and researchers..."
//               value={searchQuery}
//               onValueChange={setSearchQuery}
//             />
//             <CommandList>
//               {isSearching && searchQuery.trim() ? (
//                 <CommandEmpty>Searching...</CommandEmpty>
//               ) : searchResults.length > 0 ? (
//                 <CommandGroup heading="Search Results">
//                   {searchResults.map((author) => (
//                     <CommandItem
//                       key={`${author.type}-${author.data.id}`}
//                       onSelect={() => {
//                         onSelect(author);
//                         setOpen(false);
//                       }}
//                       className="gap-3"
//                     >
//                       {author.type === "researcher" ? (
//                         <Avatar className="h-6 w-6">
//                           <AvatarImage src={author.data.avatar ?? ""} />
//                           <AvatarFallback className="text-xs">
//                             {author.data.name
//                               .split(" ")
//                               .map((n) => n[0])
//                               .join("")}
//                           </AvatarFallback>
//                         </Avatar>
//                       ) : (
//                         <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
//                           <User className="h-3 w-3" />
//                         </div>
//                       )}
//                       <div className="flex flex-col flex-1 min-w-0">
//                         <span className="truncate">{author.data.name}</span>
//                         <span className="text-xs text-muted-foreground truncate">
//                           {getAuthorDetails(author)}
//                         </span>
//                       </div>
//                       <Badge
//                         variant={
//                           author.type === "researcher" ? "default" : "secondary"
//                         }
//                         className="text-xs"
//                       >
//                         {author.type === "researcher" ? "Researcher" : "Author"}
//                       </Badge>
//                     </CommandItem>
//                   ))}
//                 </CommandGroup>
//               ) : searchQuery.trim() ? (
//                 <CommandEmpty>
//                   <div className="text-center py-4">
//                     <p className="text-sm text-muted-foreground mb-3">
//                       No authors found for &ldquo;{searchQuery}&rdquo;
//                     </p>
//                     <Button
//                       size="sm"
//                       onClick={() => {
//                         setShowCreateDialog(true);
//                         setOpen(false);
//                       }}
//                       className="gap-2"
//                     >
//                       <UserPlus className="size-4" />
//                       Create New Author
//                     </Button>
//                   </div>
//                 </CommandEmpty>
//               ) : researcher && !selectedAuthor ? (
//                 <CommandGroup heading="You">
//                   <CommandItem
//                     onSelect={() => {
//                       onSelect({
//                         type: "researcher",
//                         data: { ...researcher, publicationCount: 0 },
//                       });
//                       setOpen(false);
//                     }}
//                     className="gap-3"
//                   >
//                     <Avatar className="h-6 w-6">
//                       <AvatarImage src={researcher.avatar ?? ""} />
//                       <AvatarFallback className="text-xs">
//                         {researcher.name
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="flex flex-col">
//                       <span>{researcher.name} (You)</span>
//                       <span className="text-xs text-muted-foreground">
//                         {[researcher.email, researcher.affiliation]
//                           .filter(Boolean)
//                           .join(" • ")}
//                       </span>
//                     </div>
//                     <Badge variant="secondary" className="ml-auto text-xs">
//                       Researcher
//                     </Badge>
//                   </CommandItem>
//                 </CommandGroup>
//               ) : null}
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>

//       <CreateAuthorDialog
//         open={showCreateDialog}
//         onOpenChange={setShowCreateDialog}
//         onAuthorCreated={handleAuthorCreated}
//       />
//     </React.Fragment>
//   );
// }

// function ControlledInput({
//   control,
//   name,
//   title,
//   placeholder,
//   type = "text",
//   ...inputProps
// }: Omit<React.ComponentPropsWithoutRef<"input">, "name" | "title"> &
//   ControlledInputProps) {
//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field, fieldState }) => (
//         <FormItem>
//           <ErrorTitle fieldState={fieldState} title={title} />
//           <FormControl>
//             <Input
//               {...field}
//               {...inputProps}
//               type={type}
//               placeholder={placeholder}
//               value={field.value ?? ""}
//             />
//           </FormControl>
//         </FormItem>
//       )}
//     />
//   );
// }

// function JournalFields({ control }: { control: FormControl }) {
//   return (
//     <div className="grid xs:grid-cols-3 gap-4">
//       <ControlledInput
//         control={control}
//         name="metadata.volume"
//         title="Volume"
//         placeholder="e.g., 25"
//       />
//       <ControlledInput
//         control={control}
//         name="metadata.issue"
//         title="Issue"
//         placeholder="e.g., 3"
//       />
//       <ControlledInput
//         control={control}
//         name="metadata.pages"
//         title="Pages"
//         placeholder="e.g., 123-145"
//       />
//     </div>
//   );
// }
// function ConferenceFields({ control }: { control: FormControl }) {
//   return (
//     <div className="grid xs:grid-cols-2 gap-4">
//       <ControlledInput
//         control={control}
//         name="metadata.conferenceLocation"
//         title="Conference Location"
//         placeholder="e.g., New York, NY"
//       />
//       <ControlledInput
//         control={control}
//         name="metadata.conferenceDate"
//         title="Conference Date"
//         type="datetime-local"
//       />
//     </div>
//   );
// }

// function BookChapterFields({ control }: { control: FormControl }) {
//   return (
//     <div className="grid xs:grid-cols-2 gap-4">
//       <ControlledInput
//         control={control}
//         name="metadata.bookTitle"
//         title="Book Title"
//         placeholder="e.g., Handbook of Research Methods"
//       />
//       <ControlledInput
//         control={control}
//         name="metadata.publisher"
//         title="Publisher"
//         placeholder="e.g., Academic Press"
//       />
//       <ControlledInput
//         control={control}
//         name="metadata.city"
//         title="City"
//         placeholder="e.g., Boston"
//       />
//       <ControlledInput
//         control={control}
//         name="metadata.isbn"
//         title="ISBN"
//         placeholder="e.g., 978-0123456789"
//       />
//     </div>
//   );
// }

// function ReportFields({ control }: { control: FormControl }) {
//   return (
//     <div className="grid xs:grid-cols-2 gap-4">
//       <ControlledInput
//         control={control}
//         name="metadata.organization"
//         title="Organization"
//         placeholder="e.g., World Health Organization"
//       />
//       <ControlledInput
//         control={control}
//         name="metadata.reportNumber"
//         title="Report Number"
//         placeholder="e.g., WHO/2024/001"
//       />
//     </div>
//   );
// }

// function AuthorFields({
//   // field,
//   index,
//   remove,
//   control,
//   researcher,
//   onSelectExistingAuthor,
// }: AuthorFieldsProps) {
//   const [selectedAuthor, setSelectedAuthor] =
//     React.useState<AuthorSearchResult | null>(null);
//   const [isManualEntry, setIsManualEntry] = React.useState(false);

//   const handleAuthorSelect = (author: AuthorSearchResult | null) => {
//     setSelectedAuthor(author);
//     if (author) {
//       onSelectExistingAuthor(index, author);
//       setIsManualEntry(false);
//     }
//   };

//   const toggleManualEntry = () => {
//     setIsManualEntry(!isManualEntry);
//     if (!isManualEntry) {
//       setSelectedAuthor(null);
//       // Clear form fields when switching to manual entry
//       const fieldsToUpdate = ["name", "email", "affiliation", "orcid"] as const;
//       fieldsToUpdate.forEach((fieldName) => {
//         control._formValues.authors[index][fieldName] = "";
//       });
//     }
//   };
//   return (
//     <div className="p-4 border rounded-lg space-y-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <User className="size-4" />
//           <span className="font-medium">Author {index + 1}</span>
//           {selectedAuthor && selectedAuthor.type === "researcher" && (
//             <Badge variant="secondary" className="text-xs">
//               Researcher
//             </Badge>
//           )}
//         </div>
//         <Button type="button" variant="ghost" size="sm" onClick={remove}>
//           <X className="size-4" />
//         </Button>
//       </div>

//       {/* Author Selection */}
//       <div className="space-y-3">
//         <div className="flex items-center justify-between">
//           <FormLabel>Select Author</FormLabel>
//           <Button
//             type="button"
//             variant="ghost"
//             size="sm"
//             onClick={toggleManualEntry}
//             className="text-xs h-6 px-2"
//           >
//             {isManualEntry ? "Select existing" : "Manual entry"}
//           </Button>
//         </div>

//         {!isManualEntry ? (
//           <AuthorSelector
//             onSelect={handleAuthorSelect}
//             selectedAuthor={selectedAuthor}
//             placeholder="Search for an existing author..."
//             researcher={researcher}
//           />
//         ) : (
//           <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
//             Manual entry mode - fill in the details below
//           </div>
//         )}
//       </div>

//       {/* Selected Author Preview */}
//       {selectedAuthor && !isManualEntry && (
//         <div className="p-3 bg-muted/50 rounded-lg">
//           <div className="flex items-start gap-3">
//             {selectedAuthor.type === "researcher" ? (
//               <Avatar className="h-8 w-8">
//                 <AvatarImage
//                   src={(selectedAuthor.data as Researcher).avatar ?? ""}
//                 />
//                 <AvatarFallback>
//                   {selectedAuthor.data.name
//                     .split(" ")
//                     .map((n) => n[0])
//                     .join("")}
//                 </AvatarFallback>
//               </Avatar>
//             ) : (
//               <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center">
//                 <User className="h-4 w-4" />
//               </div>
//             )}
//             <div className="flex-1 min-w-0">
//               <p className="font-medium">{selectedAuthor.data.name}</p>
//               {selectedAuthor.data.email && (
//                 <p className="text-sm text-muted-foreground flex items-center gap-1">
//                   <Mail className="h-3 w-3" />
//                   {selectedAuthor.data.email}
//                 </p>
//               )}
//               {selectedAuthor.data.affiliation && (
//                 <p className="text-sm text-muted-foreground flex items-center gap-1">
//                   <Building2 className="h-3 w-3" />
//                   {selectedAuthor.data.affiliation}
//                 </p>
//               )}
//               {selectedAuthor.data.orcid && (
//                 <p className="text-sm text-muted-foreground flex items-center gap-1">
//                   <ExternalLink className="h-3 w-3" />
//                   ORCID: {selectedAuthor.data.orcid}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Manual Entry Fields */}
//       {(isManualEntry || !selectedAuthor) && (
//         <div className="space-y-4">
//           <div className="grid xs:grid-cols-2 gap-4">
//             <ControlledInput
//               control={control}
//               name={`authors.${index}.name`}
//               title="Full Name"
//               placeholder="e.g., Irene R. Davis"
//             />
//             <ControlledInput
//               control={control}
//               name={`authors.${index}.email`}
//               title="Email"
//               type="email"
//               placeholder="irene@unn.edu"
//             />
//           </div>

//           <div className="grid xs:grid-cols-2 gap-4">
//             <ControlledInput
//               control={control}
//               name={`authors.${index}.affiliation`}
//               title="Affiliation"
//               placeholder="e.g., University, Organization, or Company"
//             />
//             <ControlledInput
//               control={control}
//               name={`authors.${index}.orcid`}
//               title="ORCID ID"
//               placeholder="e.g., 0000-0000-0000-0000"
//             />
//           </div>
//         </div>
//       )}

//       {/* Contribution and Corresponding Author */}
//       <Separator />

//       <FormField
//         control={control}
//         name={`authors.${index}.contribution`}
//         render={({ field, fieldState }) => (
//           <FormItem>
//             <ErrorTitle fieldState={fieldState} title="Contribution" />
//             <FormControl>
//               <Textarea
//                 placeholder="Describe the author's contribution to this publication"
//                 className="min-h-20"
//                 {...field}
//                 value={field.value ?? ""}
//               />
//             </FormControl>
//             <FormDescription>
//               {"Optional description of the author's role and contribution"}
//             </FormDescription>
//           </FormItem>
//         )}
//       />

//       <FormField
//         control={control}
//         name={`authors.${index}.isCorresponding`}
//         render={({ field, fieldState }) => (
//           <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//             <FormControl>
//               <Checkbox
//                 checked={field.value ?? false}
//                 onCheckedChange={field.onChange}
//               />
//             </FormControl>
//             <div className="space-y-1 leading-none">
//               <ErrorTitle
//                 fieldState={fieldState}
//                 title="Corresponding Author"
//               />
//               <FormDescription>
//                 Mark this author as the corresponding author
//               </FormDescription>
//             </div>
//           </FormItem>
//         )}
//       />
//     </div>
//   );
// }

// function CreatePublication<TContext>({
//   setIsOpen,
//   context,
//   className,
//   ...props
// }: Props<TContext>) {
//   const [isPending, startTransition] = React.useTransition();

//   const researcher = context as AuthResearcher | undefined;
//   const form = useForm<CreatePublicationPayload>({
//     resolver: zodResolver(createPublicationSchema),
//     defaultValues: {
//       title: "",
//       type: "journal_article",
//       abstract: "",
//       link: "",
//       venue: "",
//       doi: "",
//       metadata: {},
//       authors: [
//         {
//           name: researcher?.name ?? "",
//           email: researcher?.email ?? "",
//           affiliation: researcher?.affiliation ?? "",
//           orcid: researcher?.orcid ?? "",
//           order: 0,
//           contribution: "",
//           isCorresponding: true,
//           researcherId: researcher?.id,
//         },
//       ],
//       areas: [],
//     },
//     mode: "onTouched",
//   });

//   const {
//     fields: authorFields,
//     append: appendAuthor,
//     remove: removeAuthor,
//   } = useFieldArray({
//     control: form.control,
//     name: "authors",
//   });

//   const selectedType = form.watch("type");
//   const publicationTypes = React.useMemo(() => publications.items, []);

//   // Optimized callbacks with useCallback
//   const addAuthor = React.useCallback(() => {
//     const newOrder = authorFields.length;
//     appendAuthor({
//       name: "",
//       email: "",
//       affiliation: "",
//       orcid: "",
//       order: newOrder,
//       contribution: "",
//       isCorresponding: false,
//       researcherId: null,
//     });
//   }, [authorFields.length, appendAuthor]);

//   const removeAuthorField = React.useCallback(
//     (index: number) => {
//       removeAuthor(index);
//       const currentAuthors = form.getValues().authors;

//       if (currentAuthors?.length) {
//         // Update order for remaining authors
//         currentAuthors.forEach((_, newArrayIndex) => {
//           const currentOrderPath = `authors.${newArrayIndex}.order` as const;
//           if (form.getValues(currentOrderPath) !== newArrayIndex) {
//             form.setValue(currentOrderPath, newArrayIndex, {
//               shouldValidate: true,
//               shouldDirty: true,
//             });
//           }
//         });

//         // Ensure at least one corresponding author exists
//         const correspondingExists = currentAuthors.some(
//           (a) => a.isCorresponding
//         );
//         if (!correspondingExists && currentAuthors.length > 0) {
//           form.setValue(`authors.0.isCorresponding`, true, {
//             shouldValidate: true,
//           });
//         }
//       }
//     },
//     [removeAuthor, form]
//   );

//   const linkToResearcher = React.useCallback(
//     async (authorIndex: number, researcher: Researcher) => {
//       form.setValue(`authors.${authorIndex}.name`, researcher.name);
//       form.setValue(`authors.${authorIndex}.email`, researcher.email);
//       form.setValue(
//         `authors.${authorIndex}.affiliation`,
//         researcher.affiliation
//       );
//       form.setValue(`authors.${authorIndex}.orcid`, researcher.orcid);
//       form.setValue(`authors.${authorIndex}.researcherId`, researcher.id);
//     },
//     [form]
//   );

//   // Optimized venue change handler
//   const handleVenueChange = React.useCallback(
//     (value: string) => {
//       switch (selectedType) {
//         case "journal_article":
//           form.setValue("metadata.journal", value, {
//             shouldDirty: true,
//             shouldValidate: true,
//           });
//           break;
//         case "conference_paper":
//           form.setValue("metadata.conferenceName", value, {
//             shouldDirty: true,
//             shouldValidate: true,
//           });
//           break;
//         case "book_chapter":
//           form.setValue("metadata.bookTitle", value, {
//             shouldDirty: true,
//             shouldValidate: true,
//           });
//           break;
//       }
//     },
//     [selectedType, form]
//   );

//   // Render type-specific fields
//   const renderTypeSpecificFields = React.useMemo(() => {
//     switch (selectedType) {
//       case "journal_article":
//         return <JournalFields control={form.control} />;
//       case "conference_paper":
//         return <ConferenceFields control={form.control} />;
//       case "book_chapter":
//         return <BookChapterFields control={form.control} />;
//       case "report":
//         return <ReportFields control={form.control} />;
//       default:
//         return null;
//     }
//   }, [selectedType, form.control]);

//   const onSubmit = React.useCallback(
//     (data: CreatePublicationPayload) => {
//       if (Object.keys(form.formState.errors).length > 0) {
//         toast.error("Validation Error", {
//           description: "Please check the form for errors.",
//         });
//         return;
//       }

//       startTransition(async () => {
//         try {
//           console.log({ data });
//           // toast("You submitted the following values", {
//           //   description: (
//           //     <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
//           //       <code className="text-white">
//           //         {JSON.stringify(processedData, null, 2)}
//           //       </code>
//           //     </pre>
//           //   ),
//           // });

//           const result = await createPublication(data);

//           if (!result.success) {
//             toast.error("Error", {
//               description: result.error || "Failed to create publication",
//             });
//             return;
//           }

//           toast.success("Success", {
//             description: "Publication created successfully!",
//           });

//           // Reset form
//           form.reset();
//           setIsOpen?.(false);
//         } catch (error) {
//           console.error("Failed to create publication:", error);
//           toast.error("Error", {
//             description: "Something went wrong. Please try again.",
//           });
//         }
//       });
//     },
//     [form, setIsOpen]
//   );

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className={cn("space-y-4", className)}
//         {...props}
//       >
//         {/* Publication Type and Title */}
//         <div className="grid xs:grid-cols-2 sm:grid-cols-4 gap-4">
//           <FormField
//             control={form.control}
//             name="type"
//             render={({ field, fieldState }) => (
//               <FormItem className="sm:col-span-1">
//                 <ErrorTitle fieldState={fieldState} title="Publication Type" />
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger className="w-full">
//                       <SelectValue placeholder="Select publication type" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {publicationTypes.map((type) => (
//                       <SelectItem key={type.value} value={type.value}>
//                         {type.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field, fieldState }) => (
//               <FormItem className="sm:col-span-3">
//                 <ErrorTitle fieldState={fieldState} title="Title" />
//                 <FormControl>
//                   <Input
//                     placeholder="e.g., A Novel Approach to Machine Learning"
//                     {...field}
//                   />
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//         </div>
//         {/* Abstract */}
//         <FormField
//           control={form.control}
//           name="abstract"
//           render={({ field, fieldState }) => (
//             <FormItem>
//               <ErrorTitle fieldState={fieldState} title="Abstract" />
//               <FormControl>
//                 <Textarea
//                   placeholder="Abstract or summary of the publication"
//                   className="min-h-24"
//                   {...field}
//                   value={field.value ?? ""}
//                 />
//               </FormControl>
//               <FormDescription>
//                 A brief summary of the publication content.
//               </FormDescription>
//             </FormItem>
//           )}
//         />
//         {/* Venue and Publication Date */}
//         <div className="grid xs:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="venue"
//             render={({ field, fieldState }) => (
//               <FormItem>
//                 <ErrorTitle
//                   fieldState={fieldState}
//                   title={
//                     selectedType === "journal_article"
//                       ? "Journal Name"
//                       : selectedType === "conference_paper"
//                       ? "Conference Name"
//                       : "Venue"
//                   }
//                 />
//                 <FormControl>
//                   <Input
//                     placeholder={
//                       selectedType === "journal_article"
//                         ? "e.g., Nature Medicine"
//                         : selectedType === "conference_paper"
//                         ? "e.g., International Conference on Health Research"
//                         : "Publication venue"
//                     }
//                     {...field}
//                     value={field.value ?? ""}
//                     onChange={(e) => {
//                       field.onChange(e);
//                       handleVenueChange(e.target.value);
//                     }}
//                   />
//                 </FormControl>
//                 <FormDescription>
//                   {selectedType === "journal_article" &&
//                     "The journal where this article was published."}
//                   {selectedType === "conference_paper" &&
//                     "The conference where this paper was presented."}
//                   {!["journal_article", "conference_paper"].includes(
//                     selectedType
//                   ) && "Where this publication was released."}
//                 </FormDescription>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="publicationDate"
//             render={({ field, fieldState }) => (
//               <FormItem>
//                 <ErrorTitle fieldState={fieldState} title="Publication Date" />
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <FormControl>
//                       <Button
//                         variant={"outline"}
//                         className={cn(
//                           "px-3 text-left font-normal",
//                           !field.value && "text-muted-foreground"
//                         )}
//                       >
//                         {field.value ? (
//                           format(field.value, "PPP")
//                         ) : (
//                           <span>Pick a date</span>
//                         )}
//                         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                       </Button>
//                     </FormControl>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="center">
//                     <Calendar
//                       // classNames={{ root: "w-full" }}
//                       mode="single"
//                       selected={field.value ?? undefined}
//                       onSelect={field.onChange}
//                       disabled={(date) =>
//                         date > new Date() || date < new Date("1900-01-01")
//                       }
//                       captionLayout="dropdown"
//                     />
//                   </PopoverContent>
//                 </Popover>
//                 <FormDescription>
//                   When this publication was released.
//                 </FormDescription>
//               </FormItem>
//             )}
//           />
//         </div>
//         {/* Link and DOI */}
//         <div className="grid xs:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="link"
//             render={({ field, fieldState }) => (
//               <FormItem>
//                 <ErrorTitle fieldState={fieldState} title="Link URL" />
//                 <FormControl>
//                   <Input
//                     placeholder="https://example.com/publication"
//                     type="url"
//                     {...field}
//                     value={field.value ?? ""}
//                   />
//                 </FormControl>
//                 <FormDescription>
//                   External link to the publication.
//                 </FormDescription>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="doi"
//             render={({ field, fieldState }) => (
//               <FormItem>
//                 <ErrorTitle fieldState={fieldState} title="DOI" />
//                 <FormControl>
//                   <Input
//                     placeholder="e.g., 10.1000/182"
//                     {...field}
//                     value={field.value ?? ""}
//                   />
//                 </FormControl>
//                 <FormDescription>
//                   Digital Object Identifier (if available).
//                 </FormDescription>
//               </FormItem>
//             )}
//           />
//         </div>

//         {/* Type-specific metadata fields */}
//         {renderTypeSpecificFields}

//         {/* Authors Section */}
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-medium">Authors</h3>
//             <Button
//               type="button"
//               variant="outline"
//               size="sm"
//               onClick={addAuthor}
//             >
//               <Plus className="size-4" />
//               Add Author
//             </Button>
//           </div>

//           <div className="space-y-4">
//             {authorFields.map((field, index) => (
//               <AuthorFields
//                 key={field.id}
//                 // field={field}
//                 index={index}
//                 remove={() => removeAuthorField(index)}
//                 control={form.control}
//                 researcher={researcher}
//                 onSelectExistingAuthor={(index, author) => {
//                   if (author.type === "researcher") {
//                     linkToResearcher(index, author.data);
//                   } else {
//                     form.setValue(`authors.${index}.id`, author.data.id);
//                     form.setValue(`authors.${index}.name`, author.data.name);
//                     form.setValue(
//                       `authors.${index}.email`,
//                       author.data.email || ""
//                     );
//                     form.setValue(
//                       `authors.${index}.affiliation`,
//                       author.data.affiliation || ""
//                     );
//                     form.setValue(
//                       `authors.${index}.orcid`,
//                       author.data.orcid || ""
//                     );
//                     form.setValue(`authors.${index}.researcherId`, null);
//                   }
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//         <Button
//           type="submit"
//           variant={"brand"}
//           className="w-full"
//           isPending={isPending}
//         >
//           {isPending ? "Creating..." : "Create Publication"}
//         </Button>
//       </form>
//     </Form>
//   );
// }

// export { CreatePublication };

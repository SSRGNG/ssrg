// // hooks/use-author.ts
// "use client";

// import { authorService, type AuthorSearchResult } from "@/lib/services/author";
// import type { CreateAuthorPayload } from "@/lib/validations/author";
// import { useCallback, useState } from "react";
// import { toast } from "sonner";

// export type AuthorFormData = {
//   id?: string;
//   name: string;
//   email?: string | null;
//   affiliation?: string | null;
//   orcid?: string | null;
//   researcherId?: string | null;
//   order: number;
//   contribution?: string | null;
//   isCorresponding?: boolean;
//   selectedAuthor?: AuthorSearchResult | null;
//   isManualEntry?: boolean;
// };

// export type UseAuthorManagementReturn = {
//   // State
//   authors: AuthorFormData[];
//   searchResults: AuthorSearchResult[];
//   isSearching: boolean;
//   isCreatingAuthor: boolean;

//   // Author array operations
//   addAuthor: () => void;
//   removeAuthor: (index: number) => void;
//   updateAuthor: (index: number, data: Partial<AuthorFormData>) => void;
//   setAuthors: (authors: AuthorFormData[]) => void;

//   // Search operations
//   searchAuthors: (query: string) => Promise<void>;
//   clearSearch: () => void;

//   // Author creation
//   createAuthor: (
//     data: CreateAuthorPayload
//   ) => Promise<AuthorSearchResult | null>;

//   // Author selection
//   selectAuthor: (index: number, author: AuthorSearchResult) => void;
//   toggleManualEntry: (index: number) => void;

//   // Validation
//   validateAuthors: () => { isValid: boolean; errors: string[] };

//   // Utilities
//   getProcessedAuthors: () => Array<{
//     id?: string;
//     name: string;
//     email?: string | null;
//     affiliation?: string | null;
//     orcid?: string | null;
//     researcherId?: string | null;
//     order: number;
//     contribution?: string | null;
//     isCorresponding?: boolean;
//   }>;
// };

// export function useAuthorManagement(
//   initialAuthors: AuthorFormData[] = [],
//   currentResearcher?: any
// ): UseAuthorManagementReturn {
//   const [authors, setAuthorsState] = useState<AuthorFormData[]>(() => {
//     if (initialAuthors.length > 0) {
//       return initialAuthors;
//     }

//     // Initialize with current researcher if available
//     const initialAuthor: AuthorFormData = {
//       name: currentResearcher?.name || "",
//       email: currentResearcher?.email || "",
//       affiliation: currentResearcher?.affiliation || "",
//       orcid: currentResearcher?.orcid || "",
//       researcherId: currentResearcher?.id || null,
//       order: 0,
//       contribution: "",
//       isCorresponding: true,
//       isManualEntry: !currentResearcher,
//     };

//     return [initialAuthor];
//   });

//   const [searchResults, setSearchResults] = useState<AuthorSearchResult[]>([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [isCreatingAuthor, setIsCreatingAuthor] = useState(false);

//   // Memoized search function with debouncing
//   const searchAuthors = useCallback(async (query: string) => {
//     if (!query.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     setIsSearching(true);
//     try {
//       const result = await authorService.searchAuthors(query, 20);
//       if (result.success && result.results) {
//         setSearchResults(result.results);
//       } else {
//         console.error("Search failed:", result.error);
//         setSearchResults([]);
//       }
//     } catch (error) {
//       console.error("Search error:", error);
//       setSearchResults([]);
//     } finally {
//       setIsSearching(false);
//     }
//   }, []);

//   const clearSearch = useCallback(() => {
//     setSearchResults([]);
//   }, []);

//   // Author array operations
//   const addAuthor = useCallback(() => {
//     const newOrder = authors.length;
//     const newAuthor: AuthorFormData = {
//       name: "",
//       email: "",
//       affiliation: "",
//       orcid: "",
//       researcherId: null,
//       order: newOrder,
//       contribution: "",
//       isCorresponding: false,
//       isManualEntry: true,
//     };

//     setAuthorsState((prev) => [...prev, newAuthor]);
//   }, [authors.length]);

//   const removeAuthor = useCallback((index: number) => {
//     setAuthorsState((prev) => {
//       const newAuthors = prev.filter((_, i) => i !== index);

//       // Reorder remaining authors
//       const reorderedAuthors = newAuthors.map((author, i) => ({
//         ...author,
//         order: i,
//       }));

//       // Ensure at least one corresponding author exists
//       const hasCorresponding = reorderedAuthors.some((a) => a.isCorresponding);
//       if (!hasCorresponding && reorderedAuthors.length > 0) {
//         reorderedAuthors[0].isCorresponding = true;
//       }

//       return reorderedAuthors;
//     });
//   }, []);

//   const updateAuthor = useCallback(
//     (index: number, data: Partial<AuthorFormData>) => {
//       setAuthorsState((prev) =>
//         prev.map((author, i) => (i === index ? { ...author, ...data } : author))
//       );
//     },
//     []
//   );

//   const setAuthors = useCallback((newAuthors: AuthorFormData[]) => {
//     setAuthorsState(newAuthors);
//   }, []);

//   // Author creation
//   const createAuthor = useCallback(
//     async (data: CreateAuthorPayload): Promise<AuthorSearchResult | null> => {
//       setIsCreatingAuthor(true);
//       try {
//         const result = await authorService.createAuthor(data);

//         if (result.success && result.author) {
//           toast.success("Author created successfully");
//           // Clear search results to refresh
//           setSearchResults([]);
//           return result.author;
//         } else {
//           toast.error(result.error || "Failed to create author");
//           return null;
//         }
//       } catch (error) {
//         console.error("Error creating author:", error);
//         toast.error("Failed to create author");
//         return null;
//       } finally {
//         setIsCreatingAuthor(false);
//       }
//     },
//     []
//   );

//   // Author selection
//   const selectAuthor = useCallback(
//     (index: number, author: AuthorSearchResult) => {
//       updateAuthor(index, {
//         id: author.data.id,
//         name: author.data.name,
//         email: author.data.email,
//         affiliation: author.data.affiliation,
//         orcid: author.data.orcid,
//         researcherId:
//           author.type === "researcher"
//             ? author.data.id
//             : author.data.researcherId,
//         selectedAuthor: author,
//         isManualEntry: false,
//       });
//     },
//     [updateAuthor]
//   );

//   const toggleManualEntry = useCallback((index: number) => {
//     setAuthorsState((prev) =>
//       prev.map((author, i) => {
//         if (i === index) {
//           const isManualEntry = !author.isManualEntry;

//           if (isManualEntry) {
//             // Clear selected author data when switching to manual
//             return {
//               ...author,
//               id: undefined,
//               name: "",
//               email: "",
//               affiliation: "",
//               orcid: "",
//               researcherId: null,
//               selectedAuthor: null,
//               isManualEntry: true,
//             };
//           } else {
//             return {
//               ...author,
//               isManualEntry: false,
//             };
//           }
//         }
//         return author;
//       })
//     );
//   }, []);

//   // Validation
//   const validateAuthors = useCallback((): {
//     isValid: boolean;
//     errors: string[];
//   } => {
//     const errors: string[] = [];

//     if (authors.length === 0) {
//       errors.push("At least one author is required");
//     }

//     authors.forEach((author, index) => {
//       if (!author.name.trim()) {
//         errors.push(`Author ${index + 1}: Name is required`);
//       }

//       if (author.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author.email)) {
//         errors.push(`Author ${index + 1}: Invalid email format`);
//       }

//       if (
//         author.orcid &&
//         !/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(author.orcid)
//       ) {
//         errors.push(`Author ${index + 1}: Invalid ORCID format`);
//       }
//     });

//     // Check for corresponding author
//     const correspondingAuthors = authors.filter((a) => a.isCorresponding);
//     if (authors.length > 1 && correspondingAuthors.length === 0) {
//       errors.push(
//         "At least one author must be marked as corresponding when multiple authors are present"
//       );
//     }

//     // Check for unique order values
//     const orders = authors.map((a) => a.order);
//     if (new Set(orders).size !== orders.length) {
//       errors.push("Author order values must be unique");
//     }

//     return {
//       isValid: errors.length === 0,
//       errors,
//     };
//   }, [authors]);

//   // Utility to get processed authors for form submission
//   const getProcessedAuthors = useCallback(() => {
//     return authors.map((author) => ({
//       id: author.id,
//       name: author.name,
//       email: author.email || null,
//       affiliation: author.affiliation || null,
//       orcid: author.orcid || null,
//       researcherId: author.researcherId || null,
//       order: author.order,
//       contribution: author.contribution || null,
//       isCorresponding: author.isCorresponding || false,
//     }));
//   }, [authors]);

//   return {
//     // State
//     authors,
//     searchResults,
//     isSearching,
//     isCreatingAuthor,

//     // Author array operations
//     addAuthor,
//     removeAuthor,
//     updateAuthor,
//     setAuthors,

//     // Search operations
//     searchAuthors,
//     clearSearch,

//     // Author creation
//     createAuthor,

//     // Author selection
//     selectAuthor,
//     toggleManualEntry,

//     // Validation
//     validateAuthors,

//     // Utilities
//     getProcessedAuthors,
//   };
// }

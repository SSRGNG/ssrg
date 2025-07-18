// import { ExternalLink, Eye, Layers, Play, Tag, Users } from "lucide-react";
// import * as React from "react";

// import { Badge } from "@/components/ui/badge";
// import { videoCats } from "@/config/enums";
// import { Videos } from "@/lib/actions/queries";
// import { cn } from "@/lib/utils";
// import { ViewMode } from "@/types";

// type VideoType = Videos[number];
// type Props = React.ComponentPropsWithoutRef<"article"> & {
//   video: VideoType;
//   viewMode: ViewMode;
// };

// const formatViewCount = (count?: number) => {
//   if (!count) return "0 views";
//   if (count < 1000) return `${count} views`;
//   if (count < 1000000) return `${(count / 1000).toFixed(1)}K views`;
//   return `${(count / 1000000).toFixed(1)}M views`;
// };

// const formatInTextCitation = (authors: VideoType["authors"]) => {
//   if (authors.length === 0) return "";
//   if (authors.length === 1) return authors[0].name;
//   if (authors.length === 2) return `${authors[0].name} & ${authors[1].name}`;
//   return `${authors[0].name} et al.`;
// };

// const CategoryBadge = React.memo(
//   ({ category }: { category: NonNullable<VideoType["category"]> }) => (
//     <Badge variant={"brand"} className="uppercase tracking-wide">
//       <Tag className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
//       {videoCats.getLabel(category)}
//     </Badge>
//   )
// );
// CategoryBadge.displayName = "CategoryBadge";

// const ViewCount = React.memo(({ count }: { count: number }) => (
//   <div
//     className="flex items-center gap-1 text-sm text-muted-foreground"
//     title={`${formatViewCount(count)}`}
//   >
//     <Eye className="size-4" strokeWidth={1.5} aria-hidden="true" />
//     <span className="sr-only">Views: </span>
//     {formatViewCount(count)}
//   </div>
// ));
// ViewCount.displayName = "ViewCount";

// const AuthorList = React.memo(
//   ({
//     authors,
//     compact = false,
//   }: {
//     authors: VideoType["authors"];
//     compact?: boolean;
//   }) => (
//     <div className="flex items-start gap-1.5 text-sm">
//       <Users
//         className="size-4 mt-0.5 text-muted-foreground flex-shrink-0"
//         strokeWidth={1.5}
//         aria-hidden="true"
//       />
//       <div className={compact ? "truncate" : ""}>
//         <span className="sr-only">Contributors: </span>
//         {compact ? (
//           <span className="text-muted-foreground">
//             {formatInTextCitation(authors)}
//           </span>
//         ) : (
//           authors.map((author, index) => (
//             <span key={`${author.name}-${index}`}>
//               <span className="font-medium text-muted-foreground">
//                 {author.name}
//               </span>
//               {author.role && (
//                 <span className="text-muted-foreground/70 text-xs ml-1">
//                   ({author.role})
//                 </span>
//               )}
//               {author.affiliation && (
//                 <span className="text-muted-foreground/70 text-xs ml-1">
//                   - {author.affiliation}
//                 </span>
//               )}
//               {index < authors.length - 1 && (
//                 <span className="text-muted-foreground">, </span>
//               )}
//             </span>
//           ))
//         )}
//       </div>
//     </div>
//   )
// );
// AuthorList.displayName = "AuthorList";

// const ExternalLinks = React.memo(
//   ({ video, compact = false }: { video: VideoType; compact?: boolean }) => {
//     const links = [];

//     // Always show YouTube link
//     links.push(
//       <a
//         key="youtube"
//         href={video.youtubeUrl}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="inline-flex items-center gap-1 text-brand hover:text-brand/80 transition-colors"
//         aria-label="Watch on YouTube"
//       >
//         Watch on YouTube{" "}
//         <ExternalLink className="size-3" strokeWidth={1.5} aria-hidden="true" />
//       </a>
//     );

//     return (
//       <div
//         className={cn(
//           "flex items-center gap-4 text-xs font-medium",
//           compact ? "flex-wrap" : ""
//         )}
//       >
//         {links}
//       </div>
//     );
//   }
// );
// ExternalLinks.displayName = "ExternalLinks";

// const VideoThumbnail = React.memo(
//   ({ video, isCompact }: { video: VideoType; isCompact: boolean }) => {
//     return (
//       <div
//         className={cn(
//           "relative bg-gray-100 rounded-lg overflow-hidden group-hover:shadow-md transition-shadow",
//           isCompact ? "aspect-video w-full" : "aspect-video w-full max-w-xs"
//         )}
//       >
//         {video.metadata?.thumbnailUrl ? (
//           <img
//             src={video.metadata.thumbnailUrl}
//             alt={video.title}
//             className="w-full h-full object-cover"
//             loading="lazy"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-muted">
//             <Play className="size-8 text-muted-foreground" />
//           </div>
//         )}

//         {/* Play overlay */}
//         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
//           <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//             <div className="bg-muted backdrop-blur-sm rounded-full p-2">
//               <Play className="size-6 text-red-600 fill-current" />
//             </div>
//           </div>
//         </div>

//         {/* Featured badge */}
//         {video.isFeatured && (
//           <div className="absolute top-2 left-2">
//             <Badge className="bg-yellow-500 text-white border-yellow-600">
//               Featured
//             </Badge>
//           </div>
//         )}
//       </div>
//     );
//   }
// );
// VideoThumbnail.displayName = "VideoThumbnail";

// function VideoCard({ video, viewMode, className, ...props }: Props) {
//   const isCompact = viewMode === "compact";
//   const viewCount = video.metadata?.viewCount ?? 0;

//   return (
//     <article
//       className={cn(
//         "group bg-card text-card-foreground rounded-xl border p-4 sm:p-6 shadow-sm",
//         "hover:border-border/80 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 space-y-2.5",
//         "cursor-pointer transition-all duration-200",
//         className
//       )}
//       // onClick={() => window.open(video.youtubeUrl, "_blank")}
//       {...props}
//     >
//       {isCompact ? (
//         /* Compact Layout */
//         <React.Fragment>
//           {/* Header with category and date */}
//           <header className="flex items-center justify-between gap-2">
//             <div className="flex items-center gap-2 min-w-0 flex-1">
//               {video.category && <CategoryBadge category={video.category} />}
//               <span className="text-muted-foreground/50" aria-hidden="true">
//                 •
//               </span>
//               <time
//                 className="text-sm text-muted-foreground whitespace-nowrap"
//                 dateTime={String(video.publishedAt)}
//               >
//                 {/* {formatPublicationDate(
//                   video.publishedAt.toISOString().split("T")[0]
//                 )} */}
//                 {new Date(video.publishedAt).toLocaleDateString()}
//               </time>
//             </div>
//             <ViewCount count={viewCount} />
//           </header>

//           {/* Main content */}
//           <div className="space-y-2.5">
//             <h3 className="text-base md:text-lg font-medium line-clamp-2">
//               {video.title}
//             </h3>

//             {video.series && (
//               <p className="text-sm text-muted-foreground/70 font-medium truncate">
//                 <Layers className="inline size-3 mr-1" />
//                 {video.series}
//               </p>
//             )}
//           </div>

//           {/* Authors */}
//           <AuthorList authors={video.authors} compact={isCompact} />

//           {/* Footer with links */}
//           <footer className="flex items-center justify-between gap-4 pt-1">
//             <ExternalLinks video={video} compact={isCompact} />
//           </footer>
//         </React.Fragment>
//       ) : (
//         /* Detailed Layout */
//         <React.Fragment>
//           {/* Header with category and date */}
//           <header className="flex items-center justify-between gap-2">
//             <div className="flex items-center gap-2 min-w-0 flex-1">
//               {video.category && <CategoryBadge category={video.category} />}
//               <span className="text-muted-foreground/50" aria-hidden="true">
//                 •
//               </span>
//               <time
//                 className="text-sm text-muted-foreground whitespace-nowrap"
//                 dateTime={String(video.publishedAt)}
//               >
//                 {/* {formatPublicationDate(
//                   video.publishedAt.toISOString().split("T")[0]
//                 )} */}
//                 {new Date(video.publishedAt).toLocaleDateString()}
//               </time>
//             </div>
//             <ViewCount count={viewCount} />
//           </header>

//           {/* Video content with thumbnail */}
//           <div className="flex gap-4">
//             <VideoThumbnail video={video} isCompact={isCompact} />

//             <div className="flex-1 space-y-2.5 min-w-0">
//               <h3 className="text-base md:text-lg font-medium line-clamp-2">
//                 {video.title}
//               </h3>

//               {video.series && (
//                 <p className="text-sm text-muted-foreground/70 font-medium line-clamp-1">
//                   <Layers className="inline size-3 mr-1" />
//                   {video.series}
//                 </p>
//               )}

//               {video.description && (
//                 <p className="text-sm text-muted-foreground line-clamp-3">
//                   {video.description}
//                 </p>
//               )}

//               {/* Authors */}
//               <AuthorList authors={video.authors} compact={false} />

//               {/* Footer with links */}
//               <footer className="pt-1">
//                 <ExternalLinks video={video} compact={false} />
//               </footer>
//             </div>
//           </div>
//         </React.Fragment>
//       )}
//     </article>
//   );
// }

// export { VideoCard };

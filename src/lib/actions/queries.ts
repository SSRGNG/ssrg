"use server";

import { searchAuthors, searchPublications } from "@/lib/actions/search";
import {
  getAllUsersWithStats,
  getMonthlyActivity,
  getProjects,
  getPublicationTypeDistribution,
  getRecentActivity,
  getResearchAreas,
  getResearchers,
  getResearchFrameworks,
  getResearchMethodologies,
  getVideoCategoryDistribution,
} from "@/lib/queries/admin";
import { getResearchImages } from "@/lib/queries/files";
import {
  authResearcher,
  getCurrentUserResearcher,
  getNonResearchers,
  getPublications,
  getResearcherPublications,
  researcherPublications,
} from "@/lib/queries/portal";
import {
  getAllPublications,
  getLatestPublications,
} from "@/lib/queries/publications";
import {
  getAllProjectTeams,
  getTeamCollaborationInsights,
} from "@/lib/queries/teams";
import { getUserVideos, getVideos } from "@/lib/queries/videos";

export type ResearchImages = Awaited<ReturnType<typeof getResearchImages>>;

export type AdminAreasData = Awaited<ReturnType<typeof getResearchAreas>>;
export type AdminFrameworksData = Awaited<
  ReturnType<typeof getResearchFrameworks>
>;
export type AdminMethodologiesData = Awaited<
  ReturnType<typeof getResearchMethodologies>
>;
export type AdminPubTypes = Awaited<
  ReturnType<typeof getPublicationTypeDistribution>
>;
export type AdminVideosTypes = Awaited<
  ReturnType<typeof getVideoCategoryDistribution>
>;
export type AdminRecent = Awaited<ReturnType<typeof getRecentActivity>>;
export type AdminMonthlies = Awaited<ReturnType<typeof getMonthlyActivity>>;
export type AdminUsers = Awaited<ReturnType<typeof getAllUsersWithStats>>;
export type AdminTeams = Awaited<ReturnType<typeof getAllProjectTeams>>;
export type AdminTeamCollaborators = Awaited<
  ReturnType<typeof getTeamCollaborationInsights>
>;

export type AdminProjectsData = Awaited<ReturnType<typeof getProjects>>;
export type PortalPublications = Awaited<ReturnType<typeof getPublications>>;
export type Publications = Awaited<ReturnType<typeof getAllPublications>>;
export type LatestPublications = Awaited<
  ReturnType<typeof getLatestPublications>
>;

export type PortalVideosWithPagination = Awaited<
  ReturnType<typeof getUserVideos>
>;
export type PortalVideos = PortalVideosWithPagination["videos"];

export type PortalResearcherPubs = Awaited<
  ReturnType<typeof getResearcherPublications>
>;
export type AuthResearcher = Awaited<ReturnType<typeof authResearcher>>;
export type CurrentResearcherRes = Awaited<
  ReturnType<typeof getCurrentUserResearcher>
>;
export type NonResearchers = Awaited<ReturnType<typeof getNonResearchers>>;
export type ResearchersWithRelations = Awaited<
  ReturnType<typeof getResearchers>
>;
export type ResearcherWithPublications = Awaited<
  ReturnType<typeof researcherPublications>
>;

type SearchAuthorsResult = Awaited<ReturnType<typeof searchAuthors>>;
type SearchPublicationsResult = Awaited<ReturnType<typeof searchPublications>>;

type SearchAuthorsSuccess = Extract<SearchAuthorsResult, { success: true }>;
type SearchPublicationsSuccess = Extract<
  SearchPublicationsResult,
  { success: true }
>;

export type AuthorSearchResults = SearchAuthorsSuccess["results"];
export type PublicationSearchResults = SearchPublicationsSuccess["results"];

// Extract individual result item types
export type AuthorSearchResult = AuthorSearchResults[number];

// Extract specific result types using discriminated union
export type ResearcherResult = Extract<
  AuthorSearchResult,
  { type: "researcher" }
>;
export type AuthorResult = Extract<AuthorSearchResult, { type: "author" }>;

// Extract just the data types
export type ResearcherData = ResearcherResult["data"];
export type AuthorData = AuthorResult["data"];

export type VideosWithPagination = Awaited<ReturnType<typeof getVideos>>;
export type Videos = VideosWithPagination["videos"];

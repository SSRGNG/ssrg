// "use server";

// import {
//   getContributionByRelationship,
//   getExpensesByCategory,
//   getMonthlyOverview,
//   getTopContributors,
// } from "@/lib/queries/dash";
// import {
//   getContributions,
//   getContributors,
//   getExpenses,
// } from "@/lib/queries/transactions";
// import { catchError } from "@/lib/utils";

// export async function fetchContributorsAction() {
//   try {
//     return await getContributors();
//   } catch (error) {
//     catchError(error);
//     throw error;
//   }
// }

// export type ContributorsData = Awaited<ReturnType<typeof getContributors>>;
// export type ExpensesData = Awaited<ReturnType<typeof getExpenses>>;
// export type ContributionsData = Awaited<ReturnType<typeof getContributions>>;
// export type TopContributors = Awaited<ReturnType<typeof getTopContributors>>;
// export type MonthlyOverview = Awaited<ReturnType<typeof getMonthlyOverview>>;
// export type ExpensesByCategory = Awaited<
//   ReturnType<typeof getExpensesByCategory>
// >;
// export type ContributionByRelationship = Awaited<
//   ReturnType<typeof getContributionByRelationship>
// >;

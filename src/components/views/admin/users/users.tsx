// import { UsersDataTable } from "@/components/views/admin/ui-tables";
// import { SummaryCards } from "@/components/views/admin/users/summary-cards";
// // import { AdminUsers } from "@/lib/actions/queries";
// import { getAllUsersWithStats } from "@/lib/queries/admin";
// import { cn } from "@/lib/utils";

// // const users: AdminUsers = JSON.parse(`[
// //     {
// //         "id": "5f8747cc-bf4b-416b-9fe9-bd715155b0b8",
// //         "name": "Prince Chimezie Udeme",
// //         "email": "Princechmezie.udeme@gmail.com",
// //         "role": "admin",
// //         "affiliation": "University of Calgary",
// //         "createdAt": "2025-05-18T18:53:20.051Z",
// //         "image": null,
// //         "researcherId": "7d1d8a64-8763-4033-b35e-b7ae3c43c955",
// //         "bio": "P...",
// //         "publicationCount": "2",
// //         "videoCount": "0",
// //         "projectCount": "0"
// //     },
// //     {
// //         "id": "628cdb45-2960-47ac-9a71-e00a99a9162b",
// //         "name": "Richmond Dwight",
// //         "email": "rwight@gmail.com",
// //         "role": "admin",
// //         "affiliation": "Resydia inc",
// //         "createdAt": "2025-05-04T12:25:46.639Z",
// //         "image": null,
// //         "researcherId": "65eeb6e0-db6c-45ba-8f3d-d03f11b54137",
// //         "bio": "Some day I shall update you",
// //         "publicationCount": "0",
// //         "videoCount": "3",
// //         "projectCount": "1"
// //     },
// //     {
// //     "id": "9347e5e0-4fc3-4e4d-ae44-d8e50c1a9c11",
// //     "name": "Dr. Tayo Bello",
// //     "email": "tayo.bello@uniben.edu",
// //     "role": "researcher",
// //     "affiliation": "University of Benin",
// //     "createdAt": "2025-06-01T09:00:00.000Z",
// //     "image": null,
// //     "researcherId": "28f4ac30-4c9d-4d73-a911-f98c87e9173b",
// //     "bio": "Expert in environmental policy",
// //     "publicationCount": "4",
// //     "videoCount": "1",
// //     "projectCount": "2"
// //   },
// //   {
// //     "id": "bfa2f0ef-1f21-4c29-b7ef-020d6ec6fba3",
// //     "name": "Chika Ibe",
// //     "email": "chika.ibe@unn.edu.ng",
// //     "role": "researcher",
// //     "affiliation": "University of Nigeria",
// //     "createdAt": "2025-07-10T14:15:00.000Z",
// //     "image": null,
// //     "researcherId": "90de76c9-7901-47a6-8906-1d6c50c02d89",
// //     "bio": "Researcher in public health and informatics",
// //     "publicationCount": "3",
// //     "videoCount": "2",
// //     "projectCount": "1"
// //   },
// //   {
// //     "id": "b51df56a-64c6-4a53-9d86-57b055f46b97",
// //     "name": "Sarah Okoro",
// //     "email": "s.okoro@affiliates.org",
// //     "role": "affiliate",
// //     "affiliation": "Affiliates for Health Research",
// //     "createdAt": "2025-05-20T08:00:00.000Z",
// //     "image": null,
// //     "researcherId": "",
// //     "bio": "Collaborator and policy advocate",
// //     "publicationCount": "0",
// //     "videoCount": "0",
// //     "projectCount": "1"
// //   },
// //   {
// //     "id": "d729f09b-1f5f-4f9c-b235-dc3b967c2581",
// //     "name": "Kelechi Uzor",
// //     "email": "kelechi.uzor@researchnetwork.com",
// //     "role": "affiliate",
// //     "affiliation": "Africa Research Network",
// //     "createdAt": "2025-07-25T10:30:00.000Z",
// //     "image": null,
// //     "researcherId": "",
// //     "bio": "Interested in transdisciplinary partnerships",
// //     "publicationCount": "0",
// //     "videoCount": "0",
// //     "projectCount": "0"
// //   },
// //   {
// //     "id": "ef235a87-6b5f-49e4-839c-c6f08a48f08b",
// //     "name": "Bola Akinlade",
// //     "email": "bola.akinlade@partners.org",
// //     "role": "partner",
// //     "affiliation": "Social Impact Partners",
// //     "createdAt": "2025-06-15T12:45:00.000Z",
// //     "image": null,
// //     "researcherId": "",
// //     "bio": "Funder and development partner",
// //     "publicationCount": "0",
// //     "videoCount": "0",
// //     "projectCount": "2"
// //   },
// //   {
// //     "id": "53c68fbd-ec10-4aeb-978c-92a0a32caa60",
// //     "name": "Ngozi Anyanwu",
// //     "email": "ngozi@impacthub.com",
// //     "role": "partner",
// //     "affiliation": "Impact Hub Nigeria",
// //     "createdAt": "2025-05-30T16:20:00.000Z",
// //     "image": null,
// //     "researcherId": "",
// //     "bio": "Supports community-focused innovation",
// //     "publicationCount": "0",
// //     "videoCount": "0",
// //     "projectCount": "1"
// //   },
// //   {
// //     "id": "7dd826e0-61b6-4c56-a108-52f71c8462b1",
// //     "name": "Blessing Umeh",
// //     "email": "blessing.umeh@gmail.com",
// //     "role": "member",
// //     "affiliation": "Independent",
// //     "createdAt": "2025-06-22T18:00:00.000Z",
// //     "image": null,
// //     "researcherId": "",
// //     "bio": "Passionate about social justice",
// //     "publicationCount": "0",
// //     "videoCount": "0",
// //     "projectCount": "0"
// //   },
// //   {
// //     "id": "09d125ef-4eb2-4aa2-a46e-6a13867c790f",
// //     "name": "Ahmed Garba",
// //     "email": "ahmed.garba@network.org",
// //     "role": "member",
// //     "affiliation": "Research Network Nigeria",
// //     "createdAt": "2025-07-01T11:10:00.000Z",
// //     "image": null,
// //     "researcherId": "",
// //     "bio": "Community outreach coordinator",
// //     "publicationCount": "0",
// //     "videoCount": "0",
// //     "projectCount": "0"
// //   }
// // ]`);
// type Props = React.ComponentPropsWithoutRef<"div">;

// async function Users({ className, ...props }: Props) {
//   const users = await getAllUsersWithStats();

//   return (
//     <div className={cn("space-y-4", className)} {...props}>
//       <SummaryCards users={users} />
//       <UsersDataTable users={users} />
//     </div>
//   );
// }

// export { Users };

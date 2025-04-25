// "use client";

// import { GitBranchPlus } from "lucide-react";
// import * as React from "react";

// import { ContributionForm } from "@/components/forms/contribution-form";
// import { ContributorForm } from "@/components/forms/contributor-form";
// import { ExpenseForm } from "@/components/forms/expense-form";
// import { SignupForm } from "@/components/forms/signup-form";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { cn } from "@/lib/utils";

// type Props = {
//   type: string;
//   label: string;
//   isMobile: boolean;
// };
// const CreateAction = ({ type, label, isMobile }: Props) => {
//   const [open, setOpen] = React.useState(false);

//   // Get form component based on action type
//   const getFormComponent = () => {
//     switch (type) {
//       case "Transactions":
//         return ExpenseForm;
//       case "Contributions":
//         return ContributionForm;
//       case "Contributors":
//         return ContributorForm;
//       case "Users":
//         return SignupForm;
//       default:
//         return null;
//     }
//   };

//   const FormComponent = getFormComponent();
//   if (!FormComponent) return null;

//   return isMobile ? (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>
//         <Button
//           size={"sm"}
//           variant={"ghost"}
//           className={cn("w-full justify-start")}
//         >
//           <GitBranchPlus className="text-muted-foreground" />
//           {label}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader className="text-left">
//           <DrawerTitle>{label}</DrawerTitle>
//         </DrawerHeader>
//         <FormComponent className="px-4" setOpen={setOpen} />
//         <DrawerFooter className="pt-2">
//           <DrawerClose asChild>
//             <Button variant="outline">Cancel</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   ) : (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           size={"sm"}
//           variant={"ghost"}
//           className={cn("w-full justify-start")}
//         >
//           <GitBranchPlus className="text-muted-foreground" />
//           {label}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>{label}</DialogTitle>
//         </DialogHeader>
//         <FormComponent setOpen={setOpen} />
//       </DialogContent>
//     </Dialog>
//   );
// };

// export { CreateAction };

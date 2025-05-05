"use client";

import { AdminActions } from "@/components/layout/sidebar/admin-actions";
import { Icons } from "@/components/shared/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ActionItem, ActionKey } from "@/types";
import { MoreHorizontal } from "lucide-react";

type Props = React.ComponentProps<typeof SidebarGroup> & {
  actions: ActionItem;
};

function Actions({ actions, className, ...props }: Props) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup
      className={cn("group-data-[collapsible=icon]:hidden", className)}
      {...props}
    >
      <SidebarGroupLabel>{actions.title}</SidebarGroupLabel>
      <SidebarMenu>
        {actions.items.map((item) => {
          const Icon = Icons[item.icon];
          // Get the option keys for this item
          const optionKeys = item.options
            ? (Object.keys(item.options) as ActionKey[])
            : [];

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size={"sm"}>
                <a href={item.href}>
                  {item.icon && <Icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {optionKeys.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    {optionKeys.map((key) => (
                      <DropdownMenuItem asChild key={key}>
                        <AdminActions
                          type={item.title}
                          actionKey={key}
                          label={item.options[key] || key}
                          isMobile={isMobile}
                        />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

// function Actions({ actions, className, ...props }: Props) {
//   const { isMobile } = useSidebar();

//   return (
//     <SidebarGroup
//       className={cn("group-data-[collapsible=icon]:hidden", className)}
//       {...props}
//     >
//       <SidebarGroupLabel>{actions.title}</SidebarGroupLabel>
//       <SidebarMenu>
//         {actions.items.map((item) => {
//           const Icon = Icons[item.icon];

//           return (
//             <SidebarMenuItem key={item.title}>
//               <SidebarMenuButton asChild size="sm">
//                 <a href={item.href}>
//                   {item.icon && <Icon />}
//                   <span>{item.title}</span>
//                 </a>
//               </SidebarMenuButton>

//               {item.options && (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <SidebarMenuAction showOnHover>
//                       <MoreHorizontal />
//                       <span className="sr-only">More</span>
//                     </SidebarMenuAction>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent
//                     className="w-64"
//                     side={isMobile ? "bottom" : "right"}
//                     align={isMobile ? "end" : "start"}
//                   >
//                     {Object.entries(item.options).map(([key, label]) => (
//                       <DropdownMenuItem asChild key={key}>
//                         <AdminActionDialog
//                           type={key} // This should match the `switch` in your CreateAction component
//                           label={label}
//                           isMobile={isMobile}
//                         />
//                       </DropdownMenuItem>
//                     ))}
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               )}
//             </SidebarMenuItem>
//           );
//         })}
//       </SidebarMenu>
//     </SidebarGroup>
//   );
// }

export { Actions };

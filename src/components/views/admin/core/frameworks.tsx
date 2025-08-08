import { TabsContent } from "@/components/ui/tabs";
import { RFrameworksDataTable } from "@/components/views/admin/ui-tables";
import { AdminFrameworksData } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent> & {
  frameworks: AdminFrameworksData;
};

function ResearchFrameworks({ frameworks, className, ...props }: Props) {
  return (
    <TabsContent className={cn(className)} {...props}>
      <RFrameworksDataTable frameworks={frameworks} />
    </TabsContent>
  );
}

export { ResearchFrameworks };

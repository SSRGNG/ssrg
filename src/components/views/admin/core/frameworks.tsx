import { TabsContent } from "@/components/ui/tabs";
import { RFrameworksDataTable } from "@/components/views/admin/ui-tables";
import { getCachedResearchFrameworks } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent>;

async function ResearchFrameworks({ className, ...props }: Props) {
  const frameworks = await getCachedResearchFrameworks();
  return (
    <TabsContent className={cn(className)} {...props}>
      <RFrameworksDataTable frameworks={frameworks} />
    </TabsContent>
  );
}

export { ResearchFrameworks };

import { TabsContent } from "@/components/ui/tabs";
import { RFrameworksDataTable } from "@/components/views/admin/core/ui-tables";
import { getCachedResearchFrameworks } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent>;

async function ResearchFrameworks({ className, ...props }: Props) {
  const frameworks = await getCachedResearchFrameworks();
  // console.log(JSON.stringify(frameworks, null, 2));
  return (
    <TabsContent className={cn(className)} {...props}>
      <RFrameworksDataTable frameworks={frameworks} />
    </TabsContent>
  );
}

export { ResearchFrameworks };

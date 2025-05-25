import { TabsContent } from "@/components/ui/tabs";
import { RMethodologiesDataTable } from "@/components/views/admin/core/ui-tables";
import { getCachedResearchMethodologies } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent>;

async function ResearchMethodologies({ className, ...props }: Props) {
  const methodologies = await getCachedResearchMethodologies();
  // console.log(JSON.stringify(methodologies, null, 2));
  return (
    <TabsContent className={cn(className)} {...props}>
      <RMethodologiesDataTable methodologies={methodologies} />
    </TabsContent>
  );
}

export { ResearchMethodologies };

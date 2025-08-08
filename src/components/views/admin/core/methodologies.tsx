import { TabsContent } from "@/components/ui/tabs";
import { RMethodologiesDataTable } from "@/components/views/admin/ui-tables";
import { AdminMethodologiesData } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent> & {
  methodologies: AdminMethodologiesData;
};

function ResearchMethodologies({ methodologies, className, ...props }: Props) {
  return (
    <TabsContent className={cn(className)} {...props}>
      <RMethodologiesDataTable methodologies={methodologies} />
    </TabsContent>
  );
}

export { ResearchMethodologies };

import { TabsContent } from "@/components/ui/tabs";
import { RAreasDataTable } from "@/components/views/admin/ui-tables";
import { AdminAreasData } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent> & {
  areas: AdminAreasData;
};

function ResearchAreas({ areas, className, ...props }: Props) {
  // console.log({ areas });
  return (
    <TabsContent className={cn(className)} {...props}>
      <RAreasDataTable areas={areas} />
    </TabsContent>
  );
}

export { ResearchAreas };

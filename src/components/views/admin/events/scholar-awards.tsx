import { TabsContent } from "@/components/ui/tabs";
import { ScholarshipsDataTable } from "@/components/views/admin/ui-tables";
import { AllScholarships } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent> & {
  scholarships: AllScholarships;
};

function ScholarAwards({ scholarships, className, ...props }: Props) {
  return (
    <TabsContent className={cn(className)} {...props}>
      <ScholarshipsDataTable scholarships={scholarships} />
    </TabsContent>
  );
}

export { ScholarAwards };

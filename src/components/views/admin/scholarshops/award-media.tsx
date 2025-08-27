import { TabsContent } from "@/components/ui/tabs";
import { AwardMediaDataTable } from "@/components/views/admin/ui-tables";
import { AllAwardMedia } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";
import { T_Data } from "@/types";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent> & {
  media: AllAwardMedia;
  t_data?: T_Data;
};

function AwardMedia({ media, t_data, className, ...props }: Props) {
  return (
    <TabsContent className={cn(className)} {...props}>
      <AwardMediaDataTable media={media} t_data={t_data} />
    </TabsContent>
  );
}

export { AwardMedia };

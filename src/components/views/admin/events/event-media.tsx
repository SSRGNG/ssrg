import { TabsContent } from "@/components/ui/tabs";
import { EventMediaDataTable } from "@/components/views/admin/ui-tables";
import { AllEventMedia } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";
import { T_Data } from "@/types";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent> & {
  media: AllEventMedia;
  t_data?: T_Data;
};

function EventMedia({ media, t_data, className, ...props }: Props) {
  return (
    <TabsContent className={cn(className)} {...props}>
      <EventMediaDataTable media={media} t_data={t_data} />
    </TabsContent>
  );
}

export { EventMedia };

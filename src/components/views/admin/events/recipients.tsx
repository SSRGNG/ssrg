import { TabsContent } from "@/components/ui/tabs";
import { RecipientsDataTable } from "@/components/views/admin/ui-tables";
import { AllRecipients } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";
import { T_Data } from "@/types";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent> & {
  recipients: AllRecipients;
  t_data?: T_Data;
};

function Recipients({ recipients, t_data, className, ...props }: Props) {
  return (
    <TabsContent className={cn(className)} {...props}>
      <RecipientsDataTable recipients={recipients} t_data={t_data} />
    </TabsContent>
  );
}

export { Recipients };

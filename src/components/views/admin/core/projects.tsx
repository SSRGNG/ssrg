import { TabsContent } from "@/components/ui/tabs";
import { ProjectsDataTable } from "@/components/views/admin/ui-tables";
import { getCachedProjects } from "@/lib/queries/admin";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof TabsContent>;

async function Projects({ className, ...props }: Props) {
  const projects = await getCachedProjects();
  // console.log(JSON.stringify(projects, null, 2));
  return (
    <TabsContent className={cn(className)} {...props}>
      <ProjectsDataTable projects={projects} />
    </TabsContent>
  );
}

export { Projects };

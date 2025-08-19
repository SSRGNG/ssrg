import React from "react";

import { Section } from "@/components/shell/section";
import { termsOfUse } from "@/config/constants";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

async function Contents({ className, ...props }: Props) {
  return (
    <Section spacing={"snug"} className={cn(className)} {...props}>
      {termsOfUse.map((section) => (
        <div className="space-y-2.5" key={section.title}>
          <h3>{section.title}</h3>
          {section.content && (
            <ul className="space-y-1 pl-[1.125rem] list-disc">
              {section.content.map((item, i) => (
                <li className="text-xs text-muted-foreground" key={i}>
                  {item}
                </li>
              ))}
            </ul>
          )}
          {section.subsections?.map((sub) => (
            <div className="space-y-1.5 pl-[1.125rem]" key={sub.subtitle}>
              <h4>{sub.subtitle}</h4>
              <ul className="space-y-1 pl-[1.125rem] list-disc">
                {sub.content.map((item, i) => (
                  <li className="text-xs text-muted-foreground" key={i}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </Section>
  );
}

export { Contents };

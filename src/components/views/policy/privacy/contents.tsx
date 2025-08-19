import React from "react";

import { Section } from "@/components/shell/section";
import { privacyPolicy } from "@/config/constants";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

async function Contents({ className, ...props }: Props) {
  return (
    <Section spacing={"snug"} className={cn(className)} {...props}>
      {privacyPolicy.map((section) => (
        <div className="space-y-2.5" key={section.title}>
          <h3>{section.title}</h3>

          {/* Direct content */}
          {section.content && (
            <ul className="space-y-1 pl-[1.125rem] list-disc">
              {section.content.map((item, i) => (
                <li className="text-xs text-muted-foreground" key={i}>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Direct list */}
          {section.list && (
            <ul className="space-y-1 pl-[1.125rem] list-decimal">
              {section.list.map((item, i) => (
                <li className="text-xs text-muted-foreground" key={i}>
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Subsections */}
          {section.subsections?.map((sub) => (
            <div className="space-y-1.5 pl-[1.125rem]" key={sub.subtitle}>
              <h4>{sub.subtitle}</h4>

              {/* Subsection with direct content */}
              {"content" in sub && sub.content && (
                <ul className="space-y-1 pl-[1.125rem] list-disc">
                  {sub.content.map((item, i) => (
                    <li className="text-xs text-muted-foreground" key={i}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {/* Subsection with subsubsections */}
              {"subsubsections" in sub &&
                sub.subsubsections?.map((subsub) => (
                  <div
                    className="space-y-1.5 pl-[1.125rem]"
                    key={subsub.subtitle}
                  >
                    <h5>{subsub.subtitle}</h5>
                    <ul className="space-y-1 pl-[1.125rem] list-disc">
                      {subsub.content.map((item, i) => (
                        <li className="text-xs text-muted-foreground" key={i}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          ))}

          {/* Direct subsubsections */}
          {section.subsubsections?.map((subsub) => (
            <div className="space-y-1.5 pl-[1.125rem]" key={subsub.subtitle}>
              <h4>{subsub.subtitle}</h4>
              <ul className="space-y-1 pl-[1.125rem] list-disc">
                {subsub.content.map((item, i) => (
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

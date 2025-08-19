import React from "react";

import { Section } from "@/components/shell/section";
import { dataProtectionPolicy } from "@/config/constants";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

function Contents({ className, ...props }: Props) {
  return (
    <Section spacing="snug" className={cn(className)} {...props}>
      {dataProtectionPolicy.map((section) => (
        <React.Fragment key={section.title}>
          <h2 className="text-xl font-bold tracking-tight lg:text-2xl">
            {section.title}
          </h2>

          {/* Direct content paragraphs */}
          {section.content && (
            <div className="space-y-1.5">
              {section.content.map((paragraph, i) => (
                <p
                  className="text-sm text-muted-foreground leading-relaxed"
                  key={i}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Direct list items */}
          {section.list && (
            <ul className="space-y-1 pl-[1.125rem] list-disc">
              {section.list.map((item, i) => (
                <li
                  className="text-sm text-muted-foreground leading-relaxed"
                  key={i}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Subsections */}
          {section.subsections && (
            // <div className="space-y-3 pl-3">
            <React.Fragment>
              {dataProtectionPolicy.map((section) => (
                <div className="space-y-2.5" key={section.title}>
                  <h2 className="italic text-lg lg:text-xl font-semibold tracking-tight leading-snug text-foreground/90">
                    {section.title}
                  </h2>

                  {/* Direct content paragraphs */}
                  {section.content && (
                    <div className="space-y-1.5">
                      {section.content.map((paragraph, i) => (
                        <p
                          className="text-sm text-muted-foreground leading-relaxed"
                          key={i}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Direct list items */}
                  {section.list && (
                    <ul className="space-y-1 pl-[1.125rem] list-disc">
                      {section.list.map((item, i) => (
                        <li
                          className="text-sm text-muted-foreground leading-relaxed"
                          key={i}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Subsections */}
                  {section.subsections && (
                    // <div className="space-y-4 pl-4">
                    <React.Fragment>
                      {section.subsections.map((subsection) => (
                        <div className="space-y-2.5" key={subsection.subtitle}>
                          <h3 className="text-base lg:text-lg font-semibold tracking-tight leading-tight text-foreground/70">
                            {subsection.subtitle}
                          </h3>

                          {/* Sub-subsections */}
                          {subsection.subsubsections && (
                            <div className="space-y-2.5 pl-2">
                              {subsection.subsubsections.map(
                                (subsubsection) => (
                                  <div
                                    className="space-y-1.5"
                                    key={subsubsection.subtitle}
                                  >
                                    <h4 className="text-sm font-medium text-muted-foreground">
                                      {subsubsection.subtitle}
                                    </h4>
                                    <ul className="space-y-1 pl-[1.125rem] list-disc">
                                      {subsubsection.content.map((item, i) => (
                                        <li
                                          className="text-sm text-muted-foreground leading-relaxed"
                                          key={i}
                                        >
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </React.Fragment>
                  )}
                </div>
              ))}
            </React.Fragment>
          )}
        </React.Fragment>
      ))}
    </Section>
  );
}

export { Contents };

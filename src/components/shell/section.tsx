import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

const sectionVariants = cva("", {
  variants: {
    size: {
      default: "",
      small: "max-w-4xl mx-auto",
      medium: "max-w-5xl mx-auto",
      large: "max-w-6xl mx-auto",
    },
    padding: {
      default: "",
      hero: "py-4 md:py-0 lg:py-4",
      small: "py-4 md:py-6",
      medium: "py-8 md:py-16",
      large: "py-12 md:py-16 lg:py-20",
    },
    alignment: {
      default: "",
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    spacing: {
      default: "",
      tighter: "space-y-2",
      tight: "space-y-3",
      snug: "space-y-4",
      relaxed: "space-y-6",
      loose: "space-y-8 md:space-y-12",
    },
  },
  defaultVariants: {
    size: "large",
    padding: "default",
    alignment: "default",
    spacing: "default",
  },
});

const sectionHeaderVariants = cva("space-y-1", {
  variants: {
    alignment: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    size: {
      default: "",
      small: "max-w-2xl mx-auto",
      medium: "max-w-3xl mx-auto",
      large: "max-w-4xl mx-auto",
    },
  },
  defaultVariants: {
    alignment: "center",
    size: "medium",
  },
});

// Common class variants for title - used in both cases
const titleClassVariants = cva("", {
  variants: {
    alignment: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    alignment: "center",
  },
});

export type SectionHeaderProps = {
  title: string;
  description?: string;
  titleElement?: "h1" | "h2" | "h3" | "h4";
  className?: string;
} & VariantProps<typeof sectionHeaderVariants>;

export type SectionProps = React.ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof sectionVariants> & {
    as?: React.ElementType;
    header?: SectionHeaderProps;
  };

function SectionHeader({
  title,
  description,
  alignment,
  size,
  titleElement: TitleElement = "h2",
  className,
}: SectionHeaderProps) {
  // If there's no description, just render the title element directly with alignment classes
  if (!description) {
    return (
      <TitleElement
        className={cn(
          titleClassVariants({ alignment }),
          size && size !== "default" && `max-w-${size} mx-auto`,
          className
        )}
      >
        {title}
      </TitleElement>
    );
  }

  // Otherwise, render the container with title and description
  return (
    <div className={cn(sectionHeaderVariants({ alignment, size }), className)}>
      <TitleElement>{title}</TitleElement>
      <p className="text-balance text-muted-foreground">{description}</p>
    </div>
  );
}

function Section({
  className,
  children,
  size,
  padding,
  alignment,
  spacing,
  header,
  as: Component = "section",
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        sectionVariants({ size, padding, alignment, spacing }),
        className
      )}
      {...props}
    >
      {header && (
        <SectionHeader
          {...header}
          alignment={
            header.alignment || alignment === "default" ? undefined : alignment
          }
        />
      )}
      {children}
    </Component>
  );
}

// Helper components for common section patterns
function HeroSection({ className, children, ...props }: SectionProps) {
  return (
    <Section
      padding="hero"
      spacing="tight"
      alignment="center"
      size="small"
      className={cn(className)}
      {...props}
    >
      {children}
    </Section>
  );
}

function MidSection({ className, children, ...props }: SectionProps) {
  return (
    <Section spacing="snug" size="large" className={cn(className)} {...props}>
      {children}
    </Section>
  );
}

export { HeroSection, MidSection, Section, SectionHeader, sectionVariants };

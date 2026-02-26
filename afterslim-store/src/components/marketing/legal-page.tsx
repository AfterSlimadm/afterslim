import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Separator } from "@/components/ui/separator";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: title }]} />
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {lastUpdated}
      </p>
      <Separator className="my-6" />
      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </div>
  );
}

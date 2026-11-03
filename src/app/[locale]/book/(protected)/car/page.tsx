import { redirect } from "next/navigation";
import { resolveLocale } from "@/locales/resolveLocale";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  redirect(`/${resolveLocale((await params).locale)}/book/wash`);
}

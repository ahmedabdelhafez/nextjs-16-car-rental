"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

import { useTranslation } from "@/app/i18n/client";

export function AuthButtons({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, "common");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        {/* Placeholder for User Menu */}
        <span className="text-sm font-medium text-emerald-600">
          {t("auth.hello")}, {user.email}
        </span>
        <Button variant="default" onClick={handleSignOut}>
          {t("auth.signOut")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href={`/${lng}/auth/signin`}>
        <Button variant="outline">{t("auth.signIn")}</Button>
      </Link>
      <Link href={`/${lng}/auth/signup`}>
        <Button>{t("auth.signUp")}</Button>
      </Link>
    </div>
  );
}

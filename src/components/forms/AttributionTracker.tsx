"use client";

/**
 * AttributionTracker — görünmez client bileşeni; mount'ta first-touch
 * attribution yakalar (bkz. src/lib/attribution.ts).
 *
 * ŞU AN kullanılmıyor: attribution yakalama form bileşenlerinin içinde
 * yapılıyor. Kullanıcı bir blog yazısına ?utm_source=... ile inip SONRA
 * /teklif-al'a geçtiğinde UTM kaybolmasın diye bu bileşen ileride
 * layout.tsx'e eklenmelidir (layout bu görev kapsamında dokunulmazdı):
 *
 *   <AttributionTracker />  // layout body içinde herhangi bir yere
 */

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

export default function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}

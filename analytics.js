/* visitlog beacon for a static site: one POST per page view, no cookies.
   Captures ?ref=<tag> (or utm_source / utm_campaign) so links you hand out identify
   where a visit came from. Set window.VISITLOG_RESPECT_DNT = false before this script to
   log Do-Not-Track visitors too. */
(() => {
  const ENDPOINT = "https://affonqcasqfoondncwzn.supabase.co/functions/v1/track";
  const respectDnt = window.VISITLOG_RESPECT_DNT !== false;
  if (respectDnt && (navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true)) return;
  if (/bot|crawl|spider|slurp|headless/i.test(navigator.userAgent)) return;

  const q = new URLSearchParams(location.search);
  const ref = q.get("ref") || q.get("utm_source") || q.get("utm_campaign") || null;
  let session = null;
  let storedRef = ref;
  try {
    session = sessionStorage.getItem("vl_session");
    if (!session) {
      session = Math.random().toString(36).slice(2, 12);
      sessionStorage.setItem("vl_session", session);
    }
    if (ref) sessionStorage.setItem("vl_ref", ref);
    storedRef = ref || sessionStorage.getItem("vl_ref");
  } catch {}

  let tz = null;
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch {}

  const payload = JSON.stringify({
    path: location.pathname + (location.hash || ""),
    ref: storedRef,
    referrer: document.referrer || null,
    lang: navigator.language || null,
    tz,
    screen: window.screen ? `${screen.width}x${screen.height}` : null,
    session,
  });

  const send = () => {
    try {
      fetch(ENDPOINT, {
        method: "POST",
        body: payload,
        keepalive: true,
        headers: { "content-type": "application/json" },
      }).catch(() => {});
    } catch {}
  };
  if (document.readyState === "complete") send();
  else addEventListener("load", send, { once: true });
})();

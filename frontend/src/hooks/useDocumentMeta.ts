import { useEffect } from 'react';

interface DocumentMeta {
  /** The full document title. Will be set as-is (no automatic suffix). */
  title: string;
  /** Optional meta description. Falls back to the existing tag if omitted. */
  description?: string;
  /** Path-only canonical (e.g. "/portal/fiscal"). Origin is added automatically. */
  canonicalPath?: string;
}

const SITE_ORIGIN = 'https://agenticgov.vercel.app';

/**
 * Set the document title, meta description, and canonical link for the
 * currently mounted route. Restores the previous values on unmount so the
 * SPA shell remains consistent across navigation.
 *
 * Note: this is a client-side update. Crawlers that execute JavaScript
 * (Googlebot, Bingbot, ChatGPT-User, ClaudeBot) will pick this up. Crawlers
 * that don't render JS will fall back to the values baked into index.html.
 */
export function useDocumentMeta({ title, description, canonicalPath }: DocumentMeta) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const descTag = description
      ? document.querySelector<HTMLMetaElement>('meta[name="description"]')
      : null;
    const previousDesc = descTag?.content;
    if (descTag && description) {
      descTag.content = description;
    }

    const canonical = canonicalPath
      ? document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      : null;
    const previousCanonical = canonical?.href;
    if (canonical && canonicalPath) {
      canonical.href = `${SITE_ORIGIN}${canonicalPath}`;
    }

    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const previousOgTitle = ogTitle?.content;
    if (ogTitle) ogTitle.content = title;

    const ogUrl = canonicalPath
      ? document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
      : null;
    const previousOgUrl = ogUrl?.content;
    if (ogUrl && canonicalPath) {
      ogUrl.content = `${SITE_ORIGIN}${canonicalPath}`;
    }

    const twitterTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    const previousTwitterTitle = twitterTitle?.content;
    if (twitterTitle) twitterTitle.content = title;

    return () => {
      document.title = previousTitle;
      if (descTag && previousDesc !== undefined) descTag.content = previousDesc;
      if (canonical && previousCanonical !== undefined) canonical.href = previousCanonical;
      if (ogTitle && previousOgTitle !== undefined) ogTitle.content = previousOgTitle;
      if (ogUrl && previousOgUrl !== undefined) ogUrl.content = previousOgUrl;
      if (twitterTitle && previousTwitterTitle !== undefined) twitterTitle.content = previousTwitterTitle;
    };
  }, [title, description, canonicalPath]);
}

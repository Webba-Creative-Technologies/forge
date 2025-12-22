import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BASE_URL = 'https://forge.webba-creative.com'

/**
 * Hook that dynamically sets the canonical URL based on current route.
 * This is important for SEO - each page needs its own canonical URL.
 */
export function useCanonical() {
  const location = useLocation()

  useEffect(() => {
    // Build canonical URL from current path
    const canonicalUrl = `${BASE_URL}${location.pathname}`

    // Find existing canonical link or create new one
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null

    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }

    link.href = canonicalUrl
  }, [location.pathname])
}

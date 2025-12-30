import { ReactNode, useState } from 'react'
import { useIsMobile } from '../hooks/useResponsive'

// ============================================
// TYPES
// ============================================
export interface FooterLink {
  label: string
  href?: string
  onClick?: () => void
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

// ============================================
// FOOTER
// ============================================
interface FooterProps {
  logo?: ReactNode
  logoHref?: string
  tagline?: string
  sections?: FooterSection[]
  socialLinks?: ReactNode
  copyright?: string
  bottomLinks?: FooterLink[]
  variant?: 'default' | 'minimal' | 'centered'
}

const defaultLogo = (
  <svg width="114" height="28" viewBox="0 0 147 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_footer)">
      <path d="M17.685 18.0072L14.2213 27.9046L5.69913 0.973395L5.62946 0.750763H0L10.7395 34.6926L10.8106 34.9153H17.579L23.4947 18.0072H17.685Z" fill="currentColor"/>
      <path d="M39.1643 0.750763H33.5364L22.859 34.5003L22.7272 34.9153H28.3537L39.0325 1.16574L39.1643 0.750763Z" fill="currentColor"/>
      <path d="M143.579 30.1006V16.008C143.579 12.5458 140.762 9.72733 137.302 9.72733H126.785C124.569 9.72733 122.765 11.5311 122.765 13.7484V14.5738H138.304V19.817H131.419C129.705 19.817 128.124 20.0972 126.721 20.65C125.281 21.2028 124.124 22.0676 123.285 23.2171C122.409 24.3545 121.984 25.7812 121.984 27.5759C121.984 29.3706 122.403 30.7443 123.264 31.9075C124.094 33.0857 125.246 34.0066 126.692 34.6457C128.074 35.2318 129.637 35.5287 131.337 35.5287C133.038 35.5287 134.463 35.303 135.554 34.8396C136.726 34.3443 137.577 33.7688 138.233 33.0252C138.468 32.7556 138.687 32.489 138.889 32.227C139.08 32.8222 139.408 33.3341 139.888 33.7839C140.653 34.5018 141.682 34.8653 142.948 34.8653H147.005V30.0991H143.578L143.579 30.1006ZM138.3 24.4681C138.241 26.4067 137.633 27.9318 136.491 29.0087C135.321 30.1461 133.732 30.7231 131.771 30.7231C130.436 30.7231 129.344 30.4172 128.437 29.7886C127.698 29.2555 127.339 28.4937 127.339 27.4593C127.339 26.4249 127.666 25.7661 128.36 25.2723C129.194 24.7392 130.264 24.4681 131.539 24.4681H138.303H138.3Z" fill="currentColor"/>
      <path d="M113.017 11.2449L113.011 11.2419C111.761 10.5315 110.406 10.0651 108.98 9.85607C108.402 9.77428 107.787 9.73188 107.151 9.73188C107.096 9.73188 107.045 9.73491 107.001 9.73945H103.386C101.137 9.73945 99.3057 11.575 99.3057 13.8302V14.6556H106.232C108.362 14.6571 110.036 15.3144 111.351 16.6638C112.67 18.0163 113.338 19.9443 113.338 22.3963V22.8264C113.338 25.3375 112.688 27.2261 111.351 28.5982C110.035 29.9507 108.341 30.608 106.177 30.608C104.013 30.608 102.301 29.9295 100.997 28.5907C99.6661 27.2594 99.0194 25.3738 99.0194 22.8264V0.500885H93.6671V34.8683H98.9013V32.0195C99.4874 32.7374 100.23 33.3978 101.158 34.0248C102.633 35.0243 104.65 35.5302 107.151 35.5302C109.261 35.5302 111.22 35.0213 112.974 34.0202C114.707 33.0297 116.121 31.5622 117.179 29.6584C118.246 27.7683 118.764 25.5722 118.764 22.9415V22.3175C118.764 19.7398 118.245 17.4953 117.221 15.6506C116.191 13.756 114.816 12.3156 113.015 11.2434L113.017 11.2449Z" fill="currentColor"/>
      <path d="M84.1094 11.2449L84.1033 11.2419C82.8538 10.5315 81.4983 10.0651 80.0732 9.85607C79.4946 9.77428 78.8797 9.73188 78.2436 9.73188C78.1891 9.73188 78.1391 9.73491 78.0937 9.73945H74.4786C72.2295 9.73945 70.4 11.575 70.4 13.8302V14.6556H77.3243C79.4553 14.6571 81.1288 15.3144 82.4434 16.6638C83.7625 18.0163 84.4304 19.9443 84.4304 22.3963V22.8264C84.4304 25.3375 83.7807 27.2261 82.4434 28.5982C81.1273 29.9507 79.4356 30.608 77.2713 30.608C75.1071 30.608 73.3957 29.9295 72.0902 28.5907C70.7589 27.2594 70.1122 25.3753 70.1122 22.8264V0.500885H64.7599V34.8683H69.9941V32.0195C70.5787 32.7374 71.3223 33.3962 72.2507 34.0248C73.7273 35.0243 75.7432 35.5302 78.2436 35.5302C80.3534 35.5302 82.3132 35.0213 84.0685 34.0202C85.8011 33.0297 87.2157 31.5622 88.2728 29.6584C89.3405 27.7683 89.8585 25.5707 89.8585 22.9415V22.3175C89.8585 19.7398 89.339 17.4968 88.3152 15.6506C87.2853 13.7575 85.9101 12.3156 84.1094 11.2434V11.2449Z" fill="currentColor"/>
      <path d="M55.5391 10.4846C53.7701 9.49714 51.7119 8.99734 49.4219 8.99734C47.132 8.99734 44.942 9.53046 43.1079 10.583C41.2647 11.6372 39.8017 13.1396 38.7612 15.0494C37.7344 16.941 37.2134 19.1704 37.2134 21.6769V22.2373C37.2134 24.7105 37.7344 26.9247 38.7612 28.8163C39.8047 30.7307 41.2829 32.2361 43.1579 33.2902C45.0177 34.3307 47.1895 34.8608 49.6158 34.8684H54.3184C56.8612 34.8684 58.9301 32.7995 58.9301 30.2566V29.9371H49.7475C47.7272 29.9371 46.0264 29.3086 44.6936 28.0682C43.5426 27.011 42.8519 25.548 42.6354 23.72H61.2564V21.2059C61.2564 18.7599 60.749 16.5957 59.7494 14.7722C58.7362 12.9169 57.3201 11.4751 55.5391 10.4846ZM44.8132 15.5037C45.9915 14.4632 47.5424 13.9362 49.4219 13.9362C51.3014 13.9362 52.7887 14.4632 53.9518 15.5022C54.9393 16.3867 55.533 17.5407 55.7602 19.025H42.7898C43.1503 17.5559 43.8303 16.3715 44.8117 15.5052L44.8132 15.5037Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_footer">
        <rect width="147" height="35.0123" fill="white" transform="translate(0 0.500885)"/>
      </clipPath>
    </defs>
  </svg>
)

export function Footer({
  logo = defaultLogo,
  logoHref,
  tagline,
  sections,
  socialLinks,
  copyright,
  bottomLinks,
  variant = 'default'
}: FooterProps) {
  const isMobile = useIsMobile()
  const currentYear = new Date().getFullYear()
  const defaultCopyright = `© ${currentYear} All rights reserved.`

  const logoElement = logoHref ? (
    <a href={logoHref} target="_blank" rel="noopener noreferrer" style={{ display: 'flex' }}>
      {logo}
    </a>
  ) : logo

  if (variant === 'minimal') {
    return (
      <footer style={{
        padding: '1.5rem 2rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          {copyright || defaultCopyright}
        </span>
        {bottomLinks && (
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {bottomLinks.map((link, i) => (
              <FooterLinkItem key={i} link={link} />
            ))}
          </div>
        )}
      </footer>
    )
  }

  if (variant === 'centered') {
    return (
      <footer style={{
        padding: '3rem 2rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        textAlign: 'center'
      }}>
        {logo && <div style={{ color: 'var(--text-primary)' }}>{logoElement}</div>}
        {tagline && (
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            maxWidth: 400,
            margin: 0,
            lineHeight: 1.6
          }}>
            {tagline}
          </p>
        )}
        {socialLinks && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {socialLinks}
          </div>
        )}
        {bottomLinks && (
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {bottomLinks.map((link, i) => (
              <FooterLinkItem key={i} link={link} />
            ))}
          </div>
        )}
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {copyright || defaultCopyright}
        </span>
      </footer>
    )
  }

  // Default variant
  return (
    <footer style={{
      padding: isMobile ? '2rem 1.5rem 2rem' : '3rem 2rem 2rem',
      borderTop: '1px solid var(--border-subtle)'
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? '1fr'
            : sections && sections.length > 0
              ? `minmax(200px, 1fr) repeat(${Math.min(sections.length, 4)}, minmax(120px, auto))`
              : '1fr',
          gap: isMobile ? '1.5rem' : '3rem',
          marginBottom: isMobile ? '1.5rem' : '2rem'
        }}>
        {/* Brand column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {logo && <div style={{ color: 'var(--text-primary)' }}>{logoElement}</div>}
          {tagline && (
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 280
            }}>
              {tagline}
            </p>
          )}
          {socialLinks && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {socialLinks}
            </div>
          )}
        </div>

        {/* Link sections */}
        {sections?.map((section, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              margin: 0
            }}>
              {section.title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginLeft: '-0.5rem' }}>
              {section.links.map((link, i) => (
                <FooterLinkItem key={i} link={link} />
              ))}
            </div>
          </div>
        ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {copyright || defaultCopyright}
          </span>
          {bottomLinks && (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {bottomLinks.map((link, i) => (
                <FooterLinkItem key={i} link={link} size="sm" />
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

// ============================================
// FOOTER LINK ITEM
// ============================================
function FooterLinkItem({ link, size = 'md' }: { link: FooterLink; size?: 'sm' | 'md' }) {
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    if (link.onClick) {
      link.onClick()
    } else if (link.href) {
      window.location.href = link.href
    }
  }

  const fontSize = size === 'sm' ? '0.75rem' : '0.8125rem'
  const padding = size === 'sm' ? '0.25rem 0.5rem' : '0.375rem 0.625rem'

  const Component = link.href ? 'a' : 'button'

  return (
    <Component
      href={link.href}
      onClick={link.href ? undefined : handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize,
        padding,
        color: hovered ? 'var(--brand-primary)' : 'var(--text-secondary)',
        textDecoration: hovered ? 'underline' : 'none',
        transition: 'color 0.15s ease, text-decoration 0.15s ease',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      {link.label}
    </Component>
  )
}

// ============================================
// SIMPLE FOOTER (one-liner)
// ============================================
interface SimpleFooterProps {
  companyName?: string
  text?: string // Override full text (won't auto-add year)
  links?: FooterLink[]
}

export function SimpleFooter({ companyName, text, links }: SimpleFooterProps) {
  const currentYear = new Date().getFullYear()

  // If text is provided, use it as-is. Otherwise, build copyright with current year
  const copyrightText = text
    ? text
    : companyName
      ? `© ${currentYear} ${companyName}. All rights reserved.`
      : `© ${currentYear}`

  return (
    <footer style={{
      padding: '1rem 1.5rem',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {copyrightText}
      </span>
      {links && links.length > 0 && (
        <>
          <span style={{ color: 'var(--border-color)' }}>•</span>
          {links.map((link, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <FooterLinkItem link={link} size="sm" />
              {i < links.length - 1 && <span style={{ color: 'var(--border-color)' }}>•</span>}
            </span>
          ))}
        </>
      )}
    </footer>
  )
}

import {
  Container,
  VStack,
  Heading,
  Text,
  Divider,
  Footer
} from '../../.forge'

// Footer sections
const footerSections = [
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Components', href: '/docs/components' },
      { label: 'Blocks', href: '/blocks' },
      { label: 'Changelog', href: '/docs/changelog' }
    ]
  },
  {
    title: 'Community',
    links: [
      { label: 'Discord', href: 'https://discord.gg/P9aFbP7gY6' },
      { label: 'Twitter', href: 'https://x.com/DeguinLuca16510' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Accessibility: Partially compliant', href: '/terms#accessibility' }
    ]
  },
  {
    title: 'Webba',
    links: [
      { label: 'My Webba iD', href: 'https://account.webba-creative.com' },
      { label: 'Our website', href: 'https://webba-creative.com' }
    ]
  }
]

export function TermsPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <section style={{ padding: '4rem 0' }}>
        <Container maxWidth={800}>
          <VStack gap="xl">
            <VStack gap="md" style={{ textAlign: 'center' }}>
              <Heading level={1}>Terms of Service</Heading>
              <Text color="secondary">Last updated: December 2025</Text>
            </VStack>

            <Divider />

            <VStack gap="lg" style={{ textAlign: 'left' }}>
              <VStack gap="sm">
                <Heading level={2}>1. Acceptance of Terms</Heading>
                <Text color="secondary">
                  By accessing and using Forge, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use our services.
                </Text>
              </VStack>

              <VStack gap="sm">
                <Heading level={2}>2. Use License</Heading>
                <Text color="secondary">
                  Forge is provided as an open-source component library. You are granted a non-exclusive, worldwide, royalty-free license to use, copy, modify, and distribute the library in your projects, both personal and commercial.
                </Text>
              </VStack>

              <VStack gap="sm">
                <Heading level={2}>3. Restrictions</Heading>
                <Text color="secondary">
                  You may not:
                </Text>
                <ul style={{ color: 'var(--text-secondary)', paddingLeft: '1.5rem', margin: 0 }}>
                  <li>Claim ownership of the original Forge library</li>
                  <li>Remove or alter any proprietary notices or labels</li>
                  <li>Use the library for any unlawful purpose</li>
                  <li>Redistribute the library as a competing product without substantial modifications</li>
                </ul>
              </VStack>

              <VStack gap="sm">
                <Heading level={2}>4. Disclaimer</Heading>
                <Text color="secondary">
                  Forge is provided "as is" without warranty of any kind, express or implied. We do not warrant that the library will be error-free or uninterrupted. Use of the library is at your own risk.
                </Text>
              </VStack>

              <VStack gap="sm">
                <Heading level={2}>5. Limitation of Liability</Heading>
                <Text color="secondary">
                  In no event shall Webba or its contributors be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of Forge.
                </Text>
              </VStack>

              <VStack gap="sm">
                <Heading level={2}>6. Changes to Terms</Heading>
                <Text color="secondary">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of Forge after changes constitutes acceptance of the new terms.
                </Text>
              </VStack>

              <div id="accessibility">
                <VStack gap="sm">
                  <Heading level={2}>7. Accessibility</Heading>
                  <Text color="secondary">
                    Accessibility: Partially compliant. We strive to make Forge accessible to all users. If you encounter any accessibility issues, please contact us so we can improve.
                  </Text>
                </VStack>
              </div>

              <VStack gap="sm">
                <Heading level={2}>8. Contact</Heading>
                <Text color="secondary">
                  For any questions regarding these terms, please contact us through our Discord server or visit our website at webba-creative.com.
                </Text>
              </VStack>
            </VStack>
          </VStack>
        </Container>
      </section>

      {/* Footer */}
      <Footer
        logoHref="https://webba-creative.com"
        tagline="A modern React component library built for speed and developer experience."
        sections={footerSections}
        copyright="© 2025 Webba. All rights reserved."
      />
    </div>
  )
}

# Forge - AI-Ready React Component Library

<p align="center">
  <img src="public/favicon.png" alt="Forge Logo" width="80" height="80">
</p>

<p align="center">
  <strong>100+ production-ready React components with dark/light themes, TypeScript support, and AI integration.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-3.0.1-A35BFF?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/react-18.x-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/typescript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/vite-6.x-646CFF?style=flat-square&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
</p>

<p align="center">
  <a href="https://forge.webba-creative.com">Documentation</a> •
  <a href="https://forge.webba-creative.com/blocks">Blocks</a> •
  <a href="https://forge.webba-creative.com/playground">Playground</a>
</p>

---

## Features

- **100+ Components** - Buttons, Cards, Forms, Tables, Charts, Navigation, and more
- **Dark & Light Themes** - Built-in theme support with CSS variables
- **TypeScript** - Full TypeScript support with strict types
- **AI-Ready** - Designed for AI-assisted development with clear component APIs
- **Zero Dependencies** - Pure React components, no external UI libraries required
- **Accessible** - WCAG compliant with keyboard navigation support

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Webba-Creative-Technologies/forge.git
cd forge

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your values (optional)
```

### Build

```bash
# Development build
npm run build

# Production build with SEO pre-rendering
npm run build:seo
```

## Project Structure

```
forge/
├── .forge/              # Component library source
│   ├── components/      # All UI components
│   ├── hooks/           # React hooks
│   └── styles/          # CSS and animations
├── src/                 # Documentation site
│   ├── components/      # Site-specific components
│   └── pages/           # Documentation pages
├── public/              # Static assets
├── scripts/             # Build scripts
└── legacy/              # WSS1 legacy documentation
```

## Components Overview

### Inputs
Button, Input, Textarea, Select, Checkbox, Switch, Radio, Slider, DatePicker, ColorPicker, FileUpload, and more.

### Data Display
Card, Table, Badge, Avatar, Timeline, Accordion, TreeView, Calendar, Charts (Bar, Line, Donut).

### Feedback
Toast, Notification, Banner, Alert, Spinner, Skeleton, ProgressBar.

### Navigation
Navbar, Tabs, Breadcrumbs, Pagination, Stepper, Footer.

### Overlays
Modal, Dropdown, Popover, Tooltip, Sheet, BottomSheet.

### Layout
Container, Stack, Grid, Flex, Divider.

## Usage Example

```tsx
import { Button, Card, Input, VStack } from './.forge'

function LoginForm() {
  return (
    <Card padding="lg">
      <VStack gap="md">
        <Input label="Email" type="email" placeholder="Enter your email" />
        <Input label="Password" type="password" placeholder="Enter your password" />
        <Button variant="primary" fullWidth>
          Sign In
        </Button>
      </VStack>
    </Card>
  )
}
```

## Theming

Forge uses CSS variables for theming. Override them in your CSS:

```css
:root {
  --brand-primary: #A35BFF;
  --brand-secondary: #7B3FE4;
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
}
```

Use the [Theme Creator](https://forge.webba-creative.com/create) to generate custom themes.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- [GitHub Issues](https://github.com/Webba-Creative-Technologies/forge/issues)
- [Discord Community](https://discord.gg/P9aFbP7gY6)
- [GitHub Sponsors](https://github.com/sponsors/Webba-Creative-Technologies)

---

<p align="center">
  Webba Creative Technologies - 2025
</p>

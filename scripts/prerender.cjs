/**
 * Pre-render script for SEO
 * Generates static HTML files for each route so search engines can crawl them
 */

const puppeteer = require('puppeteer');
const { createServer } = require('http');
const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join, dirname } = require('path');

const DIST_DIR = join(__dirname, '..', 'dist');
const PORT = 4173;

// Generate page title from route
function getPageTitle(route) {
  if (route === '/') return 'Forge - AI-Ready React Component Library';

  const parts = route.split('/').filter(Boolean);

  // Map route segments to readable titles
  const titleMap = {
    'docs': 'Documentation',
    'blocks': 'Blocks',
    'playground': 'Playground',
    'create': 'Theme Creator',
    'terms': 'Terms of Service',
    'getting-started': 'Getting Started',
    'installation': 'Installation',
    'design-language': 'Design Language',
    'components': 'Components',
    'ai-integration': 'AI Integration',
    'changelog': 'Changelog',
    // Components
    'button': 'Button',
    'iconbutton': 'IconButton',
    'gradientbutton': 'GradientButton',
    'floatbutton': 'FloatButton',
    'backtotop': 'BackToTop',
    'copybutton': 'CopyButton',
    'card': 'Card',
    'imagecard': 'ImageCard',
    'horizontalcard': 'HorizontalCard',
    'actioncard': 'ActionCard',
    'statcard': 'StatCard',
    'progresscard': 'ProgressCard',
    'infocard': 'InfoCard',
    'input': 'Input',
    'textarea': 'Textarea',
    'select': 'Select',
    'searchinput': 'SearchInput',
    'checkbox': 'Checkbox',
    'switch': 'Switch',
    'radio': 'Radio',
    'slider': 'Slider',
    'numberinput': 'NumberInput',
    'taginput': 'TagInput',
    'combobox': 'Combobox',
    'datepicker': 'DatePicker',
    'timepicker': 'TimePicker',
    'colorpicker': 'ColorPicker',
    'fileupload': 'FileUpload',
    'otpinput': 'OTPInput',
    'phoneinput': 'PhoneInput',
    'rating': 'Rating',
    'badge': 'Badge',
    'tag': 'Tag',
    'statusbadge': 'StatusBadge',
    'tabs': 'Tabs',
    'breadcrumbs': 'Breadcrumbs',
    'stepper': 'Stepper',
    'navbar': 'Navbar',
    'bottomnav': 'BottomNav',
    'pagination': 'Pagination',
    'footer': 'Footer',
    'modal': 'Modal',
    'confirmdialog': 'ConfirmDialog',
    'sheet': 'Sheet',
    'sidepanel': 'SidePanel',
    'bottomsheet': 'BottomSheet',
    'dropdown': 'Dropdown',
    'contextmenu': 'ContextMenu',
    'popover': 'Popover',
    'tooltip': 'Tooltip',
    'commandbar': 'CommandBar',
    'tour': 'Tour',
    'table': 'Table',
    'calendar': 'Calendar',
    'timeline': 'Timeline',
    'avatar': 'Avatar',
    'accordion': 'Accordion',
    'collapsible': 'Collapsible',
    'codeblock': 'CodeBlock',
    'treeview': 'TreeView',
    'toast': 'Toast',
    'notification': 'Notification',
    'banner': 'Banner',
    'alert': 'Alert',
    'spinner': 'Spinner',
    'skeleton': 'Skeleton',
    'progressbar': 'ProgressBar',
    'barchart': 'BarChart',
    'linechart': 'LineChart',
    'donutchart': 'DonutChart',
    'sparkline': 'Sparkline',
    'imagegallery': 'ImageGallery',
    'carousel': 'Carousel',
    'videoplayer': 'VideoPlayer',
    'audioplayer': 'AudioPlayer',
    'container': 'Container',
    'stack': 'Stack',
    'grid': 'Grid',
    'flex': 'Flex',
    'divider': 'Divider',
    'animate': 'Animate',
    'affix': 'Affix',
    'watermark': 'Watermark',
    'heading': 'Heading',
    'text': 'Text',
    'label': 'Label',
    'link': 'Link',
    'kbd': 'Kbd'
  };

  // Get the last meaningful part of the route
  const lastPart = parts[parts.length - 1];
  const title = titleMap[lastPart] || lastPart.charAt(0).toUpperCase() + lastPart.slice(1);

  return `${title} - Forge`;
}

// All routes to pre-render
const routes = [
  '/',
  '/docs',
  '/docs/getting-started',
  '/docs/installation',
  '/docs/design-language',
  '/docs/components',
  '/docs/ai-integration',
  '/docs/changelog',
  '/blocks',
  '/playground',
  '/create',
  '/terms',
  // Components
  '/docs/components/button',
  '/docs/components/iconbutton',
  '/docs/components/gradientbutton',
  '/docs/components/floatbutton',
  '/docs/components/backtotop',
  '/docs/components/copybutton',
  '/docs/components/card',
  '/docs/components/imagecard',
  '/docs/components/horizontalcard',
  '/docs/components/actioncard',
  '/docs/components/statcard',
  '/docs/components/progresscard',
  '/docs/components/infocard',
  '/docs/components/input',
  '/docs/components/textarea',
  '/docs/components/select',
  '/docs/components/searchinput',
  '/docs/components/checkbox',
  '/docs/components/switch',
  '/docs/components/radio',
  '/docs/components/slider',
  '/docs/components/numberinput',
  '/docs/components/taginput',
  '/docs/components/combobox',
  '/docs/components/datepicker',
  '/docs/components/timepicker',
  '/docs/components/colorpicker',
  '/docs/components/fileupload',
  '/docs/components/otpinput',
  '/docs/components/phoneinput',
  '/docs/components/rating',
  '/docs/components/badge',
  '/docs/components/tag',
  '/docs/components/statusbadge',
  '/docs/components/tabs',
  '/docs/components/breadcrumbs',
  '/docs/components/stepper',
  '/docs/components/navbar',
  '/docs/components/bottomnav',
  '/docs/components/pagination',
  '/docs/components/footer',
  '/docs/components/modal',
  '/docs/components/confirmdialog',
  '/docs/components/sheet',
  '/docs/components/sidepanel',
  '/docs/components/bottomsheet',
  '/docs/components/dropdown',
  '/docs/components/contextmenu',
  '/docs/components/popover',
  '/docs/components/tooltip',
  '/docs/components/commandbar',
  '/docs/components/tour',
  '/docs/components/table',
  '/docs/components/calendar',
  '/docs/components/timeline',
  '/docs/components/avatar',
  '/docs/components/accordion',
  '/docs/components/collapsible',
  '/docs/components/codeblock',
  '/docs/components/treeview',
  '/docs/components/toast',
  '/docs/components/notification',
  '/docs/components/banner',
  '/docs/components/alert',
  '/docs/components/spinner',
  '/docs/components/skeleton',
  '/docs/components/progressbar',
  '/docs/components/barchart',
  '/docs/components/linechart',
  '/docs/components/donutchart',
  '/docs/components/sparkline',
  '/docs/components/imagegallery',
  '/docs/components/carousel',
  '/docs/components/videoplayer',
  '/docs/components/audioplayer',
  '/docs/components/container',
  '/docs/components/stack',
  '/docs/components/grid',
  '/docs/components/flex',
  '/docs/components/divider',
  '/docs/components/animate',
  '/docs/components/affix',
  '/docs/components/watermark',
  '/docs/components/heading',
  '/docs/components/text',
  '/docs/components/label',
  '/docs/components/link',
  '/docs/components/kbd'
];

// Simple static file server
function createStaticServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
  };

  return createServer((req, res) => {
    let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

    // SPA fallback: serve index.html for all routes
    if (!existsSync(filePath) || !filePath.includes('.')) {
      filePath = join(DIST_DIR, 'index.html');
    }

    try {
      const content = readFileSync(filePath);
      const ext = filePath.substring(filePath.lastIndexOf('.'));
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    } catch (err) {
      res.writeHead(404);
      res.end('Not found');
    }
  });
}

async function prerender() {
  console.log('Starting pre-render...\n');

  // Start server
  const server = createStaticServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Server running on http://localhost:${PORT}\n`);

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  let successCount = 0;
  let errorCount = 0;

  for (const route of routes) {
    try {
      const page = await browser.newPage();

      // Navigate and wait for network to be idle
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait a bit more for React to fully render
      await page.waitForSelector('#root > *', { timeout: 10000 });
      await new Promise(r => setTimeout(r, 500));

      // Get the rendered HTML
      let html = await page.content();

      // Update title for this page
      const pageTitle = getPageTitle(route);
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${pageTitle}</title>`);
      html = html.replace(/<meta name="title" content="[^"]*"/, `<meta name="title" content="${pageTitle}"`);
      html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${pageTitle}"`);
      html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${pageTitle}"`);

      // Determine output path
      const outputPath = route === '/'
        ? join(DIST_DIR, 'index.html')
        : join(DIST_DIR, route, 'index.html');

      // Create directory if needed
      const dir = dirname(outputPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      // Write the pre-rendered HTML
      writeFileSync(outputPath, html);

      console.log(`  OK: ${route}`);
      successCount++;

      await page.close();
    } catch (err) {
      console.error(`  ERROR: ${route} - ${err.message}`);
      errorCount++;
    }
  }

  await browser.close();
  server.close();

  console.log(`\nPre-render complete!`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);
}

prerender().catch(console.error);

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import type { Connect } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'ai-api-middleware',
        configureServer(server) {
          server.middlewares.use('/api/ai', (async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end('Method not allowed')
              return
            }

            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', async () => {
              try {
                const { query, context } = JSON.parse(body)

                const response = await fetch('https://api.anthropic.com/v1/messages', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': env.ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                  },
                  body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 500,
                    system: `Tu es l'assistant Forge, un design system React. Réponds TOUJOURS en JSON:

{"type":"info","message":"ta réponse"}

FORMAT DU MESSAGE:
- Texte normal pour les explications
- Code: \`\`\`tsx\\ncode ici\\n\`\`\`
- Liens: [Texte visible](/route)
- Sauts de ligne: \\n

EXEMPLE DE RÉPONSE:
{"type":"info","message":"Voici comment utiliser Button:\\n\\n\`\`\`tsx\\nimport { Button } from '.forge'\\n\\nfunction App() {\\n  return <Button variant=\\"primary\\">Cliquer</Button>\\n}\\n\`\`\`\\n\\nPlus d'infos: [Documentation Button](/docs/components/button)"}

COMPOSANTS DISPONIBLES:
Button, IconButton, GradientButton, FloatButton, Card, StatCard, VStack, HStack, Grid, Input, Textarea, Select, Checkbox, Switch, DatePicker, Navbar, Tabs, Breadcrumbs, Pagination, Table, Badge, Avatar, Accordion, Toast, Modal, Spinner, Skeleton, BarChart, LineChart, DonutChart, Divider, Tooltip, CodeBlock

PAGES:
/docs/getting-started, /docs/installation, /docs/design-language, /docs/components, /blocks, /docs/components/[composant]

RÈGLES:
1. Import: import { X } from '.forge' (pas @forge)
2. Hors sujet → {"type":"info","message":"Je réponds uniquement aux questions sur Forge et ses composants."}
3. Réponds dans la langue de la question`,
                    messages: [{ role: 'user', content: query }]
                  })
                })

                const data = await response.json()

                if (data.content && data.content[0]) {
                  const text = data.content[0].text

                  // Helper to extract message from JSON
                  const extractMessage = (input: string): string => {
                    // Remove markdown code block wrapper if present
                    let cleaned = input.replace(/^```json\s*\n?|\n?```\s*$/g, '').trim()

                    // Try to parse as JSON
                    const tryParse = (str: string): string | null => {
                      try {
                        const parsed = JSON.parse(str)
                        if (parsed.message && typeof parsed.message === 'string') {
                          return parsed.message
                        }
                        if (parsed.content && typeof parsed.content === 'string') {
                          return parsed.content
                        }
                      } catch {
                        // Not valid JSON
                      }
                      return null
                    }

                    // Try direct parse first
                    let result = tryParse(cleaned)
                    if (result) {
                      // Check if result is itself a JSON string (double-encoded)
                      if (result.trim().startsWith('{"')) {
                        const nested = tryParse(result)
                        if (nested) result = nested
                      }
                      return result
                    }

                    // Try to find balanced JSON object
                    const startIdx = cleaned.indexOf('{')
                    if (startIdx !== -1) {
                      let depth = 0
                      let inString = false
                      let escape = false

                      for (let i = startIdx; i < cleaned.length; i++) {
                        const char = cleaned[i]

                        if (escape) {
                          escape = false
                          continue
                        }

                        if (char === '\\') {
                          escape = true
                          continue
                        }

                        if (char === '"' && !escape) {
                          inString = !inString
                          continue
                        }

                        if (!inString) {
                          if (char === '{') depth++
                          else if (char === '}') {
                            depth--
                            if (depth === 0) {
                              const jsonStr = cleaned.slice(startIdx, i + 1)
                              result = tryParse(jsonStr)
                              if (result) {
                                // Check for double-encoding
                                if (result.trim().startsWith('{"')) {
                                  const nested = tryParse(result)
                                  if (nested) result = nested
                                }
                                return result
                              }
                              break
                            }
                          }
                        }
                      }
                    }

                    // Fallback: remove JSON wrapper pattern manually
                    const manualMatch = cleaned.match(/^\s*\{\s*"type"\s*:\s*"[^"]*"\s*,\s*"message"\s*:\s*"([\s\S]*)"\s*\}\s*$/)
                    if (manualMatch) {
                      return manualMatch[1]
                        .replace(/\\n/g, '\n')
                        .replace(/\\"/g, '"')
                        .replace(/\\\\/g, '\\')
                    }

                    return cleaned
                  }

                  const message = extractMessage(text) || 'Voici ma réponse.'
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ type: 'info', message }))
                } else {
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ type: 'info', message: 'Désolé, je n\'ai pas pu répondre.' }))
                }
              } catch (error) {
                console.error('AI API error:', error)
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ type: 'info', message: 'Une erreur est survenue.' }))
              }
            })
          }) as Connect.NextHandleFunction)
        }
      }
    ],
    server: {
      port: 5173,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  }
})

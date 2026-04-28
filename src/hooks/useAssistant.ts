import { useState, useCallback } from 'react'

// Types
export interface AssistantAction {
  type: 'navigate' | 'create' | 'info' | 'action' | 'multi'
  target?: string
  data?: Record<string, unknown>
  message: string
  results?: { type: string; id: string; title: string; route?: string }[]
  actions?: AssistantAction[]
}

export interface AssistantConfig {
  apiKey: string
  model?: string
  maxTokens?: number
  systemPrompt?: string
  context?: () => AssistantContext
}

export interface AssistantContext {
  projects?: { name: string; id: string }[]
  clients?: { name: string; id: string }[]
  todos?: { title: string; projectName?: string }[]
  events?: { title: string; date: string }[]
  [key: string]: unknown
}

interface UseAssistantReturn {
  query: (text: string) => Promise<AssistantAction>
  loading: boolean
  error: string | null
  lastResponse: AssistantAction | null
}

// Default system prompt builder
function buildDefaultPrompt(ctx: AssistantContext): string {
  const projectsList = ctx.projects?.slice(0, 6).map(p => p.name).join(', ') || 'aucun'
  const clientsList = ctx.clients?.slice(0, 6).map(c => c.name).join(', ') || 'aucun'
  const todosList = ctx.todos?.slice(0, 6).map(t => `"${t.title}"${t.projectName ? ` [${t.projectName}]` : ''}`).join(', ') || 'aucune'
  const eventsList = ctx.events?.slice(0, 5).map(e => `"${e.title}" ${e.date}`).join(', ') || 'aucun'

  return `Assistant Webba. JSON uniquement.

CONTEXTE:
- ${ctx.projects?.length || 0} projets: ${projectsList}
- ${ctx.todos?.length || 0} tâches: ${todosList}
- ${ctx.events?.length || 0} événements: ${eventsList}
- ${ctx.clients?.length || 0} clients: ${clientsList}

MULTI-ACTIONS: Pour plusieurs actions, utilise "actions" array:
{"type":"multi","message":"Je vais:\\n• Action 1\\n• Action 2","actions":[
  {"type":"create","data":{"type":"client","title":"X"}},
  {"type":"create","data":{"type":"project","title":"Y","client_id":"X"}}
]}

QUESTIONS (liste avec \\n et •):
{"type":"info","message":"Tes tâches:\\n• X [Projet]\\n• Y"}

CRÉER:
{"type":"create","data":{"type":"project","title":"X"},"message":"Créer projet X ?"}
{"type":"create","data":{"type":"project","title":"X","client_id":"C"},"message":"Créer projet X lié à C ?"}
{"type":"create","data":{"type":"todo","title":"X","project_id":"P"},"message":"Créer tâche X dans P ?"}
{"type":"create","data":{"type":"client","title":"X"},"message":"Créer client X ?"}
{"type":"create","data":{"type":"invoice","title":"X","client_id":"C","amount":1000},"message":"Créer facture X ?"}

NAVIGUER:
{"type":"navigate","target":"/projects|/finances|/clients|/calendar","message":"..."}

ACTIONS:
{"type":"action","data":{"action":"delete_project","project_id":"X"},"message":"Supprimer projet X ?"}
{"type":"action","data":{"action":"archive_project","project_id":"X"},"message":"Archiver projet X ?"}
{"type":"action","data":{"action":"delete_todo","todo_id":"X"},"message":"Supprimer tâche X ?"}
{"type":"action","data":{"action":"complete_todo","todo_id":"X"},"message":"Terminer X ?"}
{"type":"action","data":{"action":"delete_client","client_id":"X"},"message":"Supprimer client X ?"}`
}

// Hook
export function useAssistant(config: AssistantConfig): UseAssistantReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResponse, setLastResponse] = useState<AssistantAction | null>(null)

  const query = useCallback(async (text: string): Promise<AssistantAction> => {
    if (!config.apiKey) {
      const err = { type: 'info' as const, message: 'API non configurée' }
      setLastResponse(err)
      return err
    }

    setLoading(true)
    setError(null)

    try {
      const context = config.context?.() || {}
      const systemPrompt = config.systemPrompt || buildDefaultPrompt(context)

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: config.model || 'claude-3-haiku-20240307',
          max_tokens: config.maxTokens || 500,
          system: systemPrompt,
          messages: [{ role: 'user', content: text }]
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const content = data.content?.[0]?.text || ''

      // Extract JSON from response
      const match = content.match(/\{[\s\S]*\}/)
      if (match) {
        const parsed = JSON.parse(match[0]) as AssistantAction
        setLastResponse(parsed)
        return parsed
      }

      const fallback = { type: 'info' as const, message: content || 'Pas compris' }
      setLastResponse(fallback)
      return fallback

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(message)
      const errorResponse = { type: 'info' as const, message: 'Erreur, réessaie' }
      setLastResponse(errorResponse)
      return errorResponse
    } finally {
      setLoading(false)
    }
  }, [config])

  return { query, loading, error, lastResponse }
}

// Natural language detection
export function isNaturalLanguageQuery(q: string): boolean {
  return /^(je |j'|montre|affiche|ouvre|va |créer|crée|ajoute|nouveau|combien|quand|où|comment|quel|liste|cherche|trouve|marque|lie|lier|facture|devis|supprime|supprimer|efface|effacer|archive|archiver|termine|terminer|enlève|enlever|retire|retirer|show|create|add|new|how|what|where|list|find|delete|remove)/i.test(q) ||
    /\?$/.test(q) ||
    / (moi|le|la|les|un|une|des|au|du|mon|ma|me|the|a|an|my) /i.test(q)
}

// Entity lookup helper
export function findEntityByIdOrName<T extends { id: string; name: string }>(
  entities: T[],
  idOrName: string
): T | undefined {
  return entities.find(e =>
    e.id === idOrName ||
    e.name.toLowerCase() === idOrName.toLowerCase()
  )
}

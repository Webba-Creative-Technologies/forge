interface LayoutIdEntry {
  rect: DOMRect
  element: HTMLElement
  opacity: number
}

class LayoutIdRegistryClass {
  private entries = new Map<string, LayoutIdEntry>()

  register(id: string, element: HTMLElement) {
    this.entries.set(id, {
      rect: element.getBoundingClientRect(),
      element,
      opacity: 1
    })
  }

  snapshot(id: string): LayoutIdEntry | undefined {
    const entry = this.entries.get(id)
    if (entry) {
      // Capture current rect before unmount
      return { ...entry, rect: entry.element.getBoundingClientRect() }
    }
    return undefined
  }

  unregister(id: string) {
    this.entries.delete(id)
  }

  get(id: string) {
    return this.entries.get(id)
  }
}

export const layoutIdRegistry = new LayoutIdRegistryClass()
export type { LayoutIdEntry }

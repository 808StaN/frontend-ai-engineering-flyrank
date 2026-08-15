import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

export type TabItem = {
  id: string
  label: string
  panel: ReactNode
}

export type TabsProps = {
  label: string
  items: TabItem[]
  defaultTabId?: string
}

export function Tabs({ label, items, defaultTabId }: TabsProps) {
  const baseId = useId()
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [selectedId, setSelectedId] = useState(
    defaultTabId ?? items[0]?.id ?? '',
  )

  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.id === selectedId),
  )

  function focusTab(index: number) {
    if (items.length === 0) {
      return
    }

    const wrappedIndex = (index + items.length) % items.length
    const nextItem = items[wrappedIndex]
    if (!nextItem) {
      return
    }
    setSelectedId(nextItem.id)
    tabRefs.current[wrappedIndex]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        focusTab(selectedIndex + 1)
        break
      case 'ArrowLeft':
        event.preventDefault()
        focusTab(selectedIndex - 1)
        break
      case 'Home':
        event.preventDefault()
        focusTab(0)
        break
      case 'End':
        event.preventDefault()
        focusTab(items.length - 1)
        break
      default:
        break
    }
  }

  return (
    <div className="fe05-tabs">
      <div
        className="fe05-tabs__list"
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
      >
        {items.map((item, index) => {
          const isSelected = item.id === selectedId
          const tabId = `${baseId}-tab-${item.id}`
          const panelId = `${baseId}-panel-${item.id}`

          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              id={tabId}
              className="fe05-tabs__tab"
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelectedId(item.id)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {items.map((item) => {
        const isSelected = item.id === selectedId
        const tabId = `${baseId}-tab-${item.id}`
        const panelId = `${baseId}-panel-${item.id}`

        return (
          <div
            key={item.id}
            id={panelId}
            className="fe05-tabs__panel"
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isSelected}
            tabIndex={0}
          >
            {item.panel}
          </div>
        )
      })}
    </div>
  )
}

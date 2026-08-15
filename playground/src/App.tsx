import { Disclosure } from './components/Disclosure'
import { ModalDialog } from './components/ModalDialog'
import { Tabs } from './components/Tabs'

export default function App() {
  return (
    <main className="fe05-page">
      <h1>FE-05 Accessible component playground</h1>
      <p className="fe05-lede">
        Custom WAI-ARIA implementations first, then shadcn/ui comparison
        components. Use the keyboard only: Tab, Shift+Tab, arrows, Home, End,
        Enter, Space, and Escape.
      </p>

      <section className="fe05-section" aria-labelledby="modal-heading">
        <h2 id="modal-heading">Modal Dialog</h2>
        <p className="fe05-hint">
          Keyboard: Tab / Shift+Tab stay inside the dialog, Escape closes it,
          focus returns to the opener.
        </p>
        <ModalDialog
          triggerLabel="Open custom dialog"
          title="Profile reminder"
          description="This dialog traps keyboard focus until it is closed."
        >
          <label className="fe05-field" htmlFor="display-name">
            Display name
            <input id="display-name" name="displayName" defaultValue="Ada" />
          </label>
          <p>
            You can also <a href="#tabs-heading">jump to the tabs example</a>{' '}
            after closing the dialog.
          </p>
        </ModalDialog>
      </section>

      <section className="fe05-section" aria-labelledby="tabs-heading">
        <h2 id="tabs-heading">Tabs</h2>
        <p className="fe05-hint">
          Keyboard: Tab enters the selected tab. ArrowLeft / ArrowRight move
          and automatically activate. Home and End jump to the first and last
          tab.
        </p>
        <Tabs
          label="Capstone topics"
          items={[
            {
              id: 'overview',
              label: 'Overview',
              panel: <p>Automatic activation: focusing a tab also selects it.</p>,
            },
            {
              id: 'a11y',
              label: 'Accessibility',
              panel: (
                <p>
                  Only the selected tab is in the tab order. Other tabs use
                  tabIndex=-1.
                </p>
              ),
            },
            {
              id: 'next',
              label: 'Next steps',
              panel: <p>Compare this widget with the shadcn Tabs below.</p>,
            },
          ]}
        />
      </section>

      <section className="fe05-section" aria-labelledby="disclosure-heading">
        <h2 id="disclosure-heading">Disclosure</h2>
        <p className="fe05-hint">
          Keyboard: Tab to the button, then Enter or Space toggles the content.
        </p>
        <Disclosure title="Why use a real button?">
          <p>
            Native buttons already handle Enter and Space, so this disclosure
            does not attach click handlers to a div.
          </p>
        </Disclosure>
      </section>
    </main>
  )
}

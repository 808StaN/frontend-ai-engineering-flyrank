import { ModalDialog } from './components/ModalDialog'

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
    </main>
  )
}

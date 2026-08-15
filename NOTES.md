# FE-05 – Accessible Component Fundamentals

## Custom implementation

The playground in `playground/` contains three dependency-free React + TypeScript widgets.

**Modal Dialog** (`playground/src/components/ModalDialog.tsx`) uses a `role="dialog"` surface with `aria-modal="true"`, `aria-labelledby`, and optional `aria-describedby`. It portals to `document.body`, moves focus to the first focusable control, traps Tab / Shift+Tab, closes on Escape or the named Close button, marks `#root` as `inert` while open, and restores focus to the opener on unmount.

**Tabs** (`playground/src/components/Tabs.tsx`) follow the WAI-ARIA tabs pattern with `role="tablist"`, `role="tab"`, and `role="tabpanel"`. Tabs and panels are wired with `aria-controls` / `aria-labelledby`. Only the selected tab is in the tab order (`tabIndex={0}`; others `-1`). Arrow keys use **automatic activation**: focusing a tab also selects it. Navigation wraps, and Home / End jump to the first / last tab.

**Disclosure** (`playground/src/components/Disclosure.tsx`) uses a real `<button>` with `aria-expanded` and `aria-controls`. Collapsed content uses the `hidden` attribute. Enter and Space work through native button semantics.

## Keyboard behavior tested

### Modal
- Tab cycles forward through the close button, input, and in-dialog link
- Shift+Tab cycles backward and wraps from the first control to the last
- Focus cannot reach the page behind the dialog
- Escape closes the dialog
- Focus returns to "Open custom dialog"

### Tabs
- Tab enters the selected tab, then the active panel
- ArrowRight / ArrowLeft move and activate, wrapping at both ends
- Home selects the first tab; End selects the last tab

### Disclosure
- Tab lands on the trigger
- Enter and Space toggle the region
- Focus stays on the trigger after toggle

## Comparison with shadcn/ui

shadcn Dialog and Tabs in `playground/src/components/ui/` are thin styled wrappers around `radix-ui` primitives. The custom widgets were not replaced.

### Dialog

`dialog.tsx` re-exports Radix `Dialog`, `Trigger`, `Portal`, `Overlay`, `Content`, `Title`, `Description`, and `Close`. Reading `@radix-ui/react-dialog` shows it composes:

- `FocusScope` for trapped focus and open/close autofocus hooks
- `useFocusGuards()` sentinel nodes around the dialog
- `hideOthers()` from `aria-hidden` so the rest of the tree is hidden from assistive tech
- `RemoveScroll` to lock background scrolling
- `DismissableLayer` for outside pointer / focus dismissal
- Trigger attributes `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`

The generated close control uses a visually hidden `sr-only` "Close" label on an icon button.

### Tabs

`tabs.tsx` wraps Radix Tabs and passes `orientation` through to `data-orientation`. The Radix types in `react-tabs` expose:

- `orientation` so arrow keys switch between left/right and up/down
- `dir` for RTL roving focus
- `activationMode: 'automatic' | 'manual'`
- `TabsList` `loop` via `@radix-ui/react-roving-focus`
- `disabled` on triggers through native button props

## Gaps I found in my implementation

### Gap 1

Radix Dialog installs **focus guards** (`useFocusGuards`) and calls **`hideOthers()`** on the content node. My modal only sets `inert` on `#root`. That works for this demo, but it does not insert sentinel nodes that catch Tab before it leaves the document, and it would miss any sibling portals rendered outside `#root`. Radix also uses `RemoveScroll` instead of toggling `document.body.style.overflow` by hand.

### Gap 2

Radix Tabs is built on **`@radix-ui/react-roving-focus`** with `orientation` and `activationMode`. My tabs only implement horizontal ArrowLeft / ArrowRight and always activate on focus. They have no vertical ArrowUp / ArrowDown path, no RTL `dir` handling, and no `disabled` tab that stays in the list but is skipped by the roving focus group.

## What I learned

Accessible widgets are mostly focus and relationship management, not styling. Native HTML (`button`, `hidden`, labels) already covers a lot of keyboard behavior. The hard parts are the ones libraries spend code on: nested/portaled trees, focus sentinels, orientation, and disabled items inside a composite widget. Implementing the APG patterns by hand made those Radix internals readable instead of magical.

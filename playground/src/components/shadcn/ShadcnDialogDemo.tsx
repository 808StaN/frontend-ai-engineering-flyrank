import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function ShadcnDialogDemo() {
  return (
    <div>
      <p className="fe05-hint">shadcn Dialog (Radix Dialog under the hood)</p>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button">Open shadcn dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>shadcn dialog</DialogTitle>
            <DialogDescription>
              Compare focus restoration, overlay dismissal, and close-button
              labeling with the custom modal above.
            </DialogDescription>
          </DialogHeader>
          <label className="fe05-field" htmlFor="shadcn-name">
            Display name
            <input id="shadcn-name" name="shadcnName" defaultValue="Grace" />
          </label>
        </DialogContent>
      </Dialog>
    </div>
  )
}

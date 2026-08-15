import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

export function ShadcnTabsDemo() {
  return (
    <div>
      <p className="fe05-hint">shadcn Tabs (Radix Tabs under the hood)</p>
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
          <TabsTrigger value="three">Three</TabsTrigger>
        </TabsList>
        <TabsContent value="one">
          Radix Tabs wrap a roving-focus group and support orientation.
        </TabsContent>
        <TabsContent value="two">
          Disabled triggers and vertical arrow keys are handled in Radix, not
          in the custom tabs above.
        </TabsContent>
        <TabsContent value="three">
          Activation can be automatic or manual via activationMode.
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { Chat } from "@/components/chat/chat"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function MycaAiPage() {
  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-10rem)]">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl">Myca AI</CardTitle>
          <CardDescription>Your intelligent assistant for mycology research and data analysis.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <Chat />
        </CardContent>
      </Card>
    </div>
  )
}

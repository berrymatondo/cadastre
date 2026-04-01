"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const suggestedQuestions = [
  "Quelles sont les conditions d'obtention d'un permis d'exploitation minière ?",
  "Quelle est la durée de validité d'un permis de recherche ?",
  "Comment résoudre un conflit foncier dans une zone minière ?",
  "Quelles sont les obligations fiscales d'un titulaire de titre minier ?",
]

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant juridique spécialisé dans le droit minier. Je peux vous aider à comprendre le Code minier, le Règlement minier, et vous accompagner dans vos analyses juridiques. Comment puis-je vous aider ?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (question?: string) => {
    const messageContent = question || input.trim()
    if (!messageContent) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(messageContent),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="bg-card border-border flex flex-col h-[calc(100vh-8rem)] sm:h-[600px]">
      <CardHeader className="border-b border-border px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-foreground text-sm sm:text-base">Assistant IA Juridique</CardTitle>
            <CardDescription className="text-xs sm:text-sm truncate">Posez vos questions sur le droit minier</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-2 sm:gap-3",
              message.role === "user" && "flex-row-reverse"
            )}
          >
            <Avatar className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
              <AvatarFallback className={cn(
                "text-xs",
                message.role === "assistant" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              )}>
                {message.role === "assistant" ? (
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "rounded-lg px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] sm:max-w-[80%]",
                message.role === "assistant"
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 sm:gap-3">
            <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg px-3 py-2 sm:px-4 sm:py-3">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {messages.length === 1 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2 sm:mb-3">Questions suggérées :</p>
            <div className="flex flex-col sm:flex-wrap sm:flex-row gap-2">
              {suggestedQuestions.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 px-3 whitespace-normal text-left justify-start"
                  onClick={() => handleSubmit(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <div className="p-3 sm:p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question juridique..."
            className="min-h-[50px] sm:min-h-[60px] resize-none bg-background text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          <Button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            className="shrink-0"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function generateMockResponse(question: string): string {
  const responses: Record<string, string> = {
    permis: `Selon le Code minier, l'obtention d'un permis d'exploitation minière est soumise aux conditions suivantes :

1. **Capacités techniques** : Le demandeur doit démontrer ses capacités techniques et financières.

2. **Étude de faisabilité** : Une étude de faisabilité approuvée est requise.

3. **Plan environnemental** : Un plan de gestion environnementale et sociale doit être validé.

4. **Caution financière** : Le versement d'une caution pour la réhabilitation du site.

5. **Superficie** : La superficie maximale est définie selon le type de substance.

Je vous recommande de consulter les articles 68 à 85 du Code minier pour plus de détails.`,
    durée: `La durée de validité d'un permis de recherche est définie par le Code minier :

• **Permis de recherche initial** : 4 ans
• **Premier renouvellement** : 3 ans
• **Second renouvellement** : 2 ans

La superficie est réduite de 50% à chaque renouvellement. Le titulaire doit justifier des travaux effectués et des dépenses engagées.`,
    conflit: `La résolution des conflits fonciers dans les zones minières suit plusieurs étapes :

1. **Médiation préalable** : Tentative de conciliation entre les parties.

2. **Commission de règlement** : Saisine de la commission locale de règlement des conflits.

3. **Arbitrage administratif** : Intervention du Cadastre minier et des autorités locales.

4. **Recours juridictionnel** : Saisine des tribunaux compétents en dernier ressort.

Les précédents de jurisprudence montrent que la priorité est généralement donnée aux droits antérieurs dûment établis.`,
    fiscal: `Les obligations fiscales d'un titulaire de titre minier comprennent :

• **Droits superficiaires** : Payables annuellement selon la superficie.
• **Redevance minière** : Calculée sur la valeur des produits extraits (2% à 4% selon les substances).
• **Taxe à l'exportation** : Variable selon les produits.
• **Impôt sur les bénéfices** : Taux applicable au secteur minier.
• **Taxe de développement communautaire** : 0,3% du chiffre d'affaires.

Consultez les articles 220 à 250 du Code minier pour les détails.`,
  }

  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes("permis") && lowerQuestion.includes("exploitation")) {
    return responses.permis
  }
  if (lowerQuestion.includes("durée") || lowerQuestion.includes("validité")) {
    return responses.durée
  }
  if (lowerQuestion.includes("conflit") || lowerQuestion.includes("foncier")) {
    return responses.conflit
  }
  if (lowerQuestion.includes("fiscal") || lowerQuestion.includes("obligations")) {
    return responses.fiscal
  }

  return `Je comprends votre question concernant "${question.substring(0, 50)}...".

Pour vous fournir une réponse précise, je vous suggère de :

1. Consulter les articles pertinents du Code minier via la section dédiée.
2. Vérifier les textes d'application dans le Règlement minier.
3. Examiner les précédents similaires dans la base de jurisprudence.

N'hésitez pas à reformuler votre question ou à préciser le contexte pour une réponse plus détaillée.`
}

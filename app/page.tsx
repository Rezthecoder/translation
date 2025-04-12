"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Languages } from "lucide-react"

export default function TranslationPage() {
  const [inputText, setInputText] = useState("")
  const [targetLang, setTargetLang] = useState("en")
  const [translatedText, setTranslatedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Debug: Log translatedText state inside component
  useEffect(() => {
    console.log("Translated Text has been updated:", translatedText)
  }, [translatedText]) // This will run whenever `translatedText` changes

  async function handleTranslate() {
    if (!inputText.trim()) {
      setError("Please enter text to translate")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          target_lang: targetLang,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Translation error:", data)
        throw new Error(data.message || "Translation failed")
      }

      // console.log("API Response:", data)
      setTranslatedText(data.translatedText)
      console.log("Translated Text State Updated:", data.translatedText)
    } catch (err) {
      // console.error("Error in translation:", err)
      setError(err instanceof Error ? err.message : "Failed to translate text")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-6 w-6" />
            Text Translator
          </CardTitle>
          <CardDescription>
            Enter text and select a language to translate to.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input-text">Text to translate</Label>
            <Input
              id="input-text"
              placeholder="Enter text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-language">Target language</Label>
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger id="target-language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
                <SelectItem value="ne">Nepali</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}

          {translatedText && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="translated-text">Translation</Label>
              <div className="rounded-md border border-dashed border-gray-400 p-4 bg-yellow-100 text-black min-h-[40px]">
                <p id="translated-text" className="whitespace-pre-line font-semibold">
                  {translatedText || "No translation yet..."}
                </p>
              </div>
            </div>
          )}
          {translatedText}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 disabled:opacity-50"
            onClick={handleTranslate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              "Translate"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

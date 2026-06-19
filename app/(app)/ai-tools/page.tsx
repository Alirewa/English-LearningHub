"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Note: using @base-ui/react Tabs — value prop on TabsTrigger acts as tab id
import {
  Sparkles, MessageSquare, CheckCircle2, BookOpen,
  Zap, Loader2, Copy, RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

interface AIResult {
  type: string;
  content: string;
}

async function callAI(prompt: string, systemPrompt: string): Promise<string> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, systemPrompt }),
  });
  if (!res.ok) throw new Error("AI request failed");
  const data = await res.json();
  return data.result;
}

function ResultCard({ result, onCopy }: { result: AIResult; onCopy: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{result.type}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 text-muted-foreground"
          onClick={onCopy}
          title="کپی نتیجه"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>
      </div>
      <div className="prose prose-sm prose-invert max-w-none">
        <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans bg-transparent p-0 m-0">
          {result.content}
        </pre>
      </div>
    </motion.div>
  );
}

function SentenceExplainer() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!input.trim()) { toast.error("اول یه جمله وارد کن"); return; }
    setLoading(true);
    try {
      const content = await callAI(
        input,
        `You are an English language expert. Analyze the given sentence and provide:
1. **Meaning**: What does this sentence mean?
2. **Grammar Breakdown**: Identify each grammatical element (subject, verb, object, tense, clauses, etc.)
3. **Vocabulary**: Explain any advanced or uncommon words
4. **Usage Context**: When and how is this sentence typically used?
Keep your response clear, educational, and helpful for English learners.`
      );
      setResult({ type: "تحلیل جمله", content });
    } catch {
      toast.error("درخواست هوش مصنوعی ناموفق بود. تنظیمات API رو بررسی کن.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">جمله‌ای برای تحلیل وارد کن</label>
        <Textarea
          placeholder='e.g. "Had I known about the meeting, I would have attended it."'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={analyze} disabled={loading || !input.trim()} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? "در حال تحلیل..." : "تحلیل جمله"}
        </Button>
        {result && (
          <Button variant="ghost" size="icon" onClick={() => setResult(null)} title="پاک کردن">
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
      {result && (
        <ResultCard
          result={result}
          onCopy={() => { navigator.clipboard.writeText(result.content); toast.success("کپی شد!"); }}
        />
      )}
    </div>
  );
}

function GrammarChecker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!input.trim()) { toast.error("متنی برای بررسی وارد کن"); return; }
    setLoading(true);
    try {
      const content = await callAI(
        input,
        `You are a professional English grammar checker and writing coach. Review the given text and:
1. **Grammar Errors**: List each error with the incorrect text, explanation, and correction
2. **Corrected Version**: Provide the full corrected text
3. **Writing Tips**: Give 2-3 specific tips to improve this text
4. **Overall Assessment**: Rate the text (Beginner/Intermediate/Advanced) and give encouragement

Be specific, educational, and supportive.`
      );
      setResult({ type: "بررسی گرامر", content });
    } catch {
      toast.error("درخواست هوش مصنوعی ناموفق بود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">متن برای بررسی وارد کن</label>
        <Textarea
          placeholder="متن انگلیسی‌ت رو برای بررسی گرامر اینجا بذار..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={check} disabled={loading || !input.trim()} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          {loading ? "در حال بررسی..." : "بررسی گرامر"}
        </Button>
        {result && (
          <Button variant="ghost" size="icon" onClick={() => setResult(null)}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
      {result && (
        <ResultCard
          result={result}
          onCopy={() => { navigator.clipboard.writeText(result.content); toast.success("کپی شد!"); }}
        />
      )}
    </div>
  );
}

function VocabGenerator() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) { toast.error("یه موضوع وارد کن"); return; }
    setLoading(true);
    try {
      const content = await callAI(
        topic,
        `You are an English vocabulary expert. For the given topic, generate 10 useful vocabulary words. For each word provide:
- **Word**: The English word
- **Pronunciation**: IPA pronunciation
- **Meaning**: Clear definition
- **Example**: A practical example sentence
- **Difficulty**: Easy / Medium / Hard

Format it neatly and make it educational for intermediate English learners.`
      );
      setResult({ type: `واژگان: ${topic}`, content });
    } catch {
      toast.error("درخواست هوش مصنوعی ناموفق بود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">موضوع یا زمینه</label>
        <Textarea
          placeholder='مثلاً «جلسات کاری»، «واژگان سفر»، «اصطلاحات پزشکی»...'
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={2}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={generate} disabled={loading || !topic.trim()} className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
          {loading ? "در حال ساخت..." : "ساخت واژگان"}
        </Button>
        {result && (
          <Button variant="ghost" size="icon" onClick={() => setResult(null)}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
      {result && (
        <ResultCard
          result={result}
          onCopy={() => { navigator.clipboard.writeText(result.content); toast.success("کپی شد!"); }}
        />
      )}
    </div>
  );
}

function DailyChallenge() {
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const today = new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });
      const content = await callAI(
        today,
        `You are an English learning coach. Create an engaging daily English challenge for ${today}. Include:

1. **Word of the Day**: One advanced English word with pronunciation, definition, and 3 example sentences
2. **Grammar Exercise**: One grammar challenge with a question and explanation of the answer
3. **Speaking Challenge**: One speaking prompt to practice for 2 minutes
4. **Writing Prompt**: One creative writing prompt (50-100 words)
5. **Idiom of the Day**: One common English idiom with meaning and example

Make it fun, practical, and suitable for intermediate English learners.`
      );
      setResult({ type: `چالش روزانه — ${today}`, content });
    } catch {
      toast.error("درخواست هوش مصنوعی ناموفق بود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">چالش روزانه انگلیسی</h3>
            <p className="text-sm text-muted-foreground">
              یه چالش شخصی‌سازی‌شده برای امروز با تمرین‌های واژگان، گرامر، صحبت و نوشتن بگیر
            </p>
          </div>
        </div>
        <Button onClick={generate} disabled={loading} className="gap-2 w-full sm:w-auto">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {loading ? "در حال ساخت چالش..." : "ساخت چالش امروز"}
        </Button>
      </div>
      {result && (
        <ResultCard
          result={result}
          onCopy={() => { navigator.clipboard.writeText(result.content); toast.success("کپی شد!"); }}
        />
      )}
    </div>
  );
}

function AIConversation() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    const newMessages = [...messages, { role: "user" as const, content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const conversationHistory = newMessages
        .map((m) => `${m.role === "user" ? "Student" : "Teacher"}: ${m.content}`)
        .join("\n");
      const content = await callAI(
        conversationHistory,
        `You are a friendly and encouraging English language conversation partner and teacher.
Your goal is to help the student practice English conversation naturally.
- Respond naturally to what they say
- Gently correct any grammar mistakes in brackets like [correction: ...]
- Introduce new vocabulary when appropriate
- Ask follow-up questions to keep the conversation going
- Be encouraging and supportive
Always respond as the Teacher character.`
      );
      setMessages([...newMessages, { role: "ai", content }]);
    } catch {
      toast.error("درخواست هوش مصنوعی ناموفق بود");
      setMessages(newMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <MessageSquare className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">همراه مکالمه هوش مصنوعی</p>
          <p className="text-xs text-muted-foreground">با هوش مصنوعی مکالمه انگلیسی تمرین کن. اشتباه‌ها با ملایمت اصلاح می‌شن.</p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-muted-foreground"
            onClick={() => setMessages([])}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            شروع دوباره
          </Button>
        )}
      </div>

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}>
                  {msg.role === "user" ? "تو" : "AI"}
                </div>
                <div className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground"
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-bold">
                AI
              </div>
              <div className="rounded-2xl px-4 py-3 bg-card border border-border">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <Textarea
          placeholder={messages.length === 0 ? 'مکالمه رو به انگلیسی شروع کن... مثلاً "Hello! Can you help me practice my English?"' : "پیامت رو بنویس..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={2}
          className="flex-1 resize-none"
          disabled={loading}
        />
        <Button onClick={send} disabled={loading || !input.trim()} className="self-end">
          ارسال
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Enter برای ارسال، Shift+Enter برای خط جدید</p>
    </div>
  );
}

export default function AIToolsPage() {
  return (
    <div>
      <Header title="ابزارهای هوش مصنوعی" subtitle="قدرت‌گرفته از Claude AI" />

      <div className="p-6 max-w-3xl mx-auto">
        <Tabs defaultValue="explainer">
          <TabsList className="mb-6 flex flex-wrap h-auto gap-1 bg-muted p-1">
            <TabsTrigger value="explainer" className="gap-1.5 text-xs">
              <MessageSquare className="w-3.5 h-3.5" />
              تحلیل جمله
            </TabsTrigger>
            <TabsTrigger value="grammar" className="gap-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              بررسی گرامر
            </TabsTrigger>
            <TabsTrigger value="vocab" className="gap-1.5 text-xs">
              <BookOpen className="w-3.5 h-3.5" />
              ساخت واژگان
            </TabsTrigger>
            <TabsTrigger value="challenge" className="gap-1.5 text-xs">
              <Zap className="w-3.5 h-3.5" />
              چالش روزانه
            </TabsTrigger>
            <TabsTrigger value="conversation" className="gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              مکالمه هوش مصنوعی
            </TabsTrigger>
          </TabsList>
          <TabsContent value="explainer" keepMounted={false}><SentenceExplainer /></TabsContent>
          <TabsContent value="grammar" keepMounted={false}><GrammarChecker /></TabsContent>
          <TabsContent value="vocab" keepMounted={false}><VocabGenerator /></TabsContent>
          <TabsContent value="challenge" keepMounted={false}><DailyChallenge /></TabsContent>
          <TabsContent value="conversation" keepMounted={false}><AIConversation /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

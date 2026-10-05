import * as React from "react"

const KEYWORDS = new Set([
  "import",
  "export",
  "from",
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "type",
  "interface",
  "async",
  "await",
  "new",
  "true",
  "false",
  "null",
  "undefined",
  "as",
])

const TOKEN_CLASS: Record<string, string> = {
  keyword: "text-[#569cd6]",
  string: "text-[#ce9178]",
  comment: "text-[#6a9955]",
  number: "text-[#b5cea8]",
  tag: "text-[#4ec9b0]",
  attr: "text-[#9cdcfe]",
  fn: "text-[#dcdcaa]",
  punct: "text-[#d4d4d4]",
  plain: "text-[#d4d4d4]",
}

type Token = { kind: keyof typeof TOKEN_CLASS; text: string }

function tokenizeLine(line: string, language: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const isTs = language === "ts" || language === "tsx" || language === "js"

  while (i < line.length) {
    const rest = line.slice(i)

    if (/^\s+/.test(rest)) {
      const m = rest.match(/^\s+/)!
      tokens.push({ kind: "plain", text: m[0] })
      i += m[0].length
      continue
    }

    if (isTs && /^\/\/.*$/.test(rest)) {
      tokens.push({ kind: "comment", text: rest })
      break
    }

    if (/^["'`]/.test(rest)) {
      const q = rest[0]
      let j = 1
      while (j < rest.length) {
        if (rest[j] === "\\") {
          j += 2
          continue
        }
        if (rest[j] === q) {
          j += 1
          break
        }
        j += 1
      }
      tokens.push({ kind: "string", text: rest.slice(0, j) })
      i += j
      continue
    }

    if (language === "tsx" && /^<\/?[A-Za-z]/.test(rest)) {
      const m = rest.match(/^<\/?[A-Za-z][\w.]*/)!
      tokens.push({ kind: "tag", text: m[0] })
      i += m[0].length
      continue
    }

    if (/^[0-9]+/.test(rest)) {
      const m = rest.match(/^[0-9]+/)!
      tokens.push({ kind: "number", text: m[0] })
      i += m[0].length
      continue
    }

    if (/^[A-Za-z_$][\w$]*/.test(rest)) {
      const m = rest.match(/^[A-Za-z_$][\w$]*/)!
      const word = m[0]
      let kind: Token["kind"] = "plain"
      if (KEYWORDS.has(word)) kind = "keyword"
      else if (language === "tsx" && /^[A-Z]/.test(word)) kind = "tag"
      else if (rest[word.length] === "(") kind = "fn"
      else if (language === "tsx" && rest[word.length] === "=") kind = "attr"
      else if (language === "tsx" && tokens.at(-1)?.text === "<") kind = "tag"
      tokens.push({ kind, text: word })
      i += word.length
      continue
    }

    tokens.push({ kind: "punct", text: rest[0] })
    i += 1
  }

  return tokens
}

export function HighlightedCode({
  code,
  language,
}: {
  code: string
  language: string
}) {
  const lines = code.split("\n")

  return (
    <code className="block font-mono text-[0.8125rem] leading-[1.55] tracking-normal [font-variant-numeric:normal] [font-feature-settings:normal]">
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="flex min-h-[1.55em]">
          <span className="w-8 shrink-0 select-none pe-3 text-end text-xs tracking-normal text-[#858585]">
            {lineIndex + 1}
          </span>
          <span className="min-w-0 flex-1 whitespace-pre">
            {tokenizeLine(line, language).map((token, tokenIndex) => (
              <span key={tokenIndex} className={TOKEN_CLASS[token.kind]}>
                {token.text}
              </span>
            ))}
          </span>
        </div>
      ))}
    </code>
  )
}

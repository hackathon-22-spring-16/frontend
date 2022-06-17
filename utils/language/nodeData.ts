import { foldNodeProp, foldInside, indentNodeProp, LRLanguage, LanguageSupport } from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'
import { parser } from './output/syntax'

const parserWithMetadata = parser.configure({
  props: [
    styleTags({
      PtrIdentifier: t.logicOperator,
      ValueIdentifier: t.arithmeticOperator,
      TurtleIdentifier: t.keyword,
      LineComment: t.lineComment,
      BlockComment: t.blockComment,
      "[ ]": t.squareBracket,
    }),
    indentNodeProp.add({
      Application: context => context.column(context.node.from) + context.unit
    }),
    foldNodeProp.add({
      Application: foldInside,
    }),
  ]
})

export const language = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: {
      line: '#',
      block: ['{', '}'],
    },
  }
})

export function getSupport() {
  return new LanguageSupport(language)
}

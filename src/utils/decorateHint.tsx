import nlp from "compromise";
import React from "react";

///  Finds a word in the hint that starts with the given term
const findMatchingWord = (term: string, hint: string): { matchIndex: number, matchedWord: string } => {
  const hintWords = hint.toLowerCase().split(/\s+/);
  let matchIndex = -1;
  let matchedWord = '';

  for (let i = 0; i < hintWords.length; i++) {
    const cleanWord = hintWords[i].replace(/[^\w]/g, '');
    if (cleanWord.startsWith(term.toLowerCase())) {
      const startPos = hint.toLowerCase().indexOf(cleanWord);
      if (startPos !== -1) {
        matchIndex = startPos;
        matchedWord = hint.substring(startPos, startPos + cleanWord.length);
        break;
      }
    }
  }

  return { matchIndex, matchedWord };
};

// Creates a JSX element with the matched word highlighted

const createHighlightedText = (hint: string, matchIndex: number, matchedWord: string): React.JSX.Element => {
  const beforeMatch = hint.substring(0, matchIndex);
  const afterMatch = hint.substring(matchIndex + matchedWord.length);

  return (
    <p>
      {beforeMatch}
      <b>{matchedWord}</b>
      {afterMatch}
    </p>
  );
};

// Extracts relevant terms from a word based on its part of speech

const extractRelevantTerms = (word: string): string[] => {
  const wordDoc = nlp(word);
  const isVerb = wordDoc.verbs().text() !== '';
  const isNoun = wordDoc.nouns().text() !== '';

  if (isVerb || isNoun) {
    const terms = wordDoc.terms().out('array');
    return terms.filter((term: string) => {
      const termDoc = nlp(term);
      return !termDoc.prepositions().text();
    });
  }

  return [];
};

// Decorates a hint by highlighting words that match the given word

export const decorateHint = (word: string, hint: string): React.JSX.Element => {
  if (!hint) {
    return <></>;
  }

  // Try to match based on parts of speech analysis
  const relevantTerms = extractRelevantTerms(word);
  if (relevantTerms.length > 0) {
    for (const term of relevantTerms) {
      const { matchIndex, matchedWord } = findMatchingWord(term, hint);
      if (matchIndex !== -1) {
        return createHighlightedText(hint, matchIndex, matchedWord);
      }
    }
  }

  // Try direct matching with the whole word
  const { matchIndex, matchedWord } = findMatchingWord(word, hint);
  if (matchIndex !== -1) {
    return createHighlightedText(hint, matchIndex, matchedWord);
  }

  // If no match found, return plain text
  return <p>{hint}</p>;
}

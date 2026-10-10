class Token {
  constructor(type, value, position) {
    this.type = type;      // 'TAG_OPEN', 'TAG_CLOSE', 'SELF_CLOSE', 'TEXT'
    this.value = value;    // Tag name or text content
    this.position = position;
  }
}

class MiniMarkupLexer {
  /** Lexical Analyzer: Scans raw text and produces tokens using Regex */
  tokenize(code) {
    const tokens = [];
    // Group 1: Self-Closing, Group 2: Closing Tag, Group 3: Opening Tag, Group 4: Text Content
    const regex = /<\s*([a-zA-Z0-9]+)\s*\/>|<\s*\/\s*([a-zA-Z0-9]+)\s*>|<\s*([a-zA-Z0-9]+)\s*>|([^<]+)/g;
    let match;

    while ((match = regex.exec(code)) !== null) {
      const pos = match.index;
      if (match[1]) {
        tokens.push(new Token('SELF_CLOSE', match[1], pos));
      } else if (match[2]) {
        tokens.push(new Token('TAG_CLOSE', match[2], pos));
      } else if (match[3]) {
        tokens.push(new Token('TAG_OPEN', match[3], pos));
      } else if (match[4]) {
        const cleanText = match[4].trim();
        if (cleanText) {
          tokens.push(new Token('TEXT', cleanText, pos));
        }
      }
    }

    return tokens;
  }
}

class PushdownAutomatonParser {
  /** PDA Parser Engine: Validates nested tag structure using array stack */
  constructor() {
    this.bottomOfStack = "Z0";
    this.stack = [this.bottomOfStack]; // Initialize stack with Z0 symbol
  }

  parse(tokens) {
    console.log(`\n${'STEP'.padEnd(6)} | ${'INPUT TOKEN'.padEnd(25)} | ${'STACK STATE'.padEnd(30)} | ${'ACTION'.padEnd(20)}`);
    console.log('-'.repeat(88));

    let step = 1;
    for (const token of tokens) {
      const currentStack = JSON.stringify(this.stack);
      let action = '';

      if (token.type === 'TAG_OPEN') {
        // Transition: Push tag name onto stack
        this.stack.push(token.value);
        action = `PUSH('${token.value}')`;

      } else if (token.type === 'TAG_CLOSE') {
        const topSymbol = this.stack[this.stack.length - 1];

        // Check for empty tag stack (Orphan closing tag)
        if (topSymbol === this.bottomOfStack) {
          console.log(`${String(step).padEnd(6)} | ${`Token(${token.type}, '${token.value}')`.padEnd(25)} | ${currentStack.padEnd(30)} | REJECT (Orphan Tag)`);
          return { isValid: false, message: `Syntax Error at pos ${token.position}: Unexpected closing tag '</${token.value}>' with no matching open tag.` };
        }

        // Check if closing tag matches current top of stack
        if (topSymbol === token.value) {
          this.stack.pop();
          action = `POP('${token.value}')`;
        } else {
          console.log(`${String(step).padEnd(6)} | ${`Token(${token.type}, '${token.value}')`.padEnd(25)} | ${currentStack.padEnd(30)} | REJECT (Tag Mismatch)`);
          return { isValid: false, message: `Syntax Error at pos ${token.position}: Mismatched tag. Expected '</${topSymbol}>', found '</${token.value}>'.` };
        }

      } else if (token.type === 'SELF_CLOSE' || token.type === 'TEXT') {
        // Neutral tokens do not modify stack memory
        action = 'IGNORE (No Stack Change)';
      }

      console.log(`${String(step).padEnd(6)} | ${`Token(${token.type}, '${token.value}')`.padEnd(25)} | ${currentStack.padEnd(30)} | ${action.padEnd(20)}`);
      step++;
    }

    // Final Acceptance Verification
    const finalStack = JSON.stringify(this.stack);
    if (this.stack.length === 1 && this.stack[0] === this.bottomOfStack) {
      console.log(`${String(step).padEnd(6)} | ${'EOF'.padEnd(25)} | ${finalStack.padEnd(30)} | ACCEPT`);
      return { isValid: true, message: 'Valid Markup Structure!' };
    } else {
      const unclosedTag = this.stack[this.stack.length - 1];
      console.log(`${String(step).padEnd(6)} | ${'EOF'.padEnd(25)} | ${finalStack.padEnd(30)} | REJECT (Unclosed Tags)`);
      return { isValid: false, message: `Syntax Error: Document ended with unclosed tag '<${unclosedTag}>'.` };
    }
  }
}

// --- Test Suite Execution ---
const lexer = new MiniMarkupLexer();

const testCases = [
  "<html><body><h1>Hello</h1><br/></body></html>",         // Valid
  "<div><p>Hello</div></p>",                             // Invalid: Misnested
  "<p>Hello",                                           // Invalid: Unclosed
  "Hello </p>",                                         // Invalid: Orphan
  "<div><img/><span>Text</span></div>"                  // Valid with self-closing
];

testCases.forEach((test, index) => {
  console.log(`\n=================== TEST CASE ${index + 1} ===================`);
  console.log(`Input Code: ${test}`);

  const tokens = lexer.tokenize(test);
  const parser = new PushdownAutomatonParser();
  const result = parser.parse(tokens);

  console.log(`Result: ${result.message}`);
});
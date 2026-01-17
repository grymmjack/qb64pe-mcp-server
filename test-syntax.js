const fs = require('fs');
const path = require('path');

const syntaxDir = '/home/grymmjack/git/qb64pe-vscode/syntaxes';
const mainGrammarPath = path.join(syntaxDir, 'qb64pe.tmLanguage.json');
const keywordsGrammarPath = path.join(syntaxDir, 'qb64pe-keywords.tmLanguage.json');

console.log('Reading main grammar file...');
try {
  const content = fs.readFileSync(mainGrammarPath, 'utf8');
  console.log('File size:', content.length, 'characters');
  const grammar = JSON.parse(content);
  console.log('Successfully parsed JSON');
  console.log('Has patterns:', !!grammar.patterns);
  console.log('Patterns count:', grammar.patterns ? grammar.patterns.length : 0);
} catch (error) {
  console.error('Error:', error.message);
}

console.log('\nReading keywords grammar file...');
try {
  const content = fs.readFileSync(keywordsGrammarPath, 'utf8');
  console.log('File size:', content.length, 'characters');
  const grammar = JSON.parse(content);
  console.log('Successfully parsed JSON');
  console.log('Has match:', !!grammar.match);
  console.log('Match length:', grammar.match ? grammar.match.length : 0);
} catch (error) {
  console.error('Error:', error.message);
}
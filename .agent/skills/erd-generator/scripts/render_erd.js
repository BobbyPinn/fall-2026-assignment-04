// Validates a Mermaid ERD file and compiles it to an SVG.
// Usage: node .agent/skills/erd-generator/scripts/render_erd.js docs/architecture/schema.mmd
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const input = process.argv[2] || 'docs/architecture/schema.mmd';
const output = path.join(path.dirname(input), 'erd.svg');

// Make sure the input file actually exists
if (!existsSync(input)) {
  console.log(`SYNTAX_ERROR: input file not found: ${input}`);
  process.exit(1);
}

// Run the Mermaid CLI (mmdc) to compile the .mmd file into an .svg
const result = spawnSync('npx', ['mmdc', '-i', input, '-o', output], {
  encoding: 'utf-8',
});

// If mmdc failed, report the error and exit with code 1
if (result.status !== 0 || result.error) {
  const trace = result.stderr || result.stdout || String(result.error);
  console.log(`SYNTAX_ERROR: ${trace}`);
  process.exit(1);
}

console.log('SUCCESS');
process.exit(0);
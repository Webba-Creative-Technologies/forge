#!/usr/bin/env node

import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync, readdirSync, statSync, rmSync } from 'fs'
import { resolve, dirname, join, relative } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = resolve(__dirname, '..')
const pkg = JSON.parse(readFileSync(join(pkgRoot, 'package.json'), 'utf8'))
const VERSION = pkg.version

const args = process.argv.slice(2)
const command = args[0]
const flags = new Set(args.slice(1).filter(a => a.startsWith('--') || a.startsWith('-')))

const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
}
const check = `${c.green}✓${c.reset}`
const cross = `${c.red}✗${c.reset}`
const dot = `${c.cyan}●${c.reset}`
const warn = `${c.yellow}!${c.reset}`

function prompt(question) {
  return new Promise(resolveP => {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    rl.question(question, ans => {
      rl.close()
      resolveP(ans.trim().toLowerCase())
    })
  })
}

function countFiles(dir) {
  let n = 0
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) n += countFiles(full)
    else n += 1
  }
  return n
}

async function init() {
  const projectRoot = process.cwd()
  const skillsSrc = resolve(pkgRoot, 'skills')
  const skillsDest = join(projectRoot, '.claude', 'skills')
  const forgeDest = join(skillsDest, 'forge')

  if (!existsSync(skillsSrc)) {
    console.error(`${cross} Skills source not found inside wss3-forge. Reinstall the package.`)
    process.exit(1)
  }

  console.log(`${c.bold}Forge skill installer${c.reset} ${c.dim}v${VERSION}${c.reset}`)
  console.log('')

  const force = flags.has('--force') || flags.has('--yes') || flags.has('-y')
  if (existsSync(forgeDest) && !force) {
    const answer = await prompt(`${warn} .claude/skills/forge/ already exists. Overwrite? (y/N) `)
    if (answer !== 'y' && answer !== 'yes') {
      console.log(`${c.gray}Skipped. Nothing was modified.${c.reset}`)
      process.exit(0)
    }
    rmSync(forgeDest, { recursive: true, force: true })
  } else if (existsSync(forgeDest)) {
    rmSync(forgeDest, { recursive: true, force: true })
  }

  console.log(`${dot} Installing skill into ${c.cyan}.claude/skills/forge/${c.reset}`)
  mkdirSync(skillsDest, { recursive: true })
  cpSync(skillsSrc, skillsDest, { recursive: true })

  writeFileSync(join(forgeDest, '.version'), VERSION + '\n', 'utf8')

  const fileCount = countFiles(forgeDest)
  console.log(`${check} Copied ${fileCount} files`)
  console.log(`${check} Skill version: ${VERSION}`)
  console.log('')
  console.log(`${c.bold}Next steps${c.reset}`)
  console.log(`  1. Wrap your app in ${c.cyan}<ForgeProvider mode="dark">${c.reset}`)
  console.log(`  2. Import CSS:`)
  console.log(`       ${c.gray}import 'wss3-forge/styles/animations.css'${c.reset}`)
  console.log(`       ${c.gray}import 'wss3-forge/styles/motion.css'${c.reset}`)
  console.log(`  3. In Claude Code, type ${c.cyan}/forge${c.reset} to invoke the skill`)
}

async function upgrade() {
  const projectRoot = process.cwd()
  const forgeDest = join(projectRoot, '.claude', 'skills', 'forge')
  const versionFile = join(forgeDest, '.version')

  if (!existsSync(forgeDest)) {
    console.log(`${warn} No existing skill at .claude/skills/forge/. Run ${c.cyan}npx wss3-forge init${c.reset} first.`)
    process.exit(1)
  }

  let installed = 'unknown'
  if (existsSync(versionFile)) {
    installed = readFileSync(versionFile, 'utf8').trim()
  }

  console.log(`${c.bold}Forge skill upgrade${c.reset}`)
  console.log(`  installed: ${c.gray}${installed}${c.reset}`)
  console.log(`  package:   ${c.gray}${VERSION}${c.reset}`)
  console.log('')

  if (installed === VERSION && !flags.has('--force')) {
    console.log(`${check} Skill is already at v${VERSION}. Nothing to do.`)
    console.log(`${c.gray}(use --force to re-copy anyway)${c.reset}`)
    process.exit(0)
  }

  rmSync(forgeDest, { recursive: true, force: true })
  const skillsSrc = resolve(pkgRoot, 'skills')
  cpSync(skillsSrc, join(projectRoot, '.claude', 'skills'), { recursive: true })
  writeFileSync(versionFile, VERSION + '\n', 'utf8')

  console.log(`${check} Skill upgraded to v${VERSION}`)
}

function findInTree(dir, pattern) {
  try {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue
      const full = join(dir, entry)
      const s = statSync(full)
      if (s.isDirectory()) {
        const hit = findInTree(full, pattern)
        if (hit) return hit
      } else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(entry)) {
        const content = readFileSync(full, 'utf8')
        if (pattern.test(content)) return full
      }
    }
  } catch {
    // ignore
  }
  return null
}

function doctor() {
  const projectRoot = process.cwd()
  console.log(`${c.bold}Forge doctor${c.reset} ${c.dim}v${VERSION}${c.reset}`)
  console.log('')

  let ok = 0
  let issues = 0

  const forgeDest = join(projectRoot, '.claude', 'skills', 'forge')
  if (existsSync(forgeDest)) {
    const versionFile = join(forgeDest, '.version')
    const installed = existsSync(versionFile) ? readFileSync(versionFile, 'utf8').trim() : '(older install)'
    if (installed === VERSION) {
      console.log(`${check} Skill installed (v${installed})`)
      ok++
    } else {
      console.log(`${warn} Skill installed (v${installed}), package is v${VERSION}. Run ${c.cyan}npx wss3-forge upgrade${c.reset}`)
      issues++
    }
  } else {
    console.log(`${cross} Skill not installed. Run ${c.cyan}npx wss3-forge init${c.reset}`)
    issues++
  }

  const srcDir = join(projectRoot, 'src')
  if (existsSync(srcDir)) {
    const foundProvider = findInTree(srcDir, /ForgeProvider/)
    if (foundProvider) {
      console.log(`${check} ForgeProvider found in ${c.gray}${relative(projectRoot, foundProvider).replace(/\\/g, '/')}${c.reset}`)
      ok++
    } else {
      console.log(`${cross} ForgeProvider not found in src/. Wrap your app in <ForgeProvider>.`)
      issues++
    }

    const foundAnimations = findInTree(srcDir, /wss3-forge\/styles\/animations\.css/)
    const foundMotion = findInTree(srcDir, /wss3-forge\/styles\/motion\.css/)
    if (foundAnimations) { console.log(`${check} animations.css imported`); ok++ }
    else { console.log(`${warn} animations.css not imported. Add: ${c.gray}import 'wss3-forge/styles/animations.css'${c.reset}`); issues++ }
    if (foundMotion) { console.log(`${check} motion.css imported`); ok++ }
    else { console.log(`${warn} motion.css not imported. Add: ${c.gray}import 'wss3-forge/styles/motion.css'${c.reset}`); issues++ }
  } else {
    console.log(`${c.gray}- src/ not found, skipping source checks${c.reset}`)
  }

  console.log('')
  if (issues === 0) {
    console.log(`${check} All checks passed (${ok}/${ok}).`)
  } else {
    console.log(`${warn} ${issues} issue(s) to resolve. ${ok} check(s) passed.`)
    process.exit(1)
  }
}

function help() {
  console.log(`${c.bold}wss3-forge${c.reset} ${c.dim}v${VERSION}${c.reset}`)
  console.log('')
  console.log('Usage:')
  console.log(`  ${c.cyan}npx wss3-forge init${c.reset}      Install the /forge skill into .claude/skills/`)
  console.log(`  ${c.cyan}npx wss3-forge upgrade${c.reset}   Re-sync the skill after updating wss3-forge`)
  console.log(`  ${c.cyan}npx wss3-forge doctor${c.reset}    Check that Forge is set up correctly`)
  console.log('')
  console.log('Flags:')
  console.log(`  ${c.gray}--force, --yes, -y${c.reset}    Skip the overwrite prompt on init / upgrade`)
}

switch (command) {
  case 'init':
    init().catch(err => { console.error(cross, err.message); process.exit(1) })
    break
  case 'upgrade':
    upgrade().catch(err => { console.error(cross, err.message); process.exit(1) })
    break
  case 'doctor':
    doctor()
    break
  default:
    help()
}

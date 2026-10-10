// Creates labels, issues and a tracking epic in njange/GetAid from issues.mjs.
//
//   node docs/issues/create-issues.mjs --dry-run   # print what would be created
//   node docs/issues/create-issues.mjs             # create (uses GITHUB_TOKEN, else `gh auth token`)
//
// Safe to rerun: issues whose exact title already exists are reused, not duplicated.

import { execSync } from "node:child_process";
import { labels, issues, epic } from "./issues.mjs";

const REPO = process.env.REPO || "njange/GetAid";
const DRY_RUN = process.argv.includes("--dry-run");
const API = `https://api.github.com/repos/${REPO}`;

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execSync("gh auth token", { encoding: "utf8" }).trim();
  } catch {
    throw new Error("Set GITHUB_TOKEN or install the GitHub CLI and run `gh auth login`.");
  }
}

const token = DRY_RUN ? null : getToken();

async function gh(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok && res.status !== 422) {
    throw new Error(`${method} ${path} → ${res.status} ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}

async function existingIssuesByTitle() {
  const byTitle = new Map();
  for (let page = 1; ; page++) {
    const batch = await gh("GET", `/issues?state=all&per_page=100&page=${page}`);
    if (!batch.length) break;
    for (const i of batch) if (!i.pull_request) byTitle.set(i.title, i.number);
  }
  return byTitle;
}

function resolveRefs(body, numbers) {
  return body.replace(/\{\{([A-Z-]+)\}\}/g, (_, key) => {
    if (!numbers.has(key)) throw new Error(`Unresolved reference {{${key}}} — reorder issues.mjs`);
    return `#${numbers.get(key)}`;
  });
}

async function main() {
  const numbers = new Map();

  if (DRY_RUN) {
    issues.forEach((issue, i) => numbers.set(issue.key, `DRY${i + 1}`));
    for (const issue of issues) {
      resolveRefs(issue.body, numbers);
      console.log(`[${issue.labels.join(", ")}] ${issue.title}`);
    }
    console.log(`\n${labels.length} labels, ${issues.length} issues + 1 epic would be created in ${REPO}.`);
    return;
  }

  for (const label of labels) {
    await gh("POST", "/labels", label); // 422 = already exists
  }

  const existing = await existingIssuesByTitle();

  for (const issue of issues) {
    if (existing.has(issue.title)) {
      numbers.set(issue.key, existing.get(issue.title));
      console.log(`exists  #${existing.get(issue.title)} ${issue.title}`);
      continue;
    }
    const created = await gh("POST", "/issues", {
      title: issue.title,
      body: resolveRefs(issue.body, numbers),
      labels: issue.labels,
    });
    numbers.set(issue.key, created.number);
    console.log(`created #${created.number} ${issue.title}`);
  }

  const checklist = issues.map((i) => `- [ ] #${numbers.get(i.key)}`).join("\n");
  if (existing.has(epic.title)) {
    console.log(`exists  #${existing.get(epic.title)} ${epic.title}`);
  } else {
    const created = await gh("POST", "/issues", {
      title: epic.title,
      body: `${epic.intro}\n## Open work\n${checklist}`,
      labels: epic.labels,
    });
    console.log(`created #${created.number} ${epic.title}`);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

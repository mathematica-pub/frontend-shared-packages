import CDP from 'chrome-remote-interface';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const stage = process.argv[2];
const route = process.argv[3];
const runCount = Number(process.argv[4] ?? 20);
const port = Number(process.env.CDP_PORT ?? 9222);

if (!['baseline', 'post-change'].includes(stage) || !route) {
  throw new Error(
    'Usage: node scripts/capture-bar-label-performance.mjs <baseline|post-change> <route> [run-count]'
  );
}

const client = await CDP({ port });
const { Page, Runtime, Tracing } = client;
const outputDirectory = path.resolve(
  'specs/001-improve-bar-label-performance/traces',
  stage
);

await fs.mkdir(outputDirectory, { recursive: true });
await Promise.all([Page.enable(), Runtime.enable()]);

async function evaluate(expression) {
  const result = await Runtime.evaluate({
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }
  return result.result.value;
}

async function waitFor(expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      if (await evaluate(expression)) {
        return;
      }
    } catch {
      // Navigation briefly destroys the execution context.
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

async function clickButton(buttonText) {
  await evaluate(`(() => {
    const button = [...document.querySelectorAll('app-bars-example button')]
      .find((candidate) => candidate.textContent.trim() === ${JSON.stringify(buttonText)});
    if (!button) throw new Error('Button not found: ${buttonText}');
    button.click();
    return true;
  })()`);
}

async function captureTrace(trigger) {
  const events = [];
  const onData = ({ value }) => events.push(...value);
  client.on('Tracing.dataCollected', onData);
  await Tracing.start({
    categories: 'devtools.timeline,blink.user_timing,toplevel',
    transferMode: 'ReportEvents',
  });
  try {
    await trigger();
  } finally {
    const complete = new Promise((resolve) =>
      client.once('Tracing.tracingComplete', resolve)
    );
    await Tracing.end();
    await complete;
    client.removeListener('Tracing.dataCollected', onData);
  }
  return events;
}

function summarize(events, scenario, run) {
  const markPrefix = `bars-label-${scenario}`;
  const start = events.find(
    (event) =>
      event.name === `${markPrefix}-start` ||
      (event.name?.startsWith(`${markPrefix}-`) &&
        event.name.endsWith('-start'))
  );
  const end = events.find(
    (event) =>
      event.name === `${markPrefix}-end` ||
      (event.name?.startsWith(`${markPrefix}-`) && event.name.endsWith('-end'))
  );
  if (!start || !end) {
    throw new Error(`Missing ${scenario} User Timing boundaries in run ${run}`);
  }

  const mainThreadEvents = (name) =>
    events.filter(
      (event) =>
        event.ph === 'X' &&
        event.pid === start.pid &&
        event.tid === start.tid &&
        event.name === name &&
        event.ts >= start.ts &&
        event.ts + (event.dur ?? 0) <= end.ts
    );
  const tasks = mainThreadEvents('ThreadControllerImpl::RunTask');
  const layouts = mainThreadEvents('Layout');
  const longTasks = tasks.filter((event) => event.dur >= 50000);
  const sumMilliseconds = (items) =>
    items.reduce((total, event) => total + event.dur, 0) / 1000;

  return {
    run,
    trace: `${stage}-${scenario}-${String(run).padStart(2, '0')}.json.gz`,
    mainThreadMilliseconds: sumMilliseconds(tasks),
    synchronousLayoutMilliseconds: sumMilliseconds(layouts),
    longTaskCount: longTasks.length,
    longestTaskMilliseconds: Math.max(
      0,
      ...longTasks.map((event) => event.dur / 1000)
    ),
  };
}

async function writeTrace(events, scenario, run) {
  const fileName = `${stage}-${scenario}-${String(run).padStart(2, '0')}.json.gz`;
  await fs.writeFile(
    path.join(outputDirectory, fileName),
    gzipSync(JSON.stringify({ traceEvents: events }))
  );
}

async function captureScenario(scenario, trigger) {
  const results = [];
  for (let run = 1; run <= runCount; run++) {
    const events = await captureTrace(trigger);
    await writeTrace(events, scenario, run);
    results.push(summarize(events, scenario, run));
    process.stdout.write(`${stage} ${scenario} ${run}/${runCount}\n`);
  }
  return results;
}

try {
  await Page.navigate({ url: route });
  await waitFor(
    "document.querySelectorAll('app-bars-example .vic-bars-label').length === 45"
  );
  await waitFor(
    "performance.getEntriesByName('bars-label-initial-render').length > 0"
  );

  const initialRender = await captureScenario('initial-render', async () => {
    await Page.reload({ ignoreCache: false });
    await waitFor(
      "document.querySelectorAll('app-bars-example .vic-bars-label').length === 45"
    );
    await waitFor(
      "performance.getEntriesByName('bars-label-initial-render').length > 0"
    );
  });

  for (const button of ['Warm update', 'Change one label', 'Resize chart']) {
    await clickButton(button);
    await new Promise((resolve) => setTimeout(resolve, 325));
  }

  const scenarios = [
    ['warm-update', 'Warm update'],
    ['changed-text', 'Change one label'],
    ['scale-only', 'Resize chart'],
  ];
  const summary = { initialRender };
  for (const [scenario, button] of scenarios) {
    summary[scenario] = await captureScenario(scenario, async () => {
      const count = await evaluate(
        `performance.getEntriesByName('bars-label-${scenario}').length`
      );
      await clickButton(button);
      await waitFor(
        `performance.getEntriesByName('bars-label-${scenario}').length > ${count}`
      );
    });
  }

  await fs.writeFile(
    path.join(outputDirectory, `${stage}-summary.json`),
    `${JSON.stringify(summary, null, 2)}\n`
  );
} finally {
  await client.close();
}

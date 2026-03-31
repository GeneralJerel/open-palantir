/**
 * OREF Proxy Connectivity Test
 *
 * Tests the curl-based proxy approach used by ais-relay.cjs
 * to reach oref.org.il through a residential proxy with Israel exit node.
 *
 * Requires OREF_PROXY_AUTH env var (format: user:pass@host:port)
 *
 * Usage:
 *   OREF_PROXY_AUTH='user:pass;il;;;@proxy.froxy.com:9000' node tests/oref-proxy.test.mjs
 */

import { execSync } from 'node:child_process';
import { strict as assert } from 'node:assert';

const OREF_PROXY_AUTH = process.env.OREF_PROXY_AUTH || '';
const OREF_ALERTS_URL = 'https://www.oref.org.il/WarningMessages/alert/alerts.json';

function stripBom(text) {
  return text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
}

function orefCurlFetch(proxyAuth, url) {
  const proxyUrl = `http://${proxyAuth}`;
  return execSync(
    `curl -s -x "${proxyUrl}" --max-time 15 -H "Accept: application/json" -H "Referer: https://www.oref.org.il/" "${url}"`,
    { encoding: 'utf8', timeout: 20000 }
  );
}

async function runTests() {
  if (!OREF_PROXY_AUTH) {
    console.log('SKIP: OREF_PROXY_AUTH not set — set it to run proxy connectivity tests');
    console.log('  Example: OREF_PROXY_AUTH="user:pass;il;;;@proxy.froxy.com:9000" node tests/oref-proxy.test.mjs');
    process.exit(0);
  }

  console.log('--- OREF Proxy Connectivity Tests ---\n');
  let passed = 0;
  let failed = 0;

  // Test 1: curl is available
  try {
    execSync('curl --version', { encoding: 'utf8', timeout: 5000 });
    console.log('  PASS: curl is available');
    passed++;
  } catch {
    console.log('  FAIL: curl not found — required for OREF proxy');
    failed++;
    process.exit(1);
  }

  // Test 2: Fetch OREF alerts through proxy via curl
  try {
    const raw = orefCurlFetch(OREF_PROXY_AUTH, OREF_ALERTS_URL);
    assert.ok(typeof raw === 'string', 'response should be a string');
    const cleaned = stripBom(raw).trim();

    if (cleaned === '' || cleaned === '[]' || cleaned === 'null') {
      console.log('  PASS: OREF alerts fetch → no active alerts (empty response)');
    } else {
      const parsed = JSON.parse(cleaned);
      // OREF returns a single object when 1 alert, or an array for multiple
      const alerts = Array.isArray(parsed) ? parsed : [parsed];
      assert.ok(alerts.length > 0, 'should have at least one alert');
      assert.ok(alerts[0].id || alerts[0].cat, 'alert should have id or cat field');
      console.log(`  PASS: OREF alerts fetch → ${alerts.length} active alert(s)`);
    }
    passed++;
  } catch (err) {
    console.log(`  FAIL: OREF alerts fetch — ${err.message}`);
    failed++;
  }

  // Test 3: Fetch with HTTP status code check
  try {
    const proxyUrl = `http://${OREF_PROXY_AUTH}`;
    const output = execSync(
      `curl -s -o /dev/null -w "%{http_code}" -x "${proxyUrl}" --max-time 15 -H "Accept: application/json" -H "Referer: https://www.oref.org.il/" "${OREF_ALERTS_URL}"`,
      { encoding: 'utf8', timeout: 20000 }
    ).trim();
    assert.equal(output, '200', `Expected HTTP 200, got ${output}`);
    console.log('  PASS: OREF HTTP status is 200');
    passed++;
  } catch (err) {
    console.log(`  FAIL: OREF HTTP status check — ${err.message}`);
    failed++;
  }

  // Test 4: Invalid proxy should fail gracefully
  try {
    assert.throws(
      () => orefCurlFetch('baduser:badpass@127.0.0.1:1', OREF_ALERTS_URL),
      /./
    );
    console.log('  PASS: Invalid proxy fails gracefully');
    passed++;
  } catch (err) {
    console.log(`  FAIL: Invalid proxy error handling — ${err.message}`);
    failed++;
  }

  console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();

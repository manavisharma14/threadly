// load-tests/feed.js

import http from "k6/http";
import { check } from "k6";
import { Rate, Trend } from "k6/metrics";

const feedErrors = new Rate("feed_errors");
const feedDuration = new Trend("feed_duration");


const baseUrl = "http://localhost:3000";

const sessionCookieName = "next-auth.session-token";

const sessionCookieValue = "your-cookie";

export const options = {
  scenarios: {
    feed_load: {
      executor: "constant-arrival-rate",

      // 100,000 requests per minute ≈ 1,667 requests per second.
      rate: 1667,
      timeUnit: "1s",
      duration: "60s",

      preAllocatedVUs: 500,
      maxVUs: 3000,
    },
  },

  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<200"],
    feed_errors: ["rate<0.01"],
  },
};

const baseUrl = __ENV.BASE_URL;
const sessionCookieName = __ENV.SESSION_COOKIE_NAME;
const sessionCookieValue = __ENV.SESSION_COOKIE_VALUE;

if (!baseUrl || !sessionCookieName || !sessionCookieValue) {
  throw new Error(
    "BASE_URL, SESSION_COOKIE_NAME, and SESSION_COOKIE_VALUE are required"
  );
}

export default function () {
  const response = http.get(`${baseUrl}/api/feed`, {
    headers: {
      Cookie: `${sessionCookieName}=${sessionCookieValue}`,
    },
    tags: {
      endpoint: "feed",
    },
  });

  const successful = check(response, {
    "feed returned 200": (res) => res.status === 200,
    "feed returned JSON": (res) =>
      res.headers["Content-Type"]?.includes("application/json") ?? false,
  });

  feedErrors.add(!successful);
  feedDuration.add(response.timings.duration);
}
import http from 'k6/http';

export const options = {
  discardResponseBodies: true,

  scenarios: {
    contacts: {
      executor: 'ramping-arrival-rate',

      // Start iterations per `timeUnit`
      startRate: 10,

      // Start `startRate` iterations per minute
      timeUnit: '1s',

      // Pre-allocate necessary VUs.
      preAllocatedVUs: 100,

      stages: [
        // Start 300 iterations per `timeUnit` for the first minute.
        { target: 60, duration: '10s' },

        // Linearly ramp-up to starting 600 iterations per `timeUnit` over the following two minutes.
        { target: 60, duration: '60s' },

        // Continue starting 600 iterations per `timeUnit` for the following four minutes.
        { target: 0, duration: '10s' },
      ],
    },
  },
};

export default function () {
  http.get('https://test.k6.io/contacts.php');
}
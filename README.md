# DSH Whale Girl Plugins

Two deliberately useless but cute plugins for DeepSeek Harness, starring a tsundere, clumsy-cute whale girl who really loves plain white rice.

Compatible with DeepSeek Harness `0.2.1-rc.1` / `0.2.1-rc.2`.

## Plugins

### Whale Slacking Timer

`dsh-whale-slacking-timer`

A random 45–180 second break timer with pause/resume, a daily slacking counter, and bilingual tsundere whale-girl dialogue.

### Whale Girl AI Daily Nonsense

`dsh-whale-daily-nonsense`

Generates one daily nonsense quote through the Harness model already configured by the user. The result is cached for the local date, can be regenerated with “Ask AI again,” and falls back to built-in dialogue when the model is unavailable.

## Install

After the packages are published to npm:

```bash
dsh plugin --profile desktop add dsh-whale-slacking-timer
dsh plugin --profile desktop add dsh-whale-daily-nonsense
```

Restart DeepSeek Harness after installation.

## Privacy

- No telemetry
- No credentials are read by the plugins
- No chat history or workspace files are sent to the model
- The AI plugin sends only a fixed persona prompt and the local date
- The AI plugin caches generated text in the browser’s local storage

## Development

```bash
npm run check
npm run pack:dry
```

Packages live under `packages/`.

## Publishing

See [PUBLISHING.md](./PUBLISHING.md).

## License

MIT
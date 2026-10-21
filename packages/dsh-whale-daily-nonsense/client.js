window.__ModuleLoader__.load({
  id: 'dsh-whale-daily-nonsense',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'whale-daily-nonsense';
    const CHANNEL = '/whale-daily-nonsense';
    const FALLBACK_KEYS = ['n0','n1','n2','n3','n4','n5','n6','n7','n8','n9','n10','n11','n12','n13','n14','n15','n16','n17','n18','n19','n20','n21','n22','n23'];

    function localDayKey() {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    function hashText(value) {
      let hash = 2166136261;
      for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
      }
      return hash >>> 0;
    }

    function detectedLanguage() {
      const language = (navigator.languages?.[0] || navigator.language || 'zh').toLowerCase();
      return language.startsWith('zh') ? 'zh' : 'en';
    }

    const dateKey = localDayKey();
    const language = detectedLanguage();
    const fallbackKey = FALLBACK_KEYS[hashText(dateKey) % FALLBACK_KEYS.length];
    const cacheKey = `dsh-whale-daily-nonsense:${dateKey}:${language}`;

    function readCache() {
      try {
        const value = JSON.parse(window.localStorage.getItem(cacheKey) || 'null');
        return typeof value?.text === 'string' && value.text.trim() ? value : null;
      } catch {
        return null;
      }
    }

    function writeCache(text) {
      try {
        window.localStorage.setItem(cacheKey, JSON.stringify({ text, savedAt: Date.now() }));
      } catch {
        // Cache is an optimization; the quote still renders without it.
      }
    }

    return {
      inject: ['slots', 'locale', 'connection'],
      apply(ctx) {
        ctx.effect(
          () => ctx.locale.register(NS, {
            zh: {
              label: '今日废话', aiBadge: 'AI 今日废话', fallbackBadge: '备用今日废话',
              loading: '小鲸鱼娘正在饭粒里翻找灵感…', generate: 'AI 换一句', generating: '正在编…',
              copy: '复制', copyHint: '复制今日废话', copied: '已复制', copyFailed: '复制失败',
              aiFailed: 'AI 打瞌睡了，先用一句备用废话。', retryHint: '重新让 AI 编一句（会消耗模型调用）',
              n0: '今天适合认真吃饭。工作的事，等饭吃完再装糊涂。',
              n1: '哼，才没有等你。只是这碗白饭刚好多盛了一点。',
              n2: '我研究了很久，发现白饭配白饭也很好吃。这叫专业。',
              n3: '如果你今天不开心，可以把烦恼交给我。我会拌进饭里吃掉。',
              n4: '别误会，我只是觉得你该休息了。不是因为我想偷懒。',
              n5: '鲸鱼为什么会飞？因为我脑子里全是饭，比较轻。',
              n6: '今天适合做一件大事：把饭吃完。',
              n7: '我才没有发呆，我在监听米饭的成熟度。',
              n8: '你说努力有什么意义？我觉得先盛一碗饭更有意义。',
              n9: '哼，今天也允许你坐在我旁边。但不许抢我的饭。',
              n10: '我刚刚想到了一个绝妙的主意，但是被饭香打断了。',
              n11: '不要把我说得那么爱吃。我只是对白饭比较有研究。',
              n12: '如果世界只剩下一碗饭，我会分你一口。最多一口。',
              n13: '今日运势：适合吃饭，不适合思考太复杂的事。',
              n14: '我没有懒，我只是把行动力省下来吃饭。',
              n15: '你是不是又忘记休息了？笨蛋，饭都要凉了。',
              n16: '鲸鱼娘不需要咖啡，米饭就是我的燃料。',
              n17: '今天也不打算长大，长大以后要自己洗碗。',
              n18: '我有一个秘密：其实我什么都不会，只是很会吃饭。',
              n19: '别盯着我看。再看，我就把饭藏起来。',
              n20: '所谓成熟，就是偷懒以后还记得回来吃饭。',
              n21: '今天的我比昨天更聪明了一点——多认识了一种米。',
              n22: '如果努力太累，就先假装什么都没发生，然后吃饭。',
              n23: '哼，今天也辛苦你了。白饭分你半碗，不能再多了。'
            },
            en: {
              label: 'Daily nonsense', aiBadge: 'AI daily nonsense', fallbackBadge: 'Fallback nonsense',
              loading: 'The whale girl is digging through rice grains for inspiration…', generate: 'Ask AI again', generating: 'Making one…',
              copy: 'Copy', copyHint: 'Copy today’s nonsense', copied: 'Copied', copyFailed: 'Copy failed',
              aiFailed: 'The AI dozed off. Here is a backup nonsense line.', retryHint: 'Ask the AI for another line (uses a model call)',
              n0: 'Today is a good day to eat seriously. Pretend work does not exist until the rice is gone.',
              n1: 'Hmph, I was not waiting for you. This bowl simply happened to have extra rice.',
              n2: 'After extensive research, rice with rice tastes excellent. That is professionalism.',
              n3: 'If you are unhappy today, give me your worries. I will mix them into my rice and eat them.',
              n4: 'Do not misunderstand. I only think you should rest. It is not because I want to slack off.',
              n5: 'Why can whales fly? My head is full of rice, so it is light.',
              n6: 'Today is perfect for one important task: finishing the rice.',
              n7: 'I am not spacing out. I am monitoring the rice’s readiness.',
              n8: 'What is the point of effort? I think filling a rice bowl first has more point.',
              n9: 'Hmph, you may sit beside me today. But do not touch my rice.',
              n10: 'I just had a brilliant idea, but the smell of rice interrupted it.',
              n11: 'Do not call me that fond of food. I merely have considerable rice expertise.',
              n12: 'If the world had one bowl of rice left, I would share one bite. At most one.',
              n13: 'Today’s fortune: suitable for eating, unsuitable for complicated thinking.',
              n14: 'I am not lazy. I am conserving my energy for rice.',
              n15: 'Did you forget to rest again? Dummy, the rice is getting cold.',
              n16: 'A whale girl does not need coffee. Rice is my fuel.',
              n17: 'I do not plan to grow up today. Grown-ups have to wash their own bowls.',
              n18: 'Here is my secret: I know nothing. I am simply very good at eating.',
              n19: 'Stop staring at me. Keep it up and I will hide the rice.',
              n20: 'Maturity means remembering to come back and eat after slacking off.',
              n21: 'I am slightly smarter than yesterday. I learned about one more kind of rice.',
              n22: 'If effort is too tiring, pretend nothing happened and go eat.',
              n23: 'Hmph, you worked hard today. I will share half the rice. Not one grain more.'
            }
          }),
          'whale-daily-nonsense: locale dictionary'
        );

        const t = ctx.locale.bind(NS);

        function DailyNonsense() {
          const cached = readCache();
          const [text, setText] = React.useState(cached?.text ?? '');
          const [source, setSource] = React.useState(cached ? 'ai' : 'loading');
          const [loading, setLoading] = React.useState(!cached);
          const [error, setError] = React.useState('');
          const [copyState, setCopyState] = React.useState('idle');
          const generationRef = React.useRef(null);
          const initialRef = React.useRef(false);

          React.useEffect(() => {
            if (initialRef.current) return undefined;
            initialRef.current = true;
            if (cached?.text) return undefined;
            const controller = new AbortController();
            generationRef.current = controller;
            generate(controller.signal).catch(() => undefined);
            return () => {
              controller.abort();
              if (generationRef.current === controller) generationRef.current = null;
            };
          }, []);

          React.useEffect(() => {
            if (copyState === 'idle') return undefined;
            const timer = window.setTimeout(() => setCopyState('idle'), 1800);
            return () => window.clearTimeout(timer);
          }, [copyState]);

          async function generate(signal) {
            setLoading(true);
            setError('');
            try {
              const result = await ctx.connection.rpc.call(
                CHANNEL,
                'generate',
                { args: { date: dateKey, language } },
                signal,
              );
              if (!result?.ok) throw new Error(result?.error?.message || 'generation failed');
              const quote = result.value?.text?.trim();
              if (!quote) throw new Error('empty quote');
              setText(quote);
              setSource('ai');
              writeCache(quote);
            } catch (failure) {
              if (signal?.aborted) return;
              setError(t('aiFailed'));
              if (!text) {
                setText(t(fallbackKey));
                setSource('fallback');
              }
            } finally {
              if (!signal?.aborted) setLoading(false);
              if (generationRef.current?.signal === signal) generationRef.current = null;
            }
          }

          function regenerate() {
            generationRef.current?.abort();
            const controller = new AbortController();
            generationRef.current = controller;
            generate(controller.signal);
          }

          async function copyQuote() {
            const value = text || '';
            try {
              if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                await navigator.clipboard.writeText(value);
              } else {
                const area = document.createElement('textarea');
                area.value = value;
                area.setAttribute('readonly', '');
                area.style.position = 'fixed';
                area.style.opacity = '0';
                document.body.appendChild(area);
                area.select();
                const copied = document.execCommand('copy');
                area.remove();
                if (!copied) throw new Error('copy command failed');
              }
              setCopyState('copied');
            } catch {
              setCopyState('failed');
            }
          }

          const badge = source === 'fallback' ? t('fallbackBadge') : t('aiBadge');
          return h('div', { className: 'dsh-whale-nonsense' },
            h('style', null, `
              .dsh-whale-nonsense { display:flex; align-items:center; gap:9px; flex-wrap:wrap; padding:2px 0; color:inherit; font:inherit; }
              .dsh-whale-nonsense__badge { display:inline-flex; align-items:center; gap:5px; border-radius:999px; padding:3px 9px; background:color-mix(in srgb, #6ec6df 14%, transparent); border:1px solid color-mix(in srgb, currentColor 20%, transparent); font-size:11px; white-space:nowrap; opacity:.85; }
              .dsh-whale-nonsense__quote { min-width:0; font-size:12px; opacity:.76; }
              .dsh-whale-nonsense__actions { display:inline-flex; align-items:center; gap:2px; }
              .dsh-whale-nonsense__action { appearance:none; border:0; border-radius:999px; padding:3px 8px; background:transparent; color:inherit; font:inherit; font-size:11px; opacity:.58; cursor:pointer; }
              .dsh-whale-nonsense__action:hover { opacity:.9; background:color-mix(in srgb, currentColor 7%, transparent); }
              .dsh-whale-nonsense__action:focus-visible { outline:2px solid currentColor; outline-offset:1px; }
              .dsh-whale-nonsense__action:disabled { cursor:default; opacity:.35; }
              .dsh-whale-nonsense__action[data-state="copied"] { color:#4e9b68; opacity:1; }
              .dsh-whale-nonsense__action[data-state="failed"] { color:#c45f5f; opacity:1; }
              .dsh-whale-nonsense__error { color:#c45f5f; font-size:11px; opacity:.9; }
            `),
            h('span', { className: 'dsh-whale-nonsense__badge' }, h('span', { 'aria-hidden': true }, '🐋'), badge),
            h('span', { className: 'dsh-whale-nonsense__quote', 'aria-live': 'polite' }, loading && !text ? t('loading') : text),
            h('span', { className: 'dsh-whale-nonsense__actions' },
              h('button', { type: 'button', className: 'dsh-whale-nonsense__action', title: t('retryHint'), disabled: loading, onClick: regenerate }, loading ? t('generating') : t('generate')),
              h('button', { type: 'button', className: 'dsh-whale-nonsense__action', 'data-state': copyState, title: t('copyHint'), disabled: !text, onClick: copyQuote }, copyState === 'copied' ? t('copied') : copyState === 'failed' ? t('copyFailed') : t('copy'))
            ),
            error ? h('span', { className: 'dsh-whale-nonsense__error' }, error) : null
          );
        }

        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({ name: 'conversation.composer.dock', id: 'whale-daily-nonsense', order: 53 }, DailyNonsense));
      }
    };
  }
});
window.__ModuleLoader__.load({
  id: 'dsh-whale-slacking-timer',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'whale-slacking-timer';
    const STORAGE_KEY = 'dsh-whale-slacking-timer:daily';
    const START_LINES = ['start0', 'start1', 'start2', 'start3'];
    const PAUSE_LINES = ['pause0', 'pause1'];
    const RESUME_LINES = ['resume0', 'resume1'];
    const DONE_LINES = ['done0', 'done1', 'done2', 'done3', 'done4', 'done5'];

    function choose(list, previous) {
      let next = previous;
      while (next === previous) next = list[Math.floor(Math.random() * list.length)];
      return next;
    }

    function localDayKey() {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${now.getFullYear()}-${month}-${day}`;
    }

    function readDailyCount() {
      try {
        const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
        return value && value.date === localDayKey() && Number.isInteger(value.count) ? value.count : 0;
      } catch {
        return 0;
      }
    }

    function saveDailyCount(count) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: localDayKey(), count }));
      } catch {
        // Local storage is optional; the timer still works without it.
      }
    }

    function formatClock(milliseconds) {
      const total = Math.max(0, Math.ceil(milliseconds / 1000));
      const minutes = String(Math.floor(total / 60)).padStart(2, '0');
      const seconds = String(total % 60).padStart(2, '0');
      return `${minutes}:${seconds}`;
    }

    function WhaleTimer() {
      const [phase, setPhase] = React.useState('idle');
      const [remaining, setRemaining] = React.useState(0);
      const [endsAt, setEndsAt] = React.useState(null);
      const [lineKey, setLineKey] = React.useState('idle0');
      const [todayCount, setTodayCount] = React.useState(readDailyCount);
      const finishedRef = React.useRef(false);

      React.useEffect(() => {
        if (phase !== 'running' || endsAt === null) return undefined;
        function tick() {
          const left = endsAt - Date.now();
          if (left > 0) {
            setRemaining(left);
            return;
          }
          if (!finishedRef.current) {
            finishedRef.current = true;
            setRemaining(0);
            setPhase('done');
            setLineKey((previous) => choose(DONE_LINES, previous));
            setTodayCount((previous) => {
              const next = previous + 1;
              saveDailyCount(next);
              return next;
            });
          }
        }
        tick();
        const timer = window.setInterval(tick, 250);
        return () => window.clearInterval(timer);
      }, [phase, endsAt]);

      function toggleTimer() {
        if (phase === 'running') {
          setRemaining(Math.max(0, endsAt - Date.now()));
          setEndsAt(null);
          setPhase('paused');
          setLineKey((previous) => choose(PAUSE_LINES, previous));
          return;
        }

        if (phase === 'paused') {
          finishedRef.current = false;
          setEndsAt(Date.now() + remaining);
          setPhase('running');
          setLineKey((previous) => choose(RESUME_LINES, previous));
          return;
        }

        const seconds = 45 + Math.floor(Math.random() * 136);
        const duration = seconds * 1000;
        finishedRef.current = false;
        setRemaining(duration);
        setEndsAt(Date.now() + duration);
        setPhase('running');
        setLineKey((previous) => choose(START_LINES, previous));
      }

      const buttonKey = phase === 'running'
        ? 'pause'
        : phase === 'paused'
          ? 'resume'
          : phase === 'done'
            ? 'again'
            : 'start';
      const clock = phase === 'running' || phase === 'paused' ? formatClock(remaining) : phase === 'done' ? '00:00' : '45–180s';

      return h(
        'div',
        { className: 'dsh-whale-timer' },
        h('style', null, `
          .dsh-whale-timer {
            display: flex;
            align-items: center;
            gap: 9px;
            flex-wrap: wrap;
            padding: 2px 0;
            color: inherit;
            font: inherit;
          }
          .dsh-whale-timer__button {
            appearance: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border: 1px solid color-mix(in srgb, currentColor 24%, transparent);
            border-radius: 999px;
            padding: 4px 10px;
            background: color-mix(in srgb, #6ec6df 14%, transparent);
            color: inherit;
            font: inherit;
            font-size: 12px;
            line-height: 1.45;
            cursor: pointer;
            transition: transform 120ms ease, background 120ms ease;
          }
          .dsh-whale-timer__button:hover {
            transform: translateY(-1px);
            background: color-mix(in srgb, #6ec6df 23%, transparent);
          }
          .dsh-whale-timer__button:active { transform: translateY(0) scale(.98); }
          .dsh-whale-timer__button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
          .dsh-whale-timer__clock {
            min-width: 58px;
            font-size: 12px;
            font-variant-numeric: tabular-nums;
            opacity: .82;
          }
          .dsh-whale-timer__line {
            min-width: 0;
            font-size: 12px;
            opacity: .72;
          }
          .dsh-whale-timer__count {
            margin-left: auto;
            font-size: 11px;
            opacity: .55;
            white-space: nowrap;
          }
        `),
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-whale-timer__button',
            title: t('hint'),
            onClick: toggleTimer,
          },
          h('span', { 'aria-hidden': true }, '🐋'),
          t(buttonKey),
        ),
        h('span', { className: 'dsh-whale-timer__clock', 'aria-live': 'polite' }, clock),
        h('span', { className: 'dsh-whale-timer__line' }, t(lineKey)),
        h('span', { className: 'dsh-whale-timer__count' }, `${t('today')} ${todayCount}`),
      );
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(
          () => ctx.locale.register(NS, {
            zh: {
              start: '随机摸鱼',
              pause: '暂停一下',
              resume: '继续摸鱼',
              again: '再来一次',
              hint: '随机摸鱼 45–180 秒。偷懒也要有仪式感。',
              today: '今日摸鱼',
              idle0: '哼，想偷懒就直说，别假装在看代码。',
              start0: '只准摸一会儿。我的白饭你别碰。',
              start1: '既然你累了，那就勉为其难休息一下吧。',
              start2: '我没有关心你，我只是想安静地吃口饭。',
              start3: '计时开始。偷懒也要有仪式感，笨蛋。',
              pause0: '暂停？你是不是想趁机偷吃我的饭。',
              pause1: '好吧好吧，就停一下。但不许太久。',
              resume0: '继续吧。这次可别再盯着我的饭碗。',
              resume1: '才不是特意等你，是计时器自己停了。',
              done0: '时间到。才不是心疼你，只是白饭快凉了。',
              done1: '休息结束！再偷懒我就把饭藏起来。',
              done2: '你刚才偷懒的样子……有一点好笑。就一点。',
              done3: '我把你的疲惫拌进饭里吃掉了。现在继续吧。',
              done4: '哼，恢复精神了吗？没有的话再给你一分钟，只有一分钟。',
              done5: '摸鱼完成。今日份白饭，分你一口好了。',
            },
            en: {
              start: 'Random slack',
              pause: 'Pause',
              resume: 'Resume slack',
              again: 'One more',
              hint: 'A random 45–180 second break. Slacking deserves ceremony.',
              today: 'Slacks today',
              idle0: 'If you want to slack off, just say it. Stop pretending to read code.',
              start0: 'Only for a little while. Keep your hands off my rice.',
              start1: 'Since you are tired, I suppose I can let you rest. Barely.',
              start2: 'I am not worried about you. I just want to eat in peace.',
              start3: 'Timer started. Even slacking needs ceremony, dummy.',
              pause0: 'Pause? You are not plotting to steal my rice, are you?',
              pause1: 'Fine, fine. A short break. Not any longer.',
              resume0: 'Continue. And stop staring at my rice bowl.',
              resume1: 'I was not waiting for you. The timer stopped by itself.',
              done0: 'Time is up. I am not worried about you; the rice is getting cold.',
              done1: 'Break over! Slack again and I will hide the rice.',
              done2: 'You looked a little funny while slacking. Only a little.',
              done3: 'I mixed your tiredness into my rice and ate it. Now keep going.',
              done4: 'Hmph, feeling better? If not, one more minute. Only one.',
              done5: 'Slacking complete. You may have one bite of today’s rice.',
            },
          }),
          'whale-slacking-timer: locale dictionary',
        );

        const t = ctx.locale.bind(NS);
        ctx.slots.inject('conversation.composer.dock', () =>
          ctx.slots.register(
            {
              name: 'conversation.composer.dock',
              id: 'whale-slacking-timer',
              order: 52,
            },
            WhaleTimer,
          ),
        );
      },
    };
  },
});
/** Host half: generate one cached daily quote through the configured Harness LLM. */
const CHANNEL = '/whale-daily-nonsense';
const PREFERRED_PROVIDER = 'deepseek-account';
const PREFERRED_MODEL = 'deepseek-flash';
const MAX_QUOTE_LENGTH = 240;
const REQUEST_TIMEOUT_MS = 45000;

export const inject = ['connection', 'llm'];

function failure(code, message) {
  return { ok: false, error: { code, message } };
}

function buildPrompt(date, language) {
  if (language === 'en') {
    return [
      'You are the "little whale girl": a tsundere, clumsy-cute whale girl who loves plain white rice.',
      'Write exactly one short "daily nonsense" line for the user.',
      'Rules:',
      '- 1 or 2 short sentences, under 60 English words.',
      '- The tone must be tsundere, silly, affectionate, and rice-obsessed.',
      '- It should sound like a tiny useless daily fortune, not advice or a task.',
      '- Do not use markdown, quotation marks, labels, explanations, or emoji.',
      '- Do not mention being an AI, a model, a prompt, or these rules.',
      `Today is ${date}.`,
      'Return only the sentence.',
    ].join('\n');
  }
  return [
    '你是“小鲸鱼娘”：一只傲娇、蠢萌、非常爱吃白饭的鲸鱼少女。',
    '请为用户写一句今天的“每日废话”。',
    '要求：',
    '- 1 到 2 句，60 个汉字以内。',
    '- 语气傲娇、蠢萌、有点黏人，但会嘴硬。',
    '- 必须围绕吃饭、白饭、摸鱼、发呆或日常小事，像一句没用的今日运势。',
    '- 不要给建议，不要安排任务，不要讲大道理。',
    '- 不要使用 Markdown、引号、标签、解释或表情符号。',
    '- 不要提到 AI、模型、提示词或这些规则。',
    `今天是 ${date}。`,
    '只输出这句话。',
  ].join('\n');
}

function normalizeQuote(value) {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/^[ \t\n"'“”‘’]+|[ \t\n"'“”‘’]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_QUOTE_LENGTH);
}

async function chooseRoute(ctx, signal, preferredProvider, preferredModel) {
  const providers = ctx.llm.listProviders();
  if (providers.length === 0) throw new Error('没有可用的模型提供方');
  const provider = providers.find((item) => item.id === preferredProvider) ?? providers[0];
  let model = preferredModel;
  try {
    const models = await ctx.llm.listModels(provider.id);
    if (models.length > 0) {
      model = models.find((item) => item.id === preferredModel)?.id ?? models[0].id;
    }
  } catch {
    // Keep the preferred model id when discovery fails; the adapter may still route it.
  }
  return { provider: provider.id, model };
}

async function generateQuote(ctx, request, signal, routePreference) {
  const controller = new AbortController();
  const abortFromRequest = () => controller.abort(signal.reason);
  const timeout = setTimeout(() => controller.abort(new Error('生成超时')), REQUEST_TIMEOUT_MS);
  if (signal.aborted) controller.abort(signal.reason);
  signal.addEventListener('abort', abortFromRequest, { once: true });

  try {
    const route = await chooseRoute(ctx, controller.signal, routePreference.provider, routePreference.model);
    const prompt = buildPrompt(request.date, request.language);
    let text = '';
    let finish;
    for await (const chunk of ctx.llm.stream({
      provider: route.provider,
      model: route.model,
      signal: controller.signal,
      temperature: 0.9,
      maxTokens: 120,
      messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
    })) {
      if (chunk.type === 'text-delta') text += chunk.text;
      if (chunk.type === 'finish') finish = chunk;
    }
    if (finish?.reason?.kind === 'aborted') return failure('aborted', '生成已取消');
    if (finish?.reason?.kind === 'error') {
      return failure('llm-error', finish.reason.failure?.message ?? '模型生成失败');
    }
    const quote = normalizeQuote(text);
    if (!quote) return failure('empty', '模型没有返回有效内容');
    return {
      ok: true,
      value: {
        text: quote,
        provider: route.provider,
        model: route.model,
        generatedAt: new Date().toISOString(),
      },
    };
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener('abort', abortFromRequest);
  }
}

export function apply(ctx, config = {}) {
  const preferredProvider = typeof config?.provider === 'string' && config.provider.trim() ? config.provider.trim() : PREFERRED_PROVIDER;
  const preferredModel = typeof config?.model === 'string' && config.model.trim() ? config.model.trim() : PREFERRED_MODEL;
  ctx.connection.rpc.handle(CHANNEL, async (endpoint, payload, signal) => {
    if (endpoint !== 'generate') return failure('bad-endpoint', `未知操作：${endpoint}`);
    const args = payload && typeof payload === 'object' && payload.args && typeof payload.args === 'object'
      ? payload.args
      : payload;
    const date = typeof args?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(args.date)
      ? args.date
      : new Date().toISOString().slice(0, 10);
    const language = args?.language === 'en' ? 'en' : 'zh';
    try {
      return await generateQuote(ctx, { date, language }, signal, { provider: preferredProvider, model: preferredModel });
    } catch (error) {
      if (signal.aborted) return failure('aborted', '生成已取消');
      return failure('generation-failed', error instanceof Error ? error.message : String(error));
    }
  });
}
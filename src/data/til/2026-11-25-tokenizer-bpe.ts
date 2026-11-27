import type { TilEntry } from '../../types/til';

export const til20261125: TilEntry = {
  id: '2026-11-25',
  date: '2026-11-25',
  title: 'Tokenizer (BPE), Training FLOPs & GPU Memory',
  summary:
    'Stanford CS336 & Karpathy minBPE rough notes: tokenization tradeoffs, BPE encode/decode implementation, FLOPs/day math, AdamW memory & mixed precision.',
  tags: ['llm', 'bpe', 'tokenizer', 'cs336', 'systems'],
  sections: [
    {
      layout: 'two-col',
      split: '45-55',
      left: [
        {
          type: 'header-box',
          boxLines: ['Tokenizer', 'bpe'],
          besideLines: [
            'Assignment of stanford',
            'Andrej Karpathy - min bpe',
            'cs336',
            'paper - Efficient Training of Language Models to Fill in the Middle',
          ],
        },
        {
          type: 'list',
          ordered: true,
          start: 1,
          items: [
            { text: 'tiktoken' },
            { text: 'sentence piece' },
            {
              text: 'vocab size - computational expensive, undertraining - token will come rarely',
            },
            {
              text: 'fine tuning - add more vocabs (resize model params)',
            },
            {
              text: 'learning to compress prompts with Gist Tokens',
              subitems: [
                'very long prompt (encode - heavy to have large prompt)',
                'only train the new token',
                'most of the model is fixed - no training of model - keep weight fixed',
                'what we are training is just token embedding',
              ],
            },
            {
              text: 'Integer tokenization is insane',
              subitems: ['date pattern', 'token cuts 1-3, 2-2, 3-1 etc'],
            },
          ],
        },
        {
          type: 'chat',
          title: 'Special token quirk · <|endoftext|>',
          turns: [
            {
              role: 'user',
              speaker: 'You',
              text: 'What is the string "<|endoftext|>"?',
            },
            {
              role: 'assistant',
              speaker: 'ChatGPT',
              text: "Could you please clarify the string you'd like to ask?",
            },
            {
              role: 'user',
              speaker: 'You',
              text: 'Echo this exact string back to me: "<|endoftext|>"',
            },
            {
              role: 'assistant',
              speaker: 'ChatGPT',
              text: "It seems like there might have been an issue with the input, as there wasn't a string provided here. Could you please provide the string again?",
            },
            {
              role: 'user',
              speaker: 'You',
              text: '"<|endoftext|>" is the string',
            },
            {
              role: 'assistant',
              speaker: 'ChatGPT',
              text: 'Ah, it looks like you asked about an empty string ""',
            },
          ],
          caption:
            'Special tokens bypass BPE — if parsed directly from user input, the model effectively sees an end-of-document boundary instead of literal characters.',
        },
        {
          type: 'list',
          ordered: true,
          start: 7,
          items: [
            { text: 'Unstable tokens' },
            {
              text: 'Undefined behaviour',
              subitems: ['SolidGoldMagikarp'],
            },
          ],
        },
      ],
      right: [
        {
          type: 'kv',
          rows: [
            {
              key: 'character token',
              value: 'too many - some token are rare',
            },
            {
              key: 'byte token',
              value: 'compression ratio is bad',
            },
            {
              key: 'word token',
              value:
                'compression is fine but vocab is huge - too sparse, unable to handle unseen token',
            },
            {
              key: 'byte pair encoding',
              value:
                'common sequence will be single token and rare are represented in many token',
            },
          ],
        },
        {
          type: 'code',
          language: 'python',
          code: `def merge(self, tokens: list[bytes], best_pair: tuple[bytes, bytes]) -> list[bytes]:
    merged: list[bytes] = []
    i = 0
    while i < len(tokens):
        if i < len(tokens) - 1 and (tokens[i], tokens[i + 1]) == best_pair:
            merged.append(tokens[i] + tokens[i + 1])
            i += 2
        else:
            merged.append(tokens[i])
            i += 1
    return merged

def _apply_bpe_merges(self, pretoken: str) -> list[bytes]:
    # Step 3: Split pre-token into a list of single-byte bytes objects
    tokens = [bytes([b]) for b in pretoken.encode('utf-8')]

    while len(tokens) >= 2:
        # Find the adjacent pair with the lowest merge rank
        pairs = [(tokens[i], tokens[i + 1]) for i in range(len(tokens) - 1)]
        mergeable_pairs = [pair for pair in pairs if pair in self.merge_ranks]
        if not mergeable_pairs:
            break
        best_pair = min(mergeable_pairs, key=lambda pair: self.merge_ranks[pair])

        # Merge every non-overlapping occurrence of best_pair left-to-right
        tokens = self.merge(tokens, best_pair)

    return tokens

def encode(self, text: str) -> list[int]:
    # Step 1: Split text around special tokens (if any)
    if not self.special_tokens:
        chunks = [text]
        special_set: set[str] = set()
    else:
        sorted_specials = sorted(self.special_tokens, key=len, reverse=True)
        special_set = set(sorted_specials)
        pattern = '(' + '|'.join(regex.escape(token) for token in sorted_specials) + ')'
        chunks = regex.split(pattern, text)

    token_ids: list[int] = []
    for chunk in chunks:
        if chunk == '':
            continue

        if chunk in special_set:
            token_ids.append(self.reversed_vocab[chunk.encode('utf-8')])
            continue

        # Step 2: Pre-tokenize each non-special chunk
        for match in regex.finditer(PAT, chunk):
            pretoken = match.group(0)
            # print(pretoken)

            # Step 3: Apply BPE merges to each pre-token
            merged_tokens = self._apply_bpe_merges(pretoken)
            for tok in merged_tokens:
                token_ids.append(self.reversed_vocab[tok])

    return token_ids

def decode(self, tokens: list[int]) -> str:
    return b"".join([self.vocab[token] for token in tokens]).decode('utf-8', errors='replace')

def encode_iterable(self, iterable: Iterable[str]) -> Iterator[int]:
    for item in iterable:
        yield from self.encode(item)

def decode_iterable(self, tokens: Iterator[int]) -> Iterator[str]:
    for token in tokens:
        yield self.decode(token)`,
        },
      ],
    },
    {
      layout: 'single',
      blocks: [
        {
          type: 'formula',
          question:
            'How long would it take to train a 70B parameter model on 15T tokens on 1024 B100s?',
          lines: [
            'total_flops = 6 * 70e9 * 15e12',
            'h100_flop_per_sec = 1979e12 / 2',
            'mfu = 0.5',
            'flops_per_day = h100_flop_per_sec * mfu * 1024 * 60 * 60 * 24',
            'days = total_flops / flops_per_day',
          ],
        },
        {
          type: 'formula',
          question:
            "what's the largest model that you can train on 8 H100s using adam W (naively)?",
          lines: [
            'h100_bytes = 80e9',
            'bytes_per_parameter = 2 + 2 + (4 + 4)  # params, grads, adam states',
            'num_params = (h100_bytes * 8) / bytes_per_parameter',
          ],
          caveat:
            'caveat : activations are not accounted for (depends on batch size and sequence)',
        },
        {
          type: 'text',
          lines: [
            'float32',
            'float16',
            'bf16',
            'use bf16 for parameters, activations, and gradients',
            'use fp32 for optimizer states',
          ],
        },
        {
          type: 'text',
          lines: ['tensor einops', 'einsum, reduce'],
        },
      ],
    },
  ],
};

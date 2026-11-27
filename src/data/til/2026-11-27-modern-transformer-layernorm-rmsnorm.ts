import type { TilEntry } from '../../types/til';

export const til20261127: TilEntry = {
  id: '2026-11-27',
  slug: '2026-11-27-modern-transformer-pre-vs-post-ln-rmsnorm',
  date: '2026-11-27',
  title: 'Modern Transformer Recap — Pre-LN vs Post-LN & RMSNorm',
  summary:
    'Quick recap of modern Transformer architectures: B/T/C tensor shapes, Pre-LN vs Post-LN residual streams and gradient flow, LayerNorm vs RMSNorm equations, and why RMSNorm is faster.',
  tags: ['llm', 'transformer', 'layernorm', 'rmsnorm', 'cs336'],
  sections: [
    {
      layout: 'single',
      blocks: [
        {
          type: 'text',
          lines: ['Language model', 'Attention is all you need'],
        },
        {
          type: 'text',
          lines: ['B, T, C - Batch, time, channels'],
        },
        {
          type: 'text',
          lines: ['Architectures', 'Quick recap of modern transformer'],
        },
        {
          type: 'list',
          ordered: false,
          heading: 'where you put the layer norm - pre vs post LN',
          items: [
            { text: 'gradient pass is easy' },
            { text: 'change layer of norm as we backward pass as they will be in between' },
          ],
        },
      ],
    },
    {
      layout: 'two-col',
      split: '50-50',
      left: [
        {
          type: 'diagram',
          kind: 'pre-vs-post-ln',
          caption: 'Post-LN (left) vs Pre-LN (right) — Pre-LN keeps a clean residual highway from xₗ to xₗ₊₁.',
        },
      ],
      right: [
        {
          type: 'math',
          lead: 'Original transformer:',
          highlight: 'LayerNorm',
          description: 'normalizes the mean and variance across d_model',
          lhs: 'y =',
          numerator: 'x − E[x]',
          denominator: '√(Var[x] + ε)',
          suffix: '∗ γ + β',
        },
        {
          type: 'math',
          lead: 'Many modern LMs:',
          highlight: 'RMSNorm',
          description: 'does not subtract mean or add a bias term',
          lhs: 'y =',
          numerator: 'x',
          denominator: '√(‖x‖₂² + ε)',
          suffix: '∗ γ',
        },
      ],
    },
    {
      layout: 'single',
      blocks: [
        {
          type: 'list',
          ordered: false,
          items: [{ text: 'gradient spike smoothing' }],
        },
        {
          type: 'list',
          ordered: false,
          heading: 'Why RMSNorm?',
          items: [
            { text: "it's faster" },
            { text: '% flop 0.17%, runtime 25.5% - stat. normalization' },
            { text: 'memory and optimization stability - dropping bias' },
          ],
        },
        {
          type: 'text',
          lines: [
            'what do most of the large LMs have in common',
            'What are common variations to the architecture / training process',
          ],
        },
        {
          type: 'text',
          lines: ['pre vs post norm'],
        },
      ],
    },
  ],
};

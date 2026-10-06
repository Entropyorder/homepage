/**
 * Central dataset registry.
 *
 * To add a new dataset:
 * 1. Pick a unique id (kebab-case, e.g. "my-new-dataset")
 * 2. Add it to the appropriate category's `datasets` array below
 * 3. Add translations under the `datasets.<id>` key in both zh.json and en.json
 *    Required fields: name, desc, scale, tags, brief, structure
 *    Optional fields: paper { title, authors, venue, url }
 * 4. If the dataset has a downloadable sample, add its OSS link to the
 *    encrypted store in `src/data/sampleLinks.js` (see that file for the
 *    re-encryption recipe).
 */

export const DATASET_CATEGORIES = [
  {
    key: 'expert',
    i18nKey: 'products.categories.expert',
    artifact: 'ExpertArtifact',
    datasets: [
      'hle',
      'math-hard',
      'sfe',
      'stem-video',
      'crosslingual-k12-stem',
      'sci-infograph',
      'microvqa',
      'msearth',
    ],
  },
  {
    key: 'multimodal',
    i18nKey: 'products.categories.multimodal',
    artifact: 'MultimodalArtifact',
    datasets: [
      'proactive-video',
      'multimodal-av',
      'camera-motion',
      'crosslingual-multimodal',
      'misleading-images',
      'infograph',
      'art',
    ],
  },
  {
    key: 'code',
    i18nKey: 'products.categories.code',
    artifact: 'CodeArtifact',
    datasets: ['yukicoder-extension', 'scicode', 'oj-competition'],
  },
  {
    key: 'agent',
    i18nKey: 'products.categories.agent',
    artifact: 'AgentArtifact',
    datasets: [
      'openclaw',
      'agentos-trajectory',
      'gdpval-extension',
      'skillbench',
      'search-retrieval',
      'open-challenge',
    ],
  },
];

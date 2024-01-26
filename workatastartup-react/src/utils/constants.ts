export const DEFAULT_LONG_INPUT =
  'I have been building web and mobile apps for 5 years, but I see myself as a jack of all trades. My favorite new language is Rust but I have lots of experience with Typescript. I would love a job as a founding engineer.';

export const DEFAULT_SHORT_INPUT = 'React -Native';

export const EMBEDDING_MODEL_TO_COLUMN: { [k: string]: string } = {
  // 'BAAI/bge-large-en': 'description_embedding',
  'BAAI/bge-small-en': 'description_embedding_v2',
  'BAAI/bge-base-en': 'description_embedding_v3',
  'jinaai/jina-embeddings-v2-base-en': 'description_embedding_v4',
};

export const DEFAULT_EMBEDDING_MODEL = 'BAAI/bge-small-en';
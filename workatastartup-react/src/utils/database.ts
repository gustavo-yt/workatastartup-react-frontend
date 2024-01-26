import { EMBEDDING_MODEL_TO_COLUMN } from './constants';

export const getQuery = (
  embeddingModel: string,
  longInput: string,
  shortInput: string,
  country: string
) => {
  const indexes = { longInput: 0, shortInput: 0, country: 0 };
  const embeddingColumn = EMBEDDING_MODEL_TO_COLUMN[embeddingModel];

  const params: string[] = [];
  if (longInput) {
    params.push(longInput);
    indexes.longInput = params.length;
  }
  if (shortInput) {
    params.push(shortInput);
    indexes.shortInput = params.length;
  }
  if (country) {
    params.push(country);
    indexes.country = params.length;
  }

  // Select
  const selectFields = ['*'];
  if (longInput) {
    selectFields.push(
      `cos_dist(\n\t\ttext_embedding('${embeddingModel}', $${indexes.longInput}),\n\t\t${embeddingColumn}\n\t) AS score`
    );
  }

  // Where
  const whereFields: string[] = [];
  if (country) {
    whereFields.push(`country = $${indexes.country}`);
  }
  if (shortInput) {
    whereFields.push(
      `websearch_to_tsquery('english', $${indexes.shortInput}) @@ description_tsvector`
    );
  }
  const whereQuery = whereFields.length
    ? `WHERE\n\t${whereFields.join('\n\tAND ')}\n`
    : '';

  // Order by
  let orderBy: string;
  if (longInput) {
    orderBy = `text_embedding('${embeddingModel}', $${indexes.longInput}) <=> ${embeddingColumn}`;
  } else if (shortInput) {
    orderBy = `ts_rank_cd(description_tsvector, websearch_to_tsquery('english', $${indexes.shortInput})) DESC`;
  } else {
    orderBy = `date DESC`;
  }

  const selectQuery = selectFields.join(',\n\t');

  const query = `SELECT
\t${selectQuery}
FROM
\tjobs
${whereQuery}ORDER BY
\t${orderBy}
LIMIT 3`;

  return { query, params };
};
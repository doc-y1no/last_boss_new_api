/**
 * 国土交通省データプラットフォーム（DPF）GraphQL API クライアント
 * @see https://www.mlit-data.jp/api_docs/
 * @see https://qiita.com/kisayama/items/207b3f228c3e784e62a7
 */

const MLIT_DPF_ENDPOINT = 'https://www.mlit-data.jp/api/v1/';

export type MLITPrefecture = {
  code: number;
  name: string;
  code_as_string?: string;
  name_short?: string;
  hiragana?: string;
  romaji?: string;
};

type GraphQLPrefectureResponse = {
  data?: {
    prefecture: MLITPrefecture[];
  };
  errors?: Array<{ message: string }>;
};

/**
 * 都道府県一覧を取得する（国土交通省DPF コード情報API）
 */
export async function fetchPrefectures(
  apiKey: string
): Promise<MLITPrefecture[]> {
  const query = `
    query {
      prefecture {
        code
        name
      }
    }
  `;

  // ヘッダー名は公式ドキュメントで要確認。別の場合は x-api-key 等に変更してください。
  const response = await fetch(MLIT_DPF_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': apiKey,
    },
    body: JSON.stringify({ query: query.trim() }),
  });

  if (!response.ok) {
    throw new Error(
      `国土交通省DPF API error: ${response.status} ${response.statusText}`
    );
  }

  const json = (await response.json()) as GraphQLPrefectureResponse;

  if (json.errors && json.errors.length > 0) {
    throw new Error(
      json.errors.map((e) => e.message).join(', ') || 'GraphQL error'
    );
  }

  if (!json.data?.prefecture) {
    throw new Error('Unexpected response structure from 国土交通省DPF API');
  }

  return json.data.prefecture;
}

/**
 * e-Stat（政府統計の総合窓口）API クライアント
 * 都道府県別・年別の総人口などを取得する。
 * @see https://www.e-stat.go.jp/api/
 */

const ESTAT_BASE = 'https://api.e-stat.go.jp/rest/3.0/app/json';

// 人口推計 都道府県別 総人口・日本人人口（令和2年国勢調査基準）- 年別
const STATS_DATA_ID_POPULATION = '0003448237';

// e-Stat の時間軸コード → 西暦年（この統計表のメタ情報より）
const TIME_CODE_TO_YEAR: Record<string, number> = {
  '1601': 2020,
  '1301': 2021,
  '1701': 2022,
  '1801': 2023,
  '1901': 2024,
};

type EstatValue = {
  '@time': string;
  $: string;
};

type EstatDataResponse = {
  GET_STATS_DATA?: {
    RESULT: { STATUS: number; ERROR_MSG?: string };
    STATISTICAL_DATA?: {
      DATA_INF?: {
        VALUE?: EstatValue[] | EstatValue;
      };
    };
  };
};

/**
 * 都道府県コード（1-47）を e-Stat の地域コード（5桁）に変換
 * 例: 1 → "01000", 13 → "13000"
 */
function prefCodeToAreaCode(prefCode: number): string {
  return String(prefCode).padStart(2, '0') + '000';
}

/**
 * e-Stat から都道府県の総人口（年別）を取得する。
 * 取得できる年は統計表に依存（0003448237 は 2020-2024 等）。
 */
export async function fetchPopulationByPrefecture(
  appId: string,
  prefCode: number
): Promise<{ year: number; value: number }[]> {
  const cdArea = prefCodeToAreaCode(prefCode);
  const params = new URLSearchParams({
    appId,
    statsDataId: STATS_DATA_ID_POPULATION,
    cdArea,
    cdCat01: '000', // 男女計
    cdCat02: '01000', // 総数（年齢階級）
    cdCat03: '001', // 総人口
    metaGetFlg: 'N',
  });

  const url = `${ESTAT_BASE}/getStatsData?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`e-Stat API error: ${res.status}`);
  }

  const json = (await res.json()) as EstatDataResponse;
  const result = json.GET_STATS_DATA?.RESULT;
  const dataInf = json.GET_STATS_DATA?.STATISTICAL_DATA?.DATA_INF;

  if (result?.STATUS !== 0 || !dataInf?.VALUE) {
    throw new Error(result?.ERROR_MSG ?? 'e-Stat: no data');
  }

  const values = Array.isArray(dataInf.VALUE) ? dataInf.VALUE : [dataInf.VALUE];
  const series: { year: number; value: number }[] = [];

  for (const v of values) {
    const year = TIME_CODE_TO_YEAR[v['@time']];
    if (year == null) continue;
    const num = parseInt(v.$.replace(/,/g, ''), 10);
    if (Number.isNaN(num)) continue;
    series.push({ year, value: num * 1000 }); // 単位は千人
  }

  return series.sort((a, b) => a.year - b.year);
}

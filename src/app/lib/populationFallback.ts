/**
 * 人口データのフォールバック（国土交通省DPFには人口構成APIがないため）
 * 都道府県別・年別の近似値を返す。本番ではe-Stat API等への差し替えを推奨。
 */

const LABELS = ['総人口', '年少人口', '生産年齢人口', '老年人口'] as const;

// 2020年時点の都道府県別総人口（千人）概算（国勢調査等に基づく近似）
const POP_2020: Record<number, number> = {
  1: 5250,
  2: 1238,
  3: 1210,
  4: 2304,
  5: 959,
  6: 1068,
  7: 1832,
  8: 2860,
  9: 1933,
  10: 1939,
  11: 7345,
  12: 6284,
  13: 14047,
  14: 9237,
  15: 2204,
  16: 1040,
  17: 1132,
  18: 766,
  19: 811,
  20: 2048,
  21: 1977,
  22: 3632,
  23: 7542,
  24: 1770,
  25: 1414,
  26: 2579,
  27: 8838,
  28: 5460,
  29: 1324,
  30: 922,
  31: 553,
  32: 671,
  33: 1882,
  34: 2810,
  35: 1342,
  36: 719,
  37: 958,
  38: 1335,
  39: 691,
  40: 5136,
  41: 811,
  42: 1313,
  43: 1738,
  44: 1124,
  45: 1070,
  46: 1608,
  47: 1467,
};

const YEARS = [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];

// 総人口の1980→2025の変化率（都道府県ごとのトレンド近似）
function getTotalPopulationSeries(
  prefCode: number
): { year: number; value: number }[] {
  const base = (POP_2020[prefCode] ?? 1000) * 1000;
  const span = 45; // 1980〜2025
  return YEARS.map((year) => {
    const t = (year - 1980) / span;
    const ratio = 0.85 + 0.15 * t + (prefCode === 13 ? 0.25 * t : 0);
    return {
      year,
      value: Math.round(base * ratio * (0.92 + (0.08 * (year - 1980)) / span)),
    };
  });
}

// 年少・生産年齢・老年は総人口から按分（近似）
function getCompositionSeries(
  prefCode: number,
  type: (typeof LABELS)[number]
): { year: number; value: number }[] {
  const totalSeries = getTotalPopulationSeries(prefCode);
  return totalSeries.map(({ year, value: total }) => {
    let ratio: number;
    const t = (year - 1980) / 45;
    switch (type) {
      case '年少人口':
        ratio = 0.23 - 0.1 * t;
        break;
      case '生産年齢人口':
        ratio = 0.65 - 0.08 * t;
        break;
      case '老年人口':
        ratio = 0.12 + 0.18 * t;
        break;
      default:
        ratio = 1;
    }
    return { year, value: Math.round(total * ratio) };
  });
}

export type PopulationApiResult = {
  result: {
    data: {
      label: string;
      data: { year: number; value: number }[];
    }[];
  };
};

export function getPopulationFallback(prefCode: number): PopulationApiResult {
  const data = LABELS.map((label) => ({
    label,
    data:
      label === '総人口'
        ? getTotalPopulationSeries(prefCode)
        : getCompositionSeries(prefCode, label),
  }));
  return { result: { data } };
}

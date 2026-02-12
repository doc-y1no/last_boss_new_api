import { NextRequest, NextResponse } from 'next/server';
import { getPopulationFallback } from '../../lib/populationFallback';
import { fetchPopulationByPrefecture } from '../../lib/estatApi';

/**
 * 人口構成データ取得API
 * ESTAT_APP_ID が設定されている場合は e-Stat から総人口を取得し、
 * それ以外はフォールバックデータを返す。
 *
 * GET /api/population?prefCode=13
 */
export async function GET(request: NextRequest) {
  const prefCodeStr = request.nextUrl.searchParams.get('prefCode');
  const prefCode = prefCodeStr ? parseInt(prefCodeStr, 10) : NaN;

  if (Number.isNaN(prefCode) || prefCode < 1 || prefCode > 47) {
    return NextResponse.json(
      { error: 'prefCode は 1～47 の都道府県コードを指定してください。' },
      { status: 400 }
    );
  }

  const appId = process.env.ESTAT_APP_ID;
  const useEstat = Boolean(appId?.trim());

  try {
    const fallback = getPopulationFallback(prefCode);

    if (useEstat) {
      try {
        const estatSeries = await fetchPopulationByPrefecture(appId!, prefCode);
        if (estatSeries.length > 0) {
          const data = fallback.result.data.map((item) => {
            if (item.label === '総人口') {
              return { ...item, data: estatSeries };
            }
            return item;
          });
          return NextResponse.json({ result: { data } });
        }
      } catch (e) {
        console.warn('e-Stat fetch failed, using fallback:', e);
      }
    }

    return NextResponse.json(fallback);
  } catch (err) {
    console.error('Error in population API:', err);
    return NextResponse.json(
      { error: '人口データの取得に失敗しました。' },
      { status: 500 }
    );
  }
}

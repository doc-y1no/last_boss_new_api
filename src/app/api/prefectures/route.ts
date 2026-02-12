import { NextResponse } from 'next/server';
import { fetchPrefectures } from '../../lib/mlitApi';
import { PREFECTURES_FALLBACK } from '../../lib/prefecturesFallback';

/**
 * 都道府県一覧取得API（国土交通省DPF）
 * MLIT_API_KEY が未設定またはAPI失敗時はフォールバックの47都道府県を返す。
 * GET /api/prefectures
 */
export async function GET() {
  const apiKey = process.env.MLIT_API_KEY?.trim();

  if (apiKey) {
    try {
      const prefectures = await fetchPrefectures(apiKey);
      return NextResponse.json(
        prefectures.map((p) => ({
          prefCode: p.code,
          prefName: p.name,
        }))
      );
    } catch (err) {
      console.warn('都道府県API取得失敗、フォールバックを使用:', err);
    }
  }

  return NextResponse.json(PREFECTURES_FALLBACK);
}

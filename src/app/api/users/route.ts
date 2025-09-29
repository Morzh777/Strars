import { NextRequest } from "next/server";

import { getUserCards } from "@/lib/utils/userCardUtils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Получаем параметры из query string
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    const orderBy = searchParams.get('orderBy') as 'createdAt' | 'starsCount' | 'globalRank' || 'createdAt';
    const orderDirection = searchParams.get('orderDirection') as 'asc' | 'desc' || 'desc';
    const activeOnly = searchParams.get('activeOnly') !== 'false'; // по умолчанию true

    const { cards, totalUsers } = await getUserCards({
      limit,
      offset,
      orderBy,
      orderDirection,
      activeOnly
    });

    return Response.json({
      data: cards,
      meta: {
        limit,
        offset,
        count: cards.length,
        totalUsers,
        hasMore: limit ? cards.length === limit : false // если получили столько, сколько запросили, возможно есть еще
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

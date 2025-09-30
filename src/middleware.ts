import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

class RouteGuard {
  private readonly publicRoutes = ["/login"];
  private readonly protectedRoutes = ["/", "/payments", "/profile"];
  
  async handle(request: NextRequest): Promise<NextResponse> {
    // Проверяем авторизацию
    const authResult = await this.checkAuth(request);
    if (authResult) return authResult;
 
    return NextResponse.next();
  }
  
  private async checkAuth(request: NextRequest): Promise<NextResponse | null> {
    const { pathname } = request.nextUrl;
    const sessionCookie = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: 'session-token'
    });
    const isAuthenticated = !!sessionCookie;
    
    // Логика редиректов
    if (pathname === "/login" && isAuthenticated) {
      return this.redirectTo("/", request);
    }
    
    if (pathname !== "/login" && !isAuthenticated) {
      return this.redirectTo("/login", request);
    }

    return null;
  }
   
  private redirectTo(path: string, request: NextRequest): NextResponse {
    return NextResponse.redirect(new URL(path, request.url));
  }
}

const routeGuard = new RouteGuard();

export async function middleware(request: NextRequest) {
  return routeGuard.handle(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
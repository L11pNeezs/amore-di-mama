import {
    Outlet,
    Link,
    createRootRoute,
    useRouter,
    HeadContent,
    Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <h1 className="text-7xl font-bold text-foreground">404</h1>
                <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    A página que procuras não existe ou foi movida.
                </p>
                <div className="mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Voltar ao início
                    </Link>
                </div>
            </div>
        </main>
    );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
    console.error(error);
    const router = useRouter();
    useEffect(() => {
        reportLovableError(error, { boundary: "tanstack_root_error_component" });
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    Não foi possível carregar esta página
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Ocorreu um problema. Podes tentar novamente ou voltar ao início.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => {
                            router.invalidate();
                            reset();
                        }}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Tentar novamente
                    </button>
                    <a
                        href="/"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                        Voltar ao início
                    </a>
                </div>
            </div>
        </main>
    );
}

export const Route = createRootRoute({
    head: ({ matches }) => {
        const notFound = matches.some((match) => match.status === "notFound" || match._notFound);
        const failed = matches.some((match) => match.status === "error");
        const fallback = notFound || failed;
        const title = notFound
            ? "Página não encontrada — Amore di Mamma"
            : failed
                ? "Não foi possível carregar esta página — Amore di Mamma"
                : "Amore di Mamma — Pizza al taglio em Costa de Caparica";
        const description = notFound
            ? "A página que procuras não existe ou foi movida. Volta ao início da Amore di Mamma."
            : failed
                ? "Ocorreu um problema ao carregar esta página. Tenta novamente ou volta ao início."
                : "Pizza al taglio de estilo romano, focaccias e sabores caseiros italianos em Costa de Caparica. Massa de fermentação longa e ingredientes frescos.";
        return {
            meta: [
                { charSet: "utf-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1" },
                { title },
                { name: "description", content: description },
                { name: "author", content: "Amore di Mamma" },
                { property: "og:title", content: title },
                { property: "og:description", content: description },
                { property: "og:type", content: "website" },
                { property: "og:locale", content: "pt_PT" },
                { name: "twitter:card", content: "summary" },
                ...(fallback ? [{ name: "robots", content: "noindex, follow" }] : []),
            ],
            links: [
                { rel: "stylesheet", href: appCss },
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
                { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
                { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Dancing+Script:wght@600;700&family=Inter:wght@400;500;600&display=swap" },
            ],
        };
    },
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
    return (
        <html lang="pt-PT">
        <head>
            <HeadContent />
        </head>
        <body>
        {children}
        <Scripts />
        </body>
        </html>
    );
}

function RootComponent() {
    // Required: nested routes render here. Removing <Outlet /> breaks all child routes.
    return <Outlet />;
}

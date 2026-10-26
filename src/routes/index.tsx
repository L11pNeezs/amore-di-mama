import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CakeSlice, Menu as MenuIcon, Package, Phone } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import storefront from "@/assets/storefront.asset.json";
import tonno from "@/assets/tonno.asset.json";
import focaccia from "@/assets/focaccia.asset.json";
import slices from "@/assets/slices.asset.json";
import counter from "@/assets/counter.asset.json";
import oven from "@/assets/oven.asset.json";
import boxes from "@/assets/boxes.asset.json";

// Only stable facts also present in the page; URL/photos await production setup.
const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Amore di Mamma",
    telephone: "+351963454344",
    servesCuisine: "Italiana",
    address: {
        "@type": "PostalAddress",
        streetAddress: "Av. Humberto Delgado 47, Loja D",
        addressLocality: "Costa de Caparica",
        postalCode: "2825-337",
        addressCountry: "PT",
    },
};

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "Amore di Mamma — Pizza al taglio em Costa de Caparica" },
            { name: "description", content: "Pizza al taglio de estilo romano, focaccias e sabores caseiros italianos em Costa de Caparica." },
            { property: "og:title", content: "Amore di Mamma — Pizza al taglio" },
            { property: "og:description", content: "Pizza al taglio de estilo romano em Costa de Caparica." },
            { property: "og:url", content: "/" },
        ],
        links: [{ rel: "canonical", href: "/" }],
        scripts: [{
            type: "application/ld+json",
            children: JSON.stringify(restaurantSchema).replace(/</g, "\\u003c"),
        }],
    }),
    component: Home,
});

const pizzas = [
    { name: "Margherita", desc: "Tomate, mozzarella e manjericão", full: 26, half: 13 },
    { name: "Tonno e Cipolle", desc: "Tomate, mozzarella, atum, cebola e orégãos", full: 29, half: 14.5 },
    { name: "Piccante", desc: "Tomate, mozzarella, ’nduja e salame picante pepperoni", full: 31, half: 15.5, tag: "Picante" },
    { name: "Gourmet", desc: "Tomate, mozzarella, curgete e presunto cru", full: 29.6, half: 14.8 },
    { name: "Parmigiana", desc: "Tomate, mozzarella dupla, berinjela e parmesão", full: 29, half: 14.5, tag: "Veg" },
    { name: "Marinara", desc: "Tomate, alho e orégãos", full: 22, half: 11, tag: "Vegan" },
    { name: "Grigliata", desc: "Base branca, berinjela, curgete, pimento e orégãos", full: 27, half: 13.5, tag: "Veg" },
];

// Temporary prices until the final menu is confirmed.
const otherDishes = [
    { name: "Massa", price: 12 },
    { name: "Lasagna", price: 14 },
    { name: "Parmigiana de Berinjela", price: 13 },
];

const euroPrice = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });

function Nav() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const updateScroll = () => setScrolled(window.scrollY > 24);
        updateScroll();
        window.addEventListener("scroll", updateScroll, { passive: true });
        return () => window.removeEventListener("scroll", updateScroll);
    }, []);
    useEffect(() => {
        const desktop = window.matchMedia("(min-width: 1024px)");
        const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
        desktop.addEventListener("change", closeOnDesktop);
        return () => desktop.removeEventListener("change", closeOnDesktop);
    }, []);
    const links = [
        { href: "#sobre", label: "A Casa" },
        { href: "#menu", label: "Menu" },
        { href: "#catering", label: "Catering" },
        { href: "#galeria", label: "Galeria" },
        { href: "#visita", label: "Visita-nos" },
    ];
    return (
        <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 motion-reduce:transition-none ${scrolled ? "bg-warm-brown shadow-sm" : "bg-transparent"}`}>
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:py-6">
                <a href="#top" className="flex shrink-0 items-baseline gap-2 text-tomato focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream">
                    <span className="font-display text-2xl font-bold">Amore</span>
                    <span className="font-script text-2xl">di Mamma</span>
                </a>
                <nav aria-label="Navegação principal" className="hidden items-center gap-6 text-sm font-medium text-cream/90 lg:flex">
                    {links.map((link) => <a key={link.href} href={link.href} className="border-b border-transparent py-2 transition hover:border-cream/60 hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream">{link.label}</a>)}
                </nav>
                <a
                    href="https://wa.me/351963454344"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden shrink-0 rounded-full border border-cream/40 bg-cream/10 px-4 py-2 text-sm font-medium text-cream backdrop-blur transition hover:bg-cream/20 lg:inline-flex"
                >
                    +351 963 454 344
                </a>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button type="button" aria-label="Abrir navegação" className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-cream/30 bg-cream px-4 text-ink shadow-sm transition hover:bg-cream/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream lg:hidden">
                            <MenuIcon className="size-5" aria-hidden="true" />
                            <span className="text-sm font-semibold">Menu</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent className="flex w-[min(88vw,360px)] flex-col overflow-y-auto px-6 py-12 [&>button]:flex [&>button]:size-11 [&>button]:items-center [&>button]:justify-center">
                        <SheetTitle className="font-display text-2xl text-tomato">Amore di Mamma</SheetTitle>
                        <SheetDescription>Pizza al taglio · Costa de Caparica</SheetDescription>
                        <nav aria-label="Navegação móvel" className="mt-6 flex flex-col">
                            {links.map((link) => (
                                <SheetClose key={link.href} asChild>
                                    <a href={link.href} className="border-b border-border py-4 font-display text-2xl transition hover:text-tomato focus-visible:outline-2 focus-visible:outline-tomato">{link.label}</a>
                                </SheetClose>
                            ))}
                        </nav>
                        <SheetClose asChild>
                            <a href="https://wa.me/351963454344" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-tomato px-4 py-4 text-sm font-semibold text-cream transition hover:brightness-110">
                                <Phone className="size-4" aria-hidden="true" /> +351 963 454 344
                            </a>
                        </SheetClose>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}

function Hero() {
    return (
        <section id="top" className="relative overflow-hidden">
            <img src={oven.url} alt="Pizza al taglio a sair do forno" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink/85" />
            <div className="relative z-10 mx-auto flex min-h-[85svh] max-w-5xl flex-col items-center justify-center px-6 pb-16 pt-28 text-center md:pb-20 md:pt-32">
                <span className="font-script text-3xl text-[oklch(0.85_0.12_60)] md:text-4xl">benvenuti da</span>
                <h1 className="mt-3 font-display text-5xl font-bold tracking-tight text-cream text-balance sm:text-6xl lg:text-8xl">
                    Amore di Mamma
                </h1>
                <p className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-cream/85 md:mt-6 md:text-xl">
                    Pizza al taglio de estilo romano em Costa de Caparica. Massa de fermentação longa,
                    ingredientes frescos e o sabor das receitas de casa.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10">
                    <a
                        href="#menu"
                        className="inline-flex min-h-12 items-center justify-center rounded-full bg-tomato px-8 py-3 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-tomato/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                    >
                        Ver menu
                    </a>
                    <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Amore+di+Mamma+Costa+de+Caparica"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-cream/40 bg-cream/5 px-8 py-3 text-sm font-semibold text-cream backdrop-blur transition-colors hover:bg-cream/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                    >
                        Como chegar
                    </a>
                </div>
            </div>
        </section>
    );
}

function About() {
    return (
        <section id="sobre" className="relative py-16 md:py-28">
            <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center md:gap-16">
                <div className="relative">
                    <img src={counter.url} alt="Balcão com pizzas frescas" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl" loading="lazy" decoding="async" />
                    <img src={focaccia.url} alt="Focaccia com presunto" className="absolute -bottom-10 -right-6 hidden h-48 w-48 rounded-2xl object-cover shadow-2xl ring-8 ring-background md:block" loading="lazy" decoding="async" />
                </div>
                <div>
                    <span className="divider-leaf w-full justify-center text-xs font-semibold uppercase tracking-[0.2em] md:w-auto md:justify-start">la nostra storia</span>
                    <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                        Receitas de casa, <em className="font-normal text-tomato">feitas com amor</em>.
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                        Amore di Mamma é uma pizzaria ao corte de estilo romano, criada para trazer o verdadeiro
                        conforto das receitas caseiras ao teu dia. Massas leves, fermentações longas e ingredientes
                        frescos — preparados com cuidado, servidos com um sorriso.
                    </p>
                    <div className="mt-8 flex gap-8 border-t border-border pt-6 md:mt-10 md:gap-12 md:pt-8">
                        <Stat n="48h" l="Fermentação" />
                        <Stat n="100%" l="Caseiro" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function Stat({ n, l }: { n: string; l: string }) {
    return (
        <div>
            <div className="font-display text-3xl font-bold text-tomato md:text-4xl">{n}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
        </div>
    );
}

function Menu() {
    return (
        <section id="menu" className="relative bg-[oklch(0.96_0.022_80)] py-16 md:py-28">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center">
                    <span className="divider-leaf text-xs font-semibold uppercase tracking-[0.2em]">il menu</span>
                    <h2 className="mt-4 text-4xl font-bold md:text-5xl">O nosso menu</h2>
                </div>

                <h3 className="mt-10 text-center text-3xl font-bold md:mt-14">Pizzas</h3>
                <div className="mt-5 text-center text-sm text-muted-foreground">
                    <p className="flex flex-wrap justify-center gap-x-6 gap-y-1">
                        <span>Inteira · 60 × 40 cm</span>
                        <span>Meia · 30 × 40 cm</span>
                    </p>
                </div>

                <div className="mt-10 grid gap-x-12 gap-y-8 md:mt-16 md:grid-cols-2">
                    {pizzas.map((p) => (
                        <article key={p.name} className="group border-b border-dashed border-border pb-6">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                <h4 className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 font-display text-2xl font-bold text-foreground">
                                    {p.name}
                                    {p.tag && (
                                        <span className="rounded-full bg-basil/15 px-2 py-0.5 font-body text-xs font-semibold uppercase tracking-wider text-basil-text">
                                            {p.tag}
                                        </span>
                                    )}
                                </h4>
                                <dl className="grid shrink-0 grid-cols-[5rem_5rem] gap-3 tabular-nums sm:text-right">
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Inteira</dt>
                                        <dd className="mt-1 whitespace-nowrap text-lg font-semibold text-tomato">{euroPrice.format(p.full)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Meia</dt>
                                        <dd className="mt-1 whitespace-nowrap text-lg text-muted-foreground">{euroPrice.format(p.half)}</dd>
                                    </div>
                                </dl>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                        </article>
                    ))}
                </div>

                <p className="mt-12 text-center text-xs italic text-muted-foreground">
                    ’Nduja é um salame picante e cremoso, originário da Calábria.
                </p>

                <section aria-labelledby="other-dishes-title" className="mt-12 border-t border-border pt-10 md:mt-16 md:pt-14">
                    <h3 id="other-dishes-title" className="text-center text-3xl font-bold">Mais sabores de Itália</h3>
                    <div className="mt-8 grid gap-x-12 gap-y-6 md:mt-10 md:grid-cols-2">
                        {otherDishes.map((dish) => (
                            <article key={dish.name} className="flex items-baseline justify-between gap-4 border-b border-dashed border-border pb-6">
                                <h4 className="text-2xl font-bold">{dish.name}</h4>
                                <span className="shrink-0 whitespace-nowrap text-lg font-semibold tabular-nums text-tomato">{euroPrice.format(dish.price)}</span>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </section>
    );
}

function Catering() {
    return (
        <section id="catering" aria-labelledby="catering-title" className="bg-warm-brown py-16 text-cream md:py-28">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-crust">Catering · Momentos para partilhar</span>
                    <h2 id="catering-title" className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                        A tua festa, <em className="font-normal text-crust">a nossa pizza</em>.
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed text-cream/80">
                        Festas de aniversário, encontros de família ou uma mesa cheia de amigos.
                        Preparamos caixas de pizza al taglio para levares o sabor da Amore di Mamma à tua celebração.
                    </p>
                    <div className="mt-8 space-y-5">
                        <div className="flex gap-4">
                            <CakeSlice className="mt-1 size-5 shrink-0 text-crust" aria-hidden="true" />
                            <div><h3 className="text-xl font-bold">Aniversários com mais sabor</h3><p className="mt-1 text-sm leading-relaxed text-cream/70">Pizza para juntar os teus convidados à mesa e celebrar em boa companhia.</p></div>
                        </div>
                        <div className="flex gap-4">
                            <Package className="mt-1 size-5 shrink-0 text-crust" aria-hidden="true" />
                            <div><h3 className="text-xl font-bold">Caixas prontas a partilhar</h3><p className="mt-1 text-sm leading-relaxed text-cream/70">Fala connosco para combinar os sabores, as quantidades e a data da tua festa.</p></div>
                        </div>
                    </div>
                    <a
                        href="https://wa.me/351963454344"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-tomato px-6 py-3 text-sm font-semibold text-cream shadow-sm transition-colors hover:bg-tomato/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                    >
                        <Phone className="size-4 shrink-0" aria-hidden="true" />
                        Falar sobre catering
                    </a>
                </div>
                <div className="relative">
                    <img src={boxes.url} alt="Caixas de pizza para partilhar em festas" className="aspect-[4/3] w-full rounded-2xl object-cover md:aspect-[4/5]" loading="lazy" />
                    <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-cream/20 bg-ink/90 p-5 text-center backdrop-blur sm:bottom-6 sm:left-6 sm:right-6">
                        <p className="font-display text-2xl">Feita com amor. Para partilhar.</p>
                        <p className="mt-2 text-xs uppercase tracking-widest text-cream/70">Aniversários · Família · Amigos</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Gallery() {
    const imgs = [
        { src: tonno.url, alt: "Pizza Tonno e Cipolle", cls: "col-span-2 md:row-span-2" },
        { src: slices.url, alt: "Fatias de pizza al taglio" },
        { src: focaccia.url, alt: "Focaccia com presunto" },
        { src: boxes.url, alt: "Caixas de pizza para levar" },
        { src: storefront.url, alt: "Fachada Amore di Mamma" },
    ];
    return (
        <section id="galeria" className="py-16 md:py-28">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center">
                    <span className="divider-leaf text-xs font-semibold uppercase tracking-[0.2em]">la galleria</span>
                    <h2 className="mt-4 text-4xl font-bold md:text-5xl">Um aroma a forno a lenha</h2>
                </div>
                <div className="mt-8 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[220px] md:mt-14 md:grid-cols-4 md:gap-4">
                    {imgs.map((i) => (
                        <div key={i.alt} className={`overflow-hidden rounded-2xl ${i.cls ?? ""}`}>
                            <img src={i.src} alt={i.alt} className="h-full w-full object-cover transition duration-700 motion-safe:hover:scale-105" loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Visit() {
    return (
        <section id="visita" className="relative overflow-hidden bg-warm-brown py-16 text-cream md:py-28">
            <div className="relative mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2 md:gap-12">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-crust">vieni a trovarci</span>
                    <h2 className="mt-3 text-4xl font-bold md:text-5xl">Visita-nos</h2>
                    <p className="mt-5 max-w-md text-cream/80">
                        A poucos passos da praia — perfeito para uma pizza ao corte para levar ou para saborear à mesa.
                    </p>

                    <dl className="mt-10 space-y-6 text-sm">
                        <Row label="Morada">
                            Av. Humberto Delgado 47, Loja D<br />
                            2825-337 Costa de Caparica
                        </Row>
                        <Row label="Telefone">
                            <a href="tel:+351963454344" className="underline-offset-4 hover:underline">+351 963 454 344</a>
                        </Row>
                        <Row label="Horário">
                            Sex · Sáb · Dom — 10:30 às 14:30<br />
                            <span className="text-cream/60">(novo horário em teste)</span>
                        </Row>
                    </dl>
                </div>

                <div className="overflow-hidden rounded-2xl border border-cream/15 shadow-2xl">
                    <iframe
                        title="Mapa Amore di Mamma"
                        src="https://www.google.com/maps?q=Amore+di+Mamma+Costa+de+Caparica&output=embed"
                        className="h-full min-h-[300px] w-full md:min-h-[420px]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </section>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <dt className="w-24 shrink-0 text-xs uppercase tracking-[0.2em] text-cream/50">{label}</dt>
            <dd className="leading-relaxed text-cream/95">{children}</dd>
        </div>
    );
}

function Footer() {
    return (
        <footer className="border-t border-border bg-background py-10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
                <div className="flex items-baseline gap-2">
                    <span className="font-display text-lg font-bold text-tomato">Amore</span>
                    <span className="font-script text-lg text-tomato">di Mamma</span>
                </div>
                <p>© {new Date().getFullYear()} Amore di Mamma · Pizza al taglio · Costa de Caparica</p>
            </div>
        </footer>
    );
}

function Home() {
    return (
        <>
            <a href="#conteudo" className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:m-0 focus:h-auto focus:w-auto focus:overflow-visible focus:whitespace-normal focus:rounded-md focus:bg-cream focus:px-4 focus:py-3 focus:text-ink focus:[clip:auto] focus:outline-2 focus:outline-offset-2 focus:outline-tomato">
                Saltar para o conteúdo
            </a>
            <Nav />
            <main id="conteudo" tabIndex={-1}>
                <Hero />
                <About />
                <Menu />
                <Catering />
                <Gallery />
                <Visit />
            </main>
            <Footer />
        </>
    );
}

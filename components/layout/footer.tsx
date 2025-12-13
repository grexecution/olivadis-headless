import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary-dark text-cream-light">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-h4 font-serif italic text-cream mb-4">Olivadis</h3>
            <p className="text-body-sm">
              Premium-Olivenöl von unserer Familie zu Ihrer.
              100% griechisch, biologisch und nachhaltig produziert.
            </p>
          </div>

          <div>
            <h4 className="text-body font-bold mb-4">Schnelllinks</h4>
            <ul className="space-y-2 text-body-sm">
              <li><Link href="/shop" className="hover:text-cream transition-colors">Shop</Link></li>
              <li><Link href="/#about" className="hover:text-cream transition-colors">Unsere Geschichte</Link></li>
              <li><Link href="/rezepte" className="hover:text-cream transition-colors">Rezepte</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-body font-bold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-body-sm">
              <li><Link href="/impressum" className="hover:text-cream transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-cream transition-colors">Datenschutz</Link></li>
              <li><Link href="/widerruf" className="hover:text-cream transition-colors">Widerruf</Link></li>
              <li><Link href="/versand" className="hover:text-cream transition-colors">Versand</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-body font-bold mb-4">Kontakt</h4>
            <p className="text-body-sm">
              E-Mail: <a href="mailto:office@olivadis.com" className="hover:text-cream transition-colors">office@olivadis.com</a><br />
              Website: <a href="https://olivadis.com" className="hover:text-cream transition-colors">olivadis.com</a>
            </p>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-8 pt-8 text-center text-body-sm">
          <p>&copy; {new Date().getFullYear()} Olivadis. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}

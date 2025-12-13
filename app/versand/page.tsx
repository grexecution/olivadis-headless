import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Versand und Versandkosten | Olivadis',
  description: 'Informationen zu Versand und Versandkosten bei Olivadis',
}

export default function VersandPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-h1 md:text-h1-lg text-primary font-serif mb-8">
            Versand und Versandkosten
          </h1>

          <section className="mb-12">
            <p className="text-body-lg mb-6">
              Wir liefern nach Österreich und Deutschland. Unsere Produkte werden sorgfältig verpackt und schnell versendet.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-cream p-6 rounded-lg">
                <h2 className="text-h3 text-primary font-serif mb-4">Österreich</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-body font-bold">Versandpartner:</p>
                    <p className="text-body">Österreichische Post</p>
                  </div>
                  <div>
                    <p className="text-body font-bold">Versandkosten:</p>
                    <p className="text-body">€ 5,99 pro Bestellung</p>
                  </div>
                  <div>
                    <p className="text-body font-bold">Kostenloser Versand:</p>
                    <p className="text-body">Ab einem Bestellwert von € 80</p>
                  </div>
                </div>
              </div>

              <div className="bg-cream p-6 rounded-lg">
                <h2 className="text-h3 text-primary font-serif mb-4">Deutschland</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-body font-bold">Versandpartner:</p>
                    <p className="text-body">DHL</p>
                  </div>
                  <div>
                    <p className="text-body font-bold">Versandkosten:</p>
                    <p className="text-body">€ 5,99 pro Bestellung</p>
                  </div>
                  <div>
                    <p className="text-body font-bold">Kostenloser Versand:</p>
                    <p className="text-body">Ab einem Bestellwert von € 80</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <h3 className="text-h4 text-primary font-bold mb-3">Lieferzeit</h3>
              <p className="text-body mb-3">
                Die Lieferzeit beträgt in der Regel 2-3 Werktage für Österreich und 3-4 Werktage für Deutschland nach Versand der Ware.
              </p>
              <p className="text-body">
                Sie erhalten eine Versandbestätigung per E-Mail, sobald Ihre Bestellung unser Lager verlässt.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 md:text-h3-lg text-primary font-serif mb-4">
              Kontakt
            </h2>
            <p className="text-body mb-4">
              Bei Fragen zum Versand erreichen Sie uns unter:
            </p>
            <div className="bg-cream p-6 rounded-lg">
              <p className="text-body font-bold mb-2">E-Mail:</p>
              <p className="text-body">
                <a href="mailto:office@olivadis.com" className="text-primary hover:text-primary-light underline">
                  office@olivadis.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

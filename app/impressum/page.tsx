import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum | Olivadis',
  description: 'Rechtliche Informationen und Kontaktdaten der Olivadis GmbH',
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-h1 md:text-h1-lg text-primary font-serif mb-8">
            Impressum
          </h1>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">Angaben gemäß § 5 TMG</h2>
            <div className="bg-cream p-6 rounded-lg space-y-4">
              <div>
                <p className="text-body font-bold">Olivadis GmbH</p>
                <p className="text-body">1020 Wien</p>
                <p className="text-body">Schmelzgasse 9/1/7</p>
                <p className="text-body">Österreich</p>
              </div>

              <div className="pt-4 border-t border-primary/20">
                <p className="text-body"><span className="font-bold">UID-Nr:</span> ATU80316748</p>
                <p className="text-body"><span className="font-bold">FN:</span> 621457h</p>
                <p className="text-body"><span className="font-bold">FB-Gericht:</span> Wien</p>
                <p className="text-body"><span className="font-bold">Kammer:</span> WKÖ (Wirtschaftskammer Österreich)</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">Kontakt</h2>
            <div className="bg-cream p-6 rounded-lg space-y-3">
              <div>
                <p className="text-body font-bold">E-Mail:</p>
                <p className="text-body">
                  <a href="mailto:office@olivadis.com" className="text-primary hover:text-primary-light underline">
                    office@olivadis.com
                  </a>
                </p>
              </div>
              <div>
                <p className="text-body font-bold">Telefon:</p>
                <p className="text-body">
                  <a href="tel:+436604949651" className="text-primary hover:text-primary-light underline">
                    +43 660 494 96 51
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">Bankverbindung</h2>
            <div className="bg-cream p-6 rounded-lg space-y-2">
              <p className="text-body"><span className="font-bold">IBAN:</span> AT65 2011 1849 7721 7400</p>
              <p className="text-body"><span className="font-bold">BIC:</span> GIBAATWWXXX</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">Aufsichtsbehörde/Gewerbebehörde</h2>
            <div className="bg-cream p-6 rounded-lg space-y-2">
              <p className="text-body">Magistrat der Stadt Wien</p>
              <p className="text-body">Berufsgruppe: Handel mit Lebensmitteln</p>
              <p className="text-body">
                Gewerbeordnung: <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light underline">www.ris.bka.gv.at</a>
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">Online-Streitbeilegung gemäß Art. 14 Abs. 1 ODR-VO</h2>
            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <p className="text-body mb-3">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              </p>
              <p className="text-body">
                <a href="http://ec.europa.eu/odr" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light underline font-bold">
                  http://ec.europa.eu/odr
                </a>
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">Verbraucherstreitbeilegung</h2>
            <div className="bg-cream p-6 rounded-lg">
              <p className="text-body">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-h3 text-primary font-serif mb-4">Haftungsausschluss</h2>
            <div className="space-y-4 text-body">
              <div>
                <h3 className="font-bold mb-2">Haftung für Inhalte</h3>
                <p>
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Haftung für Links</h3>
                <p>
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

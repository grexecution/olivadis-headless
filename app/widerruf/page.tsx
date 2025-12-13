import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Widerrufsbelehrung | Olivadis',
  description: 'Widerrufsrecht und Widerrufsformular für Olivadis Bestellungen',
}

export default function WiderrufsbelehrungPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 md:py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-h1 md:text-h1-lg text-primary font-serif mb-8">
            Widerrufsbelehrung und Widerrufsformular
          </h1>

          <section className="mb-12">
            <h2 className="text-h3 md:text-h3-lg text-primary font-serif mb-4">
              Widerrufsrecht
            </h2>
            <p className="text-body mb-4">
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
            </p>
            <p className="text-body mb-4">
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
            </p>
            <p className="text-body mb-4">
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns:
            </p>
            <div className="bg-cream p-6 rounded-lg mb-6">
              <p className="text-body font-bold mb-2">Olivadis</p>
              <p className="text-body">Pteleos, 37007 Pteleos</p>
              <p className="text-body">Griechenland</p>
              <p className="text-body">E-Mail: office@olivadis.com</p>
            </div>
            <p className="text-body mb-4">
              mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
            </p>
            <p className="text-body mb-4">
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 md:text-h3-lg text-primary font-serif mb-4">
              Folgen des Widerrufs
            </h2>
            <p className="text-body mb-4">
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
            </p>
            <p className="text-body mb-4">
              Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
            </p>
            <p className="text-body mb-4">
              Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.
            </p>
            <p className="text-body mb-4 font-bold">
              Wir tragen die Kosten der Rücksendung der Waren.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 md:text-h3-lg text-primary font-serif mb-4">
              Widerrufsformular
            </h2>
            <div className="bg-cream/50 p-8 rounded-lg border border-primary/20">
              <p className="text-body mb-4 italic">
                Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-body font-bold mb-2">An:</p>
                  <p className="text-body">Olivadis</p>
                  <p className="text-body">Pteleos, 37007 Pteleos, Griechenland</p>
                  <p className="text-body">E-Mail: office@olivadis.com</p>
                </div>
                <div>
                  <p className="text-body mb-2">
                    Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)
                  </p>
                </div>
                <div>
                  <p className="text-body">Bestellt am (*) / erhalten am (*): _________________</p>
                </div>
                <div>
                  <p className="text-body">Name des/der Verbraucher(s): _________________</p>
                </div>
                <div>
                  <p className="text-body">Anschrift des/der Verbraucher(s): _________________</p>
                </div>
                <div>
                  <p className="text-body">Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): _________________</p>
                </div>
                <div>
                  <p className="text-body">Datum: _________________</p>
                </div>
                <div>
                  <p className="text-body-sm italic mt-4">(*) Unzutreffendes streichen.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

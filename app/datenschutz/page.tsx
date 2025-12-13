import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | Olivadis',
  description: 'Datenschutzerklärung und Informationen zum Umgang mit personenbezogenen Daten bei Olivadis',
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-h1 md:text-h1-lg text-primary font-serif mb-8">
            Datenschutzerklärung
          </h1>

          <section className="mb-12">
            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 mb-6">
              <p className="text-body">
                Danke für Ihr Interesse an unserem Unternehmen. Wir nehmen den Datenschutz ernst und möchten, dass Sie wissen, wann wir welche Daten speichern und wie wir sie verwenden.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">1. Verantwortliche Stelle</h2>
            <div className="bg-cream p-6 rounded-lg">
              <p className="text-body font-bold mb-2">Olivadis GmbH</p>
              <p className="text-body">vertreten durch die Geschäftsführerin Dimitra Tsiatsima</p>
              <p className="text-body">1020 Wien, Schmelzgasse 9/1/7</p>
              <p className="text-body">Österreich</p>
              <p className="text-body mt-3">
                E-Mail: <a href="mailto:office@olivadis.com" className="text-primary hover:text-primary-light underline">office@olivadis.com</a>
              </p>
              <p className="text-body">
                Telefon: <a href="tel:+306955395525" className="text-primary hover:text-primary-light underline">+30 (0)695 – 5395525</a>
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">2. Erfasste Daten beim Besuch unserer Website</h2>
            <div className="space-y-4 text-body">
              <p>
                Bei jedem Aufruf unserer Internetseite erfasst unser System automatisiert Daten und Informationen vom Computersystem des aufrufenden Rechners.
              </p>
              <div className="bg-cream p-4 rounded-lg">
                <p className="font-bold mb-2">Folgende Daten werden erhoben:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Informationen über den Browsertyp und die verwendete Version</li>
                  <li>Das Betriebssystem des Nutzers</li>
                  <li>Die IP-Adresse des Nutzers</li>
                  <li>Datum und Uhrzeit des Zugriffs</li>
                  <li>Websites, von denen das System des Nutzers auf unsere Internetseite gelangt</li>
                </ul>
              </div>
              <p>
                Diese Daten werden in den Logfiles unseres Systems gespeichert. Eine Speicherung dieser Daten zusammen mit anderen personenbezogenen Daten des Nutzers findet nicht statt.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">3. Datenerfassung bei Bestellungen</h2>
            <div className="space-y-4 text-body">
              <p>
                Wenn Sie über unseren Online-Shop eine Bestellung aufgeben, erfassen wir folgende personenbezogene Daten:
              </p>
              <div className="bg-cream p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Name und Vorname</li>
                  <li>Adresse (Straße, Hausnummer, PLZ, Ort, Land)</li>
                  <li>E-Mail-Adresse</li>
                  <li>Telefonnummer</li>
                  <li>Bestellte Produkte und Bestellhistorie</li>
                  <li>Zahlungsinformationen (je nach gewählter Zahlungsmethode)</li>
                </ul>
              </div>
              <p>
                Diese Daten sind für die Vertragserfüllung erforderlich. Ohne diese Daten können wir Ihre Bestellung nicht bearbeiten und ausführen.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">4. Kontaktformular und E-Mail-Kontakt</h2>
            <div className="space-y-4 text-body">
              <p>
                Wenn Sie uns über ein Kontaktformular oder per E-Mail kontaktieren, werden Ihre Angaben inklusive der von Ihnen dort angegebenen Kontaktdaten zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
              </p>
              <p>
                Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">5. Rechtsgrundlage der Verarbeitung</h2>
            <div className="space-y-4 text-body">
              <p>
                Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Grundlage folgender Rechtsgrundlagen gemäß DSGVO:
              </p>
              <div className="bg-cream p-4 rounded-lg space-y-2">
                <p><span className="font-bold">Art. 6 Abs. 1 lit. a DSGVO:</span> Einwilligung (z.B. bei Newsletter-Anmeldung)</p>
                <p><span className="font-bold">Art. 6 Abs. 1 lit. b DSGVO:</span> Vertragserfüllung (z.B. bei Bestellungen)</p>
                <p><span className="font-bold">Art. 6 Abs. 1 lit. f DSGVO:</span> Berechtigte Interessen (z.B. bei Web-Analyse)</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">6. Weitergabe von Daten</h2>
            <div className="space-y-4 text-body">
              <p>
                Eine Übermittlung Ihrer persönlichen Daten an Dritte erfolgt nur:
              </p>
              <div className="bg-cream p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Zur Vertragserfüllung an Logistikdienstleister für die Zustellung</li>
                  <li>An Zahlungsdienstleister (z.B. PayPal) zur Abwicklung der Zahlung</li>
                  <li>Wenn Sie ausdrücklich eingewilligt haben</li>
                  <li>Wenn eine gesetzliche Verpflichtung besteht</li>
                </ul>
              </div>
              <p>
                Wir verkaufen Ihre Daten nicht an Dritte und geben sie nicht ohne Rechtsgrundlage weiter.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">7. Cookies</h2>
            <div className="space-y-4 text-body">
              <p>
                Unsere Internetseiten verwenden Cookies. Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert.
              </p>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="font-bold mb-2">Verwendete Cookie-Typen:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Technisch notwendige Cookies (z.B. Session-Cookies für den Warenkorb)</li>
                  <li>Analyse-Cookies (z.B. Google Analytics)</li>
                </ul>
              </div>
              <p>
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben oder generell ausschließen.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">8. Google Analytics</h2>
            <div className="space-y-4 text-body">
              <p>
                Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. Google Analytics verwendet Cookies.
              </p>
              <p>
                Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Durch die Aktivierung der IP-Anonymisierung auf dieser Webseite wird Ihre IP-Adresse von Google jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">9. Ihre Rechte</h2>
            <div className="space-y-4 text-body">
              <p>
                Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
              </p>
              <div className="bg-cream p-4 rounded-lg space-y-2">
                <p><span className="font-bold">Recht auf Auskunft</span> (Art. 15 DSGVO)</p>
                <p><span className="font-bold">Recht auf Berichtigung</span> (Art. 16 DSGVO)</p>
                <p><span className="font-bold">Recht auf Löschung</span> (Art. 17 DSGVO)</p>
                <p><span className="font-bold">Recht auf Einschränkung der Verarbeitung</span> (Art. 18 DSGVO)</p>
                <p><span className="font-bold">Recht auf Datenübertragbarkeit</span> (Art. 20 DSGVO)</p>
                <p><span className="font-bold">Widerspruchsrecht</span> (Art. 21 DSGVO)</p>
              </div>
              <p>
                Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-h3 text-primary font-serif mb-4">10. Datensicherheit</h2>
            <div className="space-y-4 text-body">
              <p>
                Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird.
              </p>
              <p>
                Wir bedienen uns im Übrigen geeigneter technischer und organisatorischer Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-h3 text-primary font-serif mb-4">11. Aktualität und Änderung dieser Datenschutzerklärung</h2>
            <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
              <p className="text-body">
                Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Dezember 2024. Durch die Weiterentwicklung unserer Website und Angebote oder aufgrund geänderter gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

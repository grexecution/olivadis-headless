import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Heart, Users, MapPin, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Über Uns | Olivadis',
  description: 'Erfahren Sie mehr über die Olivadis-Familie und unsere Leidenschaft für Premium-Olivenöl aus Pteleos, Griechenland.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative bg-primary text-cream py-32 lg:py-40 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?w=1600&auto=format&fit=crop&q=80"
            alt="Greek olive grove"
            fill
            className="object-cover"
            priority
          />
          {/* Green Overlay for Brand Consistency */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/80"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-h1 mb-6">Willkommen bei der Olivadis Familie</h1>
            <p className="text-body-lg leading-relaxed">
              Wir sind ein griechischer Familienbetrieb aus Pteleos, der mit Leidenschaft
              und Tradition Premium-Olivenöl produziert.
            </p>
          </div>
        </div>
      </section>

      {/* Family Story Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-primary-light/10 text-primary-light rounded-full text-body-sm font-semibold mb-4">
                  Unsere Geschichte
                </span>
              </div>
              <h2 className="text-h2 text-primary mb-6">
                "Alles, was gut wird, braucht Zeit"
              </h2>
              <div className="space-y-4 text-body text-primary-dark">
                <p>
                  Diese Worte meines Vaters begleiten mich seit meiner Kindheit. Schon als kleines Kind
                  lernte ich von ihm die Kunst des Olivenanbaus und die Bedeutung von Geduld im Ernteprozess.
                </p>
                <p>
                  Heute führe ich gemeinsam mit meinen Geschwistern das Familienunternehmen weiter. Wir bewahren
                  die traditionellen Methoden unseres Vaters und lassen die Oliven am Baum vollständig reifen,
                  bevor wir sie ernten – für optimale Geschmacksentwicklung.
                </p>
                <p>
                  Unsere Olivenhaine profitieren von der starken griechischen Mittelmeersonne in der Küstenlage
                  rund um Pteleos. Diese idealen Bedingungen schaffen ein Olivenöl von außergewöhnlicher Qualität.
                </p>
              </div>
              <div className="mt-8">
                <p className="font-serif italic text-h4 text-primary">Nicki</p>
                <p className="text-body-sm text-primary-dark/60">Gründerin, Olivadis</p>
              </div>
            </div>

            {/* Values Cards */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-cream rounded-lg p-6">
                <Heart className="w-12 h-12 text-primary-light mb-4" />
                <h3 className="text-h4 text-primary mb-2">Familientradition</h3>
                <p className="text-body text-primary-dark/70">
                  Seit Generationen geben wir unser Wissen über den Olivenanbau weiter und pflegen
                  die Traditionen unserer Vorfahren.
                </p>
              </div>
              <div className="bg-cream rounded-lg p-6">
                <Clock className="w-12 h-12 text-primary-light mb-4" />
                <h3 className="text-h4 text-primary mb-2">Qualität durch Geduld</h3>
                <p className="text-body text-primary-dark/70">
                  Wir ernten nur vollreife Oliven zum perfekten Zeitpunkt –
                  ohne Kompromisse bei der Qualität.
                </p>
              </div>
              <div className="bg-cream rounded-lg p-6">
                <Users className="w-12 h-12 text-primary-light mb-4" />
                <h3 className="text-h4 text-primary mb-2">Handarbeit</h3>
                <p className="text-body text-primary-dark/70">
                  Jede Olive wird von Hand gepflückt und traditionell kaltgepresst –
                  so wie es unsere Vorfahren gelehrt haben.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-cream/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-primary mb-4">Unsere Reise</h2>
            <p className="text-body-lg text-primary-dark/70 max-w-2xl mx-auto">
              Von den ersten Olivenbäumen bis zum Premium-Olivenöl von heute
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-light/30 hidden md:block" />

              {/* Timeline Items */}
              <div className="space-y-12">
                <TimelineItem
                  year="1970er"
                  title="Die ersten Olivenbäume"
                  description="Unser Vater pflanzt die ersten Olivenbäume in Pteleos, Griechenland. Mit viel Liebe und Geduld baut er unsere Olivenhaine auf."
                />
                <TimelineItem
                  year="1990er"
                  title="Familientradition entsteht"
                  description="Die nächste Generation lernt die Kunst des Olivenanbaus. Wir Kinder verbringen unsere Sommer in den Olivenhainen und lernen von unserem Vater."
                />
                <TimelineItem
                  year="2015"
                  title="Erste eigene Ernte"
                  description="Nach Jahren des Lernens übernehmen wir die Verantwortung. Die erste Ernte unter unserer Führung wird mit traditionellen Methoden durchgeführt."
                />
                <TimelineItem
                  year="2018"
                  title="Olivadis wird geboren"
                  description="Wir gründen Olivadis, um unser Premium-Olivenöl mit Familien weltweit zu teilen. Der Name vereint 'Oliva' (Olive) und 'Adis' (Familie auf Griechisch)."
                />
                <TimelineItem
                  year="2020"
                  title="Bio-Zertifizierung"
                  description="Unsere Olivenhaine erhalten die offizielle Bio-Zertifizierung. Wir arbeiten im Einklang mit der Natur – wie es schon immer war."
                />
                <TimelineItem
                  year="2023"
                  title="Expansion nach Europa"
                  description="Tausende Familien in ganz Europa genießen nun unser Olivenöl. Die Olivadis-Familie wächst stetig."
                />
                <TimelineItem
                  year="2024"
                  title="Neue Generation"
                  description="Die nächste Generation tritt in die Fußstapfen. Unsere Kinder lernen bereits die Familientradition und helfen bei der Ernte."
                  isLast
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 text-primary mb-4">Unsere Philosophie</h2>
              <p className="text-body-lg text-primary-dark/70">
                Was Olivadis Olivenöl besonders macht
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="space-y-6">
                <PhilosophyItem
                  text="Zum richtigen Zeitpunkt gepflückt – wir warten, bis die Oliven perfekt gereift sind"
                />
                <PhilosophyItem
                  text="Keine Umwege, kein Schnickschnack – traditionelle Verarbeitung ohne Zusätze"
                />
                <PhilosophyItem
                  text="Sorgfältig verpackt und versendet – jede Flasche wird mit Liebe behandelt"
                />
                <PhilosophyItem
                  text="100% griechisch – alle Oliven kommen aus unseren eigenen Hainen in Pteleos"
                />
                <PhilosophyItem
                  text="Handgepflückt und kaltgepresst – wie es unsere Vorfahren gelehrt haben"
                />
                <PhilosophyItem
                  text="Für die ganze Familie – mild im Geschmack, auch Kinder lieben es"
                />
              </div>

              <div className="mt-8 pt-8 border-t border-primary/10 text-center">
                <p className="text-body-lg text-primary italic font-serif">
                  "Das ist Olivadis. Das Olivenöl der Griechen."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-primary-light/5">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <MapPin className="w-16 h-16 text-primary-light mx-auto mb-6" />
            <h2 className="text-h2 text-primary mb-6">Pteleos, Griechenland</h2>
            <p className="text-body-lg text-primary-dark mb-8">
              Unsere Olivenhaine liegen in der malerischen Küstenregion von Pteleos in Griechenland.
              Die mediterrane Sonne, der Meereswind und die fruchtbare Erde schaffen ideale
              Bedingungen für außergewöhnliches Olivenöl.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-lg p-6">
                <p className="text-h3 text-primary mb-2">300+</p>
                <p className="text-body text-primary-dark/70">Sonnentage pro Jahr</p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <p className="text-h3 text-primary mb-2">2000+</p>
                <p className="text-body text-primary-dark/70">Liter jährliche Produktion</p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <p className="text-h3 text-primary mb-2">100%</p>
                <p className="text-body text-primary-dark/70">Familiengeführt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-cream">
        <div className="container text-center">
          <h2 className="text-h2 mb-6">Werden Sie Teil der Olivadis Familie</h2>
          <p className="text-body-lg mb-8 max-w-2xl mx-auto">
            Erleben Sie den Unterschied von echtem, familiengeführtem Premium-Olivenöl.
            Sorgfältig von Hand gepflückt, traditionell gepresst und mit Liebe verpackt.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-4 bg-cream text-primary rounded-full text-button font-bold hover:bg-cream/90 transition-colors inline-flex items-center gap-2"
            >
              Jetzt entdecken
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/rezepte"
              className="px-8 py-4 bg-primary-light text-cream rounded-full text-button font-bold hover:bg-primary-light/90 transition-colors"
            >
              Rezepte ansehen
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * Timeline Item Component
 */
interface TimelineItemProps {
  year: string
  title: string
  description: string
  isLast?: boolean
}

function TimelineItem({ year, title, description, isLast }: TimelineItemProps) {
  return (
    <div className="relative flex gap-6 md:gap-8">
      {/* Timeline Dot */}
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-primary-light text-cream flex items-center justify-center font-bold text-body z-10 relative">
          {year}
        </div>
        {!isLast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-primary-light/30 md:hidden" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <h3 className="text-h3 text-primary mb-2">{title}</h3>
        <p className="text-body text-primary-dark/70">{description}</p>
      </div>
    </div>
  )
}

/**
 * Philosophy Item Component
 */
interface PhilosophyItemProps {
  text: string
}

function PhilosophyItem({ text }: PhilosophyItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-light/10 flex items-center justify-center mt-1">
        <Check className="w-4 h-4 text-primary-light" />
      </div>
      <p className="text-body text-primary-dark">{text}</p>
    </div>
  )
}

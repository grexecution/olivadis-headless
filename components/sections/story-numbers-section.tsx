import Image from 'next/image'

interface Stat {
  number: string
  label: string
  description: string
}

const stats: Stat[] = [
  {
    number: '50+',
    label: 'Jahre',
    description: 'Familientradition seit 1970',
  },
  {
    number: '3',
    label: 'Generationen',
    description: 'Weitergegeben mit Liebe',
  },
  {
    number: '100%',
    label: 'Bio',
    description: 'Zertifiziert & nachhaltig',
  },
  {
    number: '2000+',
    label: 'Olivenbäume',
    description: 'In Pteleos, Griechenland',
  },
]

export default function StoryNumbersSection() {
  return (
    <section className="relative py-24 overflow-hidden" aria-labelledby="story-numbers">
      {/* Large Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?w=1920&auto=format&fit=crop&q=80"
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary/85" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <p className="text-cream/80 uppercase tracking-widest text-sm font-semibold mb-4">
              Unsere Geschichte in Zahlen
            </p>
            <h2 id="story-numbers" className="text-h2 md:text-h2-lg text-white font-serif mb-6">
              Tradition trifft <span className="italic text-cream">Leidenschaft</span>
            </h2>
            <p className="text-base md:text-body-lg text-white/90 max-w-2xl mx-auto">
              Seit über einem halben Jahrhundert produzieren wir mit Hingabe das feinste Bio-Olivenöl Griechenlands
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group"
              >
                {/* Number */}
                <div className="mb-4">
                  <div className="text-5xl md:text-6xl font-bold text-cream group-hover:scale-110 transition-transform duration-300 inline-block">
                    {stat.number}
                  </div>
                </div>

                {/* Label */}
                <div className="text-lg md:text-xl font-serif text-white/90 mb-2">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-white/70 leading-relaxed">
                  {stat.description}
                </div>

                {/* Decorative Line */}
                <div className="mt-6 h-1 w-16 bg-cream/30 mx-auto group-hover:bg-cream/60 group-hover:w-24 transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Bottom Quote */}
          <div className="mt-20 text-center">
            <blockquote className="text-xl md:text-2xl font-serif italic text-white/95 max-w-3xl mx-auto leading-relaxed">
              "Jede Flasche trägt die Liebe und das Wissen von drei Generationen griechischer Olivenbauern"
            </blockquote>
            <p className="mt-4 text-cream/80 text-sm">
              — Die Olivadis Familie
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

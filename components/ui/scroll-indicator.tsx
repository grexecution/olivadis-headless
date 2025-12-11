'use client'

export function ScrollIndicator() {
  const handleScroll = () => {
    const nextSection = document.querySelector('section:nth-of-type(2)')
    nextSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button
      onClick={handleScroll}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer hover:scale-110 transition-transform z-10"
      aria-label="Scroll to next section"
    >
      <div className="w-6 h-10 border-2 border-cream rounded-full flex justify-center">
        <div className="w-1 h-3 bg-cream rounded-full mt-2 animate-pulse"></div>
      </div>
    </button>
  )
}

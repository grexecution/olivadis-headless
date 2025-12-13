'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart-context"

const navLinks = [
  { href: "/", label: "Startseite" },
  { href: "/shop", label: "Shop" },
  { href: "/rezepte", label: "Rezepte" },
  { href: "/ueber-uns", label: "Unsere Geschichte" },
  { href: "/checkout", label: "Kasse" },
]

export function Navbar() {
  const { openCart, totalItems } = useCart()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav className={`
      fixed top-[41px] md:top-9 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled ? 'md:px-4' : ''}
    `}>
      <div className={`
        transition-all duration-500 ease-in-out
        ${isScrolled
          ? 'md:mt-4 md:rounded-2xl shadow-2xl md:max-w-7xl md:mx-auto'
          : 'rounded-none shadow-lg'
        }
        bg-primary text-cream
      `}>
        <div className="container mx-auto">
          <div className={`
            flex items-center justify-between transition-all duration-500
            ${isScrolled ? 'h-16' : 'h-20'}
          `}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <div className={`
              relative transition-all duration-500 group-hover:scale-110
              ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}
            `}>
              <Image
                src="/olivadis-logo.svg"
                alt="Olivadis Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 32px, 40px"
                priority
              />
            </div>
            <span className={`
              font-serif italic tracking-tight group-hover:text-cream-light transition-all duration-500
              ${isScrolled ? 'text-h4 md:text-h3' : 'text-h3 md:text-h3-lg'}
            `}>
              Olivadis
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-4 py-2 text-body font-semibold tracking-tight transition-all duration-300
                  hover:text-cream-light
                  ${isActive(link.href) ? "text-cream" : "text-cream/80"}
                `}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cream rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 hover:bg-primary-light rounded-lg transition-all duration-300 hover:scale-105"
              aria-label="Warenkorb öffnen"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-cream text-primary text-[10px] md:text-xs font-bold rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 hover:bg-primary-light rounded-lg transition-all duration-300"
              aria-label="Menü"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 bg-primary/70 backdrop-blur-md md:hidden z-40 ${
              isScrolled ? 'top-[105px]' : 'top-[120px]'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="container mx-auto px-6 py-12"
            >
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1 + index * 0.05,
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        block px-6 py-4 text-h3 font-serif tracking-tight rounded-xl
                        transition-all duration-300
                        ${
                          isActive(link.href)
                            ? "bg-cream text-primary"
                            : "text-cream hover:bg-primary-light hover:translate-x-2"
                        }
                      `}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <motion.div
                          layoutId="mobile-active"
                          className="h-1 w-12 bg-primary rounded-full mt-2"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Menu Footer */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12 pt-8 border-t border-cream/20"
              >
                <p className="text-body text-cream/60 text-center">
                  Premium Bio-Olivenöl aus Griechenland
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

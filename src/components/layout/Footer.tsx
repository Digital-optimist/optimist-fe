"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Linkedin, Instagram } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// X (Twitter) icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const navLinksCol1 = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/products", label: "Products" },
];

const navLinksCol2 = [
  { href: "/contact-us", label: "Contact us" },
  { href: "/blogs", label: "Blogs" },
  { href: "/faq", label: "FAQ's" },
];

const socialLinks = [
  { href: "#", icon: Linkedin, label: "LinkedIn" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: XIcon, label: "X" },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");

  useGSAP(
    () => {
      // Image animation
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: footerRef }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email subscription
    console.log("Subscribe:", email);
    setEmail("");
  };

  return (
    <footer ref={footerRef} className="relative overflow-hidden">
      {/* Blue Cool Background */}
      <div className="absolute inset-0 " style={{backdropFilter: "blur(200px)"}}>
        <Image
          src="/BlueCoolBackground.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-12 md:pt-16 pb-8 md:pb-12">
        {/* Top Section - Links & Newsletter */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Column 1 - Nav Links */}
          <nav className="flex flex-col gap-4">
            {navLinksCol1.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base text-optimist-cream hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Column 2 - Nav Links */}
          <nav className="flex flex-col gap-4">
            {navLinksCol2.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base text-optimist-cream hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Column 3 - Social Links */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-base text-optimist-cream mb-4">Social links</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-optimist-dark border border-optimist-border flex items-center justify-center text-optimist-cream hover:bg-optimist-blue-primary hover:border-optimist-blue-primary transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="col-span-2 md:col-span-2">
            <p className="text-xs uppercase tracking-wider text-optimist-cream-muted mb-4">
              GET UPDATES
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter your email"
                className="w-full md:flex-1 px-4 py-3 bg-optimist-dark border border-optimist-border rounded-full text-optimist-cream placeholder:text-optimist-cream-muted focus:outline-none focus:border-optimist-blue-primary transition-colors"
              />
              <button
                type="submit"
                className="btn-buy-now w-full md:w-auto md:px-6 py-3 rounded-full text-white font-semibold text-sm whitespace-nowrap"
              >
                Get Updates
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section - Family Image with Logo */}
        <div ref={imageRef} className="relative">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden">
            {/* Family Image */}
            <Image
              src="/Family.png"
              alt="Happy family enjoying comfort"
              fill
              className="object-cover z-0"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />

            {/* Blue Gradient Overlay - higher z-index than family image */}
            <div className="absolute inset-0 z-10">
              <Image
                src="/BlueCoolBackground.png"
                alt=""
                fill
                className="object-cover opacity-60"
              />
            </div>

            {/* Logo Overlay */}
            <div className="absolute inset-0 z-20 flex items-end justify-center pb-6 md:pb-10 px-4 md:px-8">
              <Image
                src="/Frame 48095518.png"
                alt="Optimist"
                width={800}
                height={150}
                className="w-[80%] md:w-[70%] lg:w-[60%] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

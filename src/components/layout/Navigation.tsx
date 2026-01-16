"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  Package,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { OptimistLogo } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Product" },
  { href: "/about", label: "About us" },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const {
    isAuthenticated,
    customer,
    logout,
    isLoading: isAuthLoading,
  } = useAuth();
  const { totalQuantity, toggleCart } = useCart();

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          linksRef.current?.children || [],
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 },
          "-=0.5"
        )
        .fromTo(
          actionsRef.current?.children || [],
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 },
          "-=0.3"
        );
    },
    { scope: navRef }
  );

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-[#FFFCDC]/20"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Left Navigation - Desktop */}
            <div ref={linksRef} className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={`${link.href}-${index}`}
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#FFFCDC]"
                        : "text-[#FFFCDC]-muted hover:text-[#FFFCDC]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#FFFCDC]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Left Logo - Mobile */}
            <div className="md:hidden flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <OptimistLogo
                  height={24}
                  className="text-[#FFFCDC] transition-transform group-hover:scale-110"
                />
                <span className="text-lg font-medium tracking-tight text-[#FFFCDC]">
                  optimist
                </span>
              </Link>
            </div>

            {/* Center Logo - Desktop */}
            <div
              ref={logoRef}
              className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-2"
            >
              <Link href="/" className="flex items-center gap-2 group">
                <OptimistLogo
                  height={28}
                  className="text-[#FFFCDC] transition-transform group-hover:scale-110"
                />
                <span className="text-xl font-medium tracking-tight text-[#FFFCDC]">
                  optimist
                </span>
              </Link>
            </div>

            {/* Right Actions */}
            <div ref={actionsRef} className="flex items-center gap-3 md:gap-4">
              {/* User Menu - Desktop when authenticated */}
              {isAuthenticated && (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFFCDC]/20 text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {customer?.firstName || "Account"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-black/40 backdrop-blur-xl border border-[#FFFCDC]/20 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-[#FFFCDC]/20">
                          <p className="text-sm font-medium text-[#FFFCDC] truncate">
                            {customer?.firstName} {customer?.lastName}
                          </p>
                          <p className="text-xs text-[#FFFCDC]-muted truncate">
                            {customer?.email}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/account"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#FFFCDC]-muted hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            My Account
                          </Link>
                          <Link
                            href="/account/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#FFFCDC]-muted hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
                          >
                            <Package className="w-4 h-4" />
                            Order History
                          </Link>
                          <Link
                            href="/account/addresses"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#FFFCDC]-muted hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
                          >
                            <MapPin className="w-4 h-4" />
                            Addresses
                          </Link>
                        </div>
                        <div className="border-t border-[#FFFCDC]/20 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Cart Button - Desktop */}
              <button
                onClick={toggleCart}
                className="relative hidden md:flex items-center gap-2 text-[#FFFCDC]-muted hover:text-[#FFFCDC] transition-colors"
              >
                <span className="text-sm font-medium">Cart</span>
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-optimist-blue-primary text-white rounded-full">
                      {totalQuantity > 99 ? "99+" : totalQuantity}
                    </span>
                  )}
                </div>
              </button>

              {/* Login Button - Desktop (when not authenticated) */}
              {!isAuthenticated && !isAuthLoading && (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full border border-[#FFFCDC]/20 text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-all"
                >
                  <span className="text-sm font-medium">Login</span>
                  <User className="w-4 h-4" />
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFFCDC]/20 text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-all"
              >
                <span className="text-sm font-medium">Menu</span>
                {isMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/20 backdrop-blur-xl border-t border-[#FFFCDC]/20">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={`${link.href}-${index}`}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-[#FFFCDC] bg-[#FFFCDC]/5"
                        : "text-[#FFFCDC]-muted hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile Cart */}
              <button
                onClick={() => {
                  toggleCart();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium rounded-lg text-[#FFFCDC]-muted hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Cart
                {totalQuantity > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-optimist-blue-primary text-white rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <>
                  <div className="h-px bg-[#FFFCDC]/10 my-2" />
                  <Link
                    href="/account"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium rounded-lg text-[#FFFCDC]-muted hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium rounded-lg text-[#FFFCDC]-muted hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
                  >
                    Order History
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-medium rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px bg-[#FFFCDC]/10 my-2" />
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg text-[#FFFCDC]-muted hover:text-[#FFFCDC] hover:bg-[#FFFCDC]/5 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}

export default Navigation;

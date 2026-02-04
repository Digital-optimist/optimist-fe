"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Mail, Zap } from "lucide-react";

// =============================================================================
// Blog Sidebar - Newsletter subscription card
// =============================================================================

export function BlogSidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useGSAP(
    () => {
      gsap.from(sidebarRef.current, {
        opacity: 0,
        x: 30,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sidebarRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    },
    { scope: sidebarRef }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulate API call (in production, replace with actual newsletter subscription)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="relative bg-white rounded-[24px] will-change-[transform,opacity]"
    >
      {/* Inner shadow overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{ boxShadow: "inset 6px -8px 24px 0px rgba(0, 0, 0, 0.04)" }}
      />

      {/* Newsletter Card */}
      <div className="bg-[#f9fafb] rounded-[20px] p-6 sm:p-8">
        {/* Lightning Icon */}
        <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] bg-[rgba(52,120,246,0.07)] rounded-[24px] sm:rounded-[28px] flex items-center justify-center mb-6 sm:mb-8">
          <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-[#3478f6]" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Heading and Description */}
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-semibold text-[20px] sm:text-[24px] text-[#101828] leading-[1.3] sm:leading-[32px]">
              Stay updated!
            </h3>
            <p className="font-display text-[14px] sm:text-[16px] text-[rgba(0,0,0,0.5)] leading-[1.5] sm:leading-[24px]">
              No spam. Just the latest releases and tips, interesting articles,
              and exclusive interviews in your inbox every week.
            </p>
          </div>

          {/* Email Form */}
          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-[12px] p-4 text-center">
              <p className="text-green-700 font-medium text-[14px] sm:text-[16px]">
                Thanks for subscribing! Check your inbox soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-[#a3a3a3]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="johnyenglish@gmail.com"
                  className="w-full h-[44px] sm:h-[48px] bg-white border border-[#e5e5e5] rounded-[8px] pl-10 pr-4 text-[14px] sm:text-[16px] text-[#101828] placeholder:text-[#a3a3a3] focus:outline-none focus:border-[#3478f6] focus:ring-1 focus:ring-[#3478f6] transition-colors"
                />
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-[13px] sm:text-[14px]">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full h-[48px] sm:h-[52px] rounded-[36px] overflow-hidden flex items-center justify-center transition-transform duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(174.999deg, rgb(18, 101, 255) 25.27%, rgb(105, 205, 235) 87.589%, rgb(70, 245, 160) 120.92%)",
                }}
              >
                <span className="font-display font-semibold text-[14px] sm:text-[16px] text-[#fffcdc]">
                  {isSubmitting ? "Subscribing..." : "Get Updates"}
                </span>
                {/* Inner Shadow */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-[inherit]"
                  style={{ boxShadow: "inset 0px 2px 12.5px 2px #003fb2" }}
                />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogSidebar;

import { memo } from "react";

// =============================================================================
// Icon Props
// =============================================================================

interface IconProps {
  className?: string;
}

// =============================================================================
// Arrow Icons (for gallery navigation)
// =============================================================================

export const ArrowRightIcon = memo(function ArrowRightIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

// =============================================================================
// Package Icon (for delivery info)
// =============================================================================

export const PackageIcon = memo(function PackageIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.75 8.125L6.25 4.0625"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 13.3333V6.66667C17.4997 6.42448 17.435 6.18679 17.3124 5.97762C17.1898 5.76845 17.0139 5.59519 16.8021 5.47583L10.5521 1.8925C10.3857 1.79741 10.1958 1.74731 10.0026 1.74731C9.80936 1.74731 9.61942 1.79741 9.45312 1.8925L3.20312 5.47583C2.99129 5.59519 2.8154 5.76845 2.6928 5.97762C2.5702 6.18679 2.50545 6.42448 2.50521 6.66667V13.3333C2.50545 13.5755 2.5702 13.8132 2.6928 14.0224C2.8154 14.2316 2.99129 14.4048 3.20312 14.5242L9.45312 18.1075C9.61942 18.2026 9.80936 18.2527 10.0026 18.2527C10.1958 18.2527 10.3857 18.2026 10.5521 18.1075L16.8021 14.5242C17.0139 14.4048 17.1898 14.2316 17.3124 14.0224C17.435 13.8132 17.4997 13.5755 17.5 13.3333Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.69531 5.95L10.0036 10.0083L17.312 5.95"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 18.3333V10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

// =============================================================================
// Shopping Bag Icon (for Add to Cart button)
// =============================================================================

export const ShoppingBagIcon = memo(function ShoppingBagIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 6H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

// =============================================================================
// Trophy Icon (for Details section)
// =============================================================================

export const TrophyIcon = memo(function TrophyIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.25 17.5H13.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14.375V17.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 2.5H6.25V8.75C6.25 9.74456 6.64509 10.6984 7.34835 11.4016C8.05161 12.1049 9.00544 12.5 10 12.5C10.9946 12.5 11.9484 12.1049 12.6517 11.4016C13.3549 10.6984 13.75 9.74456 13.75 8.75V2.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 5H3.125C2.95924 5 2.80027 5.06585 2.68306 5.18306C2.56585 5.30027 2.5 5.45924 2.5 5.625V6.25C2.5 7.24456 2.89509 8.19839 3.59835 8.90165C4.30161 9.60491 5.25544 10 6.25 10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 5H16.875C17.0408 5 17.1997 5.06585 17.3169 5.18306C17.4342 5.30027 17.5 5.45924 17.5 5.625V6.25C17.5 7.24456 17.1049 8.19839 16.4017 8.90165C15.6984 9.60491 14.7446 10 13.75 10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

// =============================================================================
// Shield Check Icon (for Details section - Warranty)
// =============================================================================

export const ShieldCheckIcon = memo(function ShieldCheckIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 18.3333C10 18.3333 16.6667 15 16.6667 10V4.16667L10 1.66667L3.33333 4.16667V10C3.33333 15 10 18.3333 10 18.3333Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10L9.16667 11.6667L12.5 8.33333"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

// =============================================================================
// Wrench Icon (for Details section - Installation)
// =============================================================================

export const WrenchIcon = memo(function WrenchIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0833 4.58333C12.9946 4.58316 13.8812 4.87686 14.6125 5.42044C15.3439 5.96402 15.8804 6.72806 16.1431 7.5988C16.4058 8.46954 16.3806 9.40099 16.0714 10.2567C15.7621 11.1124 15.1851 11.8472 14.425 12.35L12.5 17.5H7.5L5.575 12.35C4.81489 11.8472 4.23788 11.1124 3.92865 10.2567C3.61941 9.40099 3.59421 8.46954 3.85691 7.5988C4.11961 6.72806 4.6561 5.96402 5.38746 5.42044C6.11882 4.87686 7.00538 4.58316 7.91667 4.58333H12.0833Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 17.5V15.8333"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 17.5V15.8333"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12.5V10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33333 10C8.79357 10 9.16667 9.6269 9.16667 9.16667C9.16667 8.70643 8.79357 8.33333 8.33333 8.33333C7.8731 8.33333 7.5 8.70643 7.5 9.16667C7.5 9.6269 7.8731 10 8.33333 10Z"
        fill="currentColor"
      />
      <path
        d="M11.6667 10C12.1269 10 12.5 9.6269 12.5 9.16667C12.5 8.70643 12.1269 8.33333 11.6667 8.33333C11.2064 8.33333 10.8333 8.70643 10.8333 9.16667C10.8333 9.6269 11.2064 10 11.6667 10Z"
        fill="currentColor"
      />
    </svg>
  );
});

// =============================================================================
// Radio Button Icons (for variant selection)
// =============================================================================

export const RadioFilledIcon = memo(function RadioFilledIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="7.5" stroke="#3478F6" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="4" fill="#3478F6" />
    </svg>
  );
});

export const RadioEmptyIcon = memo(function RadioEmptyIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="10"
        cy="10"
        r="7.5"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1.5"
      />
    </svg>
  );
});

// =============================================================================
// Status Icons
// =============================================================================

export const CheckCircleIcon = memo(function CheckCircleIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#22C55E" />
      <path
        d="M8 12L11 15L16 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const XCircleIcon = memo(function XCircleIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#FFFCDC" />
      <path
        d="M15 9L9 15M9 9L15 15"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

// =============================================================================
// Product Detail Icons
// =============================================================================

export const DiamondIcon = memo(function DiamondIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L2 9L12 22L22 9L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 9H22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2L8 9L12 22L16 9L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const WarrantyIcon = memo(function WarrantyIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3L4 7V12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const InstallationIcon = memo(function InstallationIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.7 6.3C14.5 6.1 14.2 6 14 6H10C9.4 6 9 6.4 9 7V11C9 11.6 9.4 12 10 12H14C14.6 12 15 11.6 15 11V7C15 6.8 14.9 6.5 14.7 6.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12V16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 16H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 16V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 16V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6V4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const DeliveryIcon = memo(function DeliveryIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 6V12L16 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const CartIcon = memo(function CartIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 11L12 14L22 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

// =============================================================================
// Result Section Icons
// =============================================================================

export const SnowflakeIcon = memo(function SnowflakeIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2V22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2L8 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2L16 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22L8 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 22L16 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.34 7L20.66 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.34 7L4.34 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.34 7L7.34 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.66 17L19.66 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.66 17L16.66 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.66 7L3.34 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.66 7L16.66 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.66 7L19.66 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.34 17L7.34 20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.34 17L4.34 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const PiggyBankIcon = memo(function PiggyBankIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V13C22 13.5304 21.7893 14.0391 21.4142 14.4142C21.0391 14.7893 20.5304 15 20 15H19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 18V20C5 20.2652 5.10536 20.5196 5.29289 20.7071C5.48043 20.8946 5.73478 21 6 21H8C8.26522 21 8.51957 20.8946 8.70711 20.7071C8.89464 20.5196 9 20.2652 9 20V18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 18V20C15 20.2652 15.1054 20.5196 15.2929 20.7071C15.4804 20.8946 15.7348 21 16 21H18C18.2652 21 18.5196 20.8946 18.7071 20.7071C18.8946 20.5196 19 20.2652 19 20V18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9H10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12C3 10.4087 3.63214 8.88258 4.75736 7.75736C5.88258 6.63214 7.4087 6 9 6H15C16.5913 6 18.1174 6.63214 19.2426 7.75736C20.3679 8.88258 21 10.4087 21 12C21 13.5913 20.3679 15.1174 19.2426 16.2426C18.1174 17.3679 16.5913 18 15 18H9C7.4087 18 5.88258 17.3679 4.75736 16.2426C3.63214 15.1174 3 13.5913 3 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const PersonWalkIcon = memo(function PersonWalkIcon({
  className,
}: IconProps) {
  return (
    <svg
      width="17"
      height="21"
      viewBox="0 0 17 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.4876 6C11.0809 6 11.661 5.82405 12.1543 5.49441C12.6477 5.16477 13.0322 4.69623 13.2592 4.14805C13.4863 3.59987 13.5457 2.99667 13.43 2.41473C13.3142 1.83279 13.0285 1.29824 12.6089 0.878681C12.1894 0.459123 11.6548 0.173401 11.0729 0.0576455C10.4909 -0.0581102 9.88773 0.00129984 9.33955 0.228363C8.79137 0.455426 8.32283 0.839943 7.99319 1.33329C7.66355 1.82664 7.4876 2.40666 7.4876 3C7.4876 3.79565 7.80367 4.55871 8.36628 5.12132C8.92889 5.68393 9.69195 6 10.4876 6ZM10.4876 1.5C10.7843 1.5 11.0743 1.58797 11.321 1.7528C11.5676 1.91762 11.7599 2.15189 11.8734 2.42598C11.9869 2.70007 12.0167 3.00167 11.9588 3.29264C11.9009 3.58361 11.758 3.85088 11.5483 4.06066C11.3385 4.27044 11.0712 4.4133 10.7802 4.47118C10.4893 4.52906 10.1877 4.49935 9.91357 4.38582C9.63948 4.27229 9.40522 4.08003 9.24039 3.83336C9.07557 3.58668 8.9876 3.29667 8.9876 3C8.9876 2.60218 9.14563 2.22065 9.42694 1.93934C9.70824 1.65804 10.0898 1.5 10.4876 1.5ZM16.4876 12C16.4876 12.1989 16.4086 12.3897 16.2679 12.5303C16.1273 12.671 15.9365 12.75 15.7376 12.75C12.4273 12.75 10.7735 11.0803 9.4451 9.73875C9.18822 9.47906 8.9426 9.2325 8.6951 9.00375L7.43604 11.8988L10.9235 14.3897C11.0207 14.4591 11.0999 14.5507 11.1545 14.6568C11.2091 14.763 11.2376 14.8806 11.2376 15V20.25C11.2376 20.4489 11.1586 20.6397 11.0179 20.7803C10.8773 20.921 10.6865 21 10.4876 21C10.2887 21 10.0979 20.921 9.95727 20.7803C9.81662 20.6397 9.7376 20.4489 9.7376 20.25V15.3863L6.82479 13.305L3.67572 20.5491C3.61744 20.6831 3.52126 20.7972 3.39901 20.8773C3.27676 20.9574 3.13376 21.0001 2.9876 21C2.88461 21.0002 2.78272 20.9788 2.68853 20.9372C2.50621 20.8579 2.36282 20.7095 2.28987 20.5246C2.21691 20.3397 2.22037 20.1333 2.29947 19.9509L7.36947 8.29125C6.49666 8.13657 5.40822 8.40375 4.11635 9.09563C3.08603 9.66395 2.12442 10.3487 1.25041 11.1366C1.10452 11.2672 0.913309 11.3357 0.717637 11.3272C0.521965 11.3188 0.337362 11.2341 0.203286 11.0913C0.0692114 10.9486 -0.0036977 10.759 0.000144502 10.5632C0.0039867 10.3674 0.0842752 10.1808 0.223848 10.0434C0.458223 9.82313 6.00729 4.67813 9.47885 7.69219C9.83791 8.00344 10.1801 8.34844 10.5101 8.68313C11.8179 10.0031 13.0526 11.25 15.7376 11.25C15.9365 11.25 16.1273 11.329 16.2679 11.4697C16.4086 11.6103 16.4876 11.8011 16.4876 12Z"
        fill="#3478F6"
      />
    </svg>
  );
});

// =============================================================================
// After Buy Section Icons
// =============================================================================

export const OrderConfirmIcon = memo(function OrderConfirmIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="18" stroke="#3478F6" strokeWidth="2" />
      <path
        d="M13 20L18 25L27 15"
        stroke="#3478F6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const UserCircleCheckIcon = memo(function UserCircleCheckIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="14" r="6" stroke="#3478F6" strokeWidth="2" />
      <path
        d="M8 34C8 27.373 13.373 22 20 22C26.627 22 32 27.373 32 34"
        stroke="#3478F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="32"
        cy="32"
        r="6"
        fill="white"
        stroke="#3478F6"
        strokeWidth="2"
      />
      <path
        d="M29 32L31 34L35 30"
        stroke="#3478F6"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const ScrollDocIcon = memo(function ScrollDocIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="6"
        width="24"
        height="28"
        rx="2"
        stroke="#3478F6"
        strokeWidth="2"
      />
      <path
        d="M14 14H26"
        stroke="#3478F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 20H26"
        stroke="#3478F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 26H20"
        stroke="#3478F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
});

export const ToolboxIcon = memo(function ToolboxIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="14"
        width="32"
        height="20"
        rx="2"
        stroke="#3478F6"
        strokeWidth="2"
      />
      <path
        d="M14 14V10C14 8.89543 14.8954 8 16 8H24C25.1046 8 26 8.89543 26 10V14"
        stroke="#3478F6"
        strokeWidth="2"
      />
      <path d="M4 22H36" stroke="#3478F6" strokeWidth="2" />
      <rect x="17" y="20" width="6" height="4" rx="1" fill="#3478F6" />
    </svg>
  );
});

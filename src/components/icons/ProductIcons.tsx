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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.9795 14.0714C21.003 14.167 21.0075 14.2664 20.9926 14.3638C20.9777 14.4611 20.9438 14.5546 20.8928 14.6389C20.8418 14.7232 20.7747 14.7966 20.6953 14.8549C20.6159 14.9132 20.5258 14.9554 20.4301 14.9789L18.1201 15.5414L18.7257 17.8017C18.7513 17.8968 18.7578 17.9961 18.7449 18.0938C18.7321 18.1915 18.7001 18.2857 18.6508 18.371C18.6015 18.4563 18.5359 18.5311 18.4577 18.591C18.3795 18.651 18.2903 18.695 18.1951 18.7204C18.132 18.7386 18.0668 18.7487 18.0011 18.7504C17.8361 18.7503 17.6757 18.6957 17.5449 18.5952C17.4141 18.4947 17.32 18.3539 17.2773 18.1945L16.5536 15.4945L12.7511 13.2998V17.6901L14.7817 19.7198C14.8514 19.7895 14.9066 19.8722 14.9444 19.9632C14.9821 20.0543 15.0015 20.1519 15.0015 20.2504C15.0015 20.349 14.9821 20.4465 14.9444 20.5376C14.9066 20.6286 14.8514 20.7114 14.7817 20.781C14.712 20.8507 14.6293 20.906 14.5382 20.9437C14.4472 20.9814 14.3496 21.0008 14.2511 21.0008C14.1525 21.0008 14.0549 20.9814 13.9639 20.9437C13.8728 20.906 13.7901 20.8507 13.7204 20.781L12.0011 19.0607L10.2817 20.781C10.212 20.8507 10.1293 20.906 10.0382 20.9437C9.94719 20.9814 9.84961 21.0008 9.75106 21.0008C9.65252 21.0008 9.55494 20.9814 9.46389 20.9437C9.37285 20.906 9.29012 20.8507 9.22044 20.781C9.15075 20.7114 9.09548 20.6286 9.05777 20.5376C9.02006 20.4465 9.00065 20.349 9.00065 20.2504C9.00065 20.1519 9.02006 20.0543 9.05777 19.9632C9.09548 19.8722 9.15075 19.7895 9.22044 19.7198L11.2511 17.6901V13.2998L7.4495 15.4945L6.72575 18.1945C6.68302 18.354 6.58883 18.495 6.45779 18.5955C6.32676 18.696 6.16621 18.7505 6.00106 18.7504C5.93525 18.7503 5.86972 18.7418 5.80606 18.7251C5.71088 18.6996 5.62165 18.6557 5.54346 18.5957C5.46527 18.5358 5.39967 18.461 5.35039 18.3757C5.30111 18.2904 5.26913 18.1962 5.25627 18.0985C5.24341 18.0008 5.24992 17.9015 5.27544 17.8064L5.88106 15.546L3.57106 14.9835C3.37787 14.9361 3.21145 14.8138 3.10843 14.6436C3.0054 14.4734 2.9742 14.2692 3.02169 14.076C3.06918 13.8828 3.19147 13.7164 3.36166 13.6134C3.53185 13.5104 3.73599 13.4792 3.92919 13.5267L6.69013 14.2045L10.5011 12.0004L6.69106 9.80104L3.93013 10.4789C3.87155 10.4934 3.81141 10.5006 3.75106 10.5004C3.56768 10.5005 3.3906 10.4335 3.25331 10.3119C3.11602 10.1903 3.02804 10.0226 3.00599 9.8406C2.98394 9.65854 3.02935 9.47472 3.13365 9.32388C3.23794 9.17304 3.39389 9.06564 3.572 9.02198L5.882 8.45948L5.27638 6.19448C5.22491 6.00228 5.2519 5.79751 5.35141 5.62521C5.45092 5.45291 5.6148 5.3272 5.807 5.27573C5.9992 5.22426 6.20397 5.25125 6.37627 5.35076C6.54857 5.45027 6.67428 5.61416 6.72575 5.80635L7.4495 8.50635L11.2511 10.701V6.31073L9.22044 4.28104C9.07971 4.14031 9.00065 3.94944 9.00065 3.75042C9.00065 3.65187 9.02006 3.55429 9.05777 3.46324C9.09548 3.3722 9.15075 3.28947 9.22044 3.21979C9.29012 3.15011 9.37285 3.09483 9.46389 3.05712C9.55494 3.01941 9.65252 3 9.75106 3C9.95009 3 10.141 3.07906 10.2817 3.21979L12.0011 4.9401L13.7204 3.21979C13.8612 3.07906 14.052 3 14.2511 3C14.4501 3 14.641 3.07906 14.7817 3.21979C14.9224 3.36052 15.0015 3.55139 15.0015 3.75042C15.0015 3.94944 14.9224 4.14031 14.7817 4.28104L12.7511 6.31073V10.701L16.5526 8.50635L17.2764 5.80635C17.3278 5.61416 17.4536 5.45027 17.6259 5.35076C17.7982 5.25125 18.0029 5.22426 18.1951 5.27573C18.3873 5.3272 18.5512 5.45291 18.6507 5.62521C18.7502 5.79751 18.7772 6.00228 18.7257 6.19448L18.1201 8.45479L20.4301 9.01729C20.6132 9.05639 20.775 9.16255 20.8838 9.3149C20.9926 9.46726 21.0405 9.65479 21.0181 9.84065C20.9956 10.0265 20.9045 10.1973 20.7626 10.3193C20.6206 10.4414 20.4382 10.506 20.2511 10.5004C20.1907 10.5006 20.1306 10.4934 20.072 10.4789L17.3111 9.80104L13.5011 12.0004L17.3111 14.1998L20.072 13.522C20.1677 13.4984 20.267 13.494 20.3644 13.5089C20.4618 13.5237 20.5553 13.5577 20.6396 13.6087C20.7238 13.6597 20.7972 13.7268 20.8556 13.8062C20.9139 13.8856 20.956 13.9757 20.9795 14.0714Z"
        fill="#3478F6"
      />
    </svg>
  );
});

export const PiggyBankIcon = memo(function PiggyBankIcon({
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18 10.875C18 11.0975 17.934 11.315 17.8104 11.5C17.6868 11.685 17.5111 11.8292 17.3055 11.9144C17.1 11.9995 16.8738 12.0218 16.6555 11.9784C16.4373 11.935 16.2368 11.8278 16.0795 11.6705C15.9222 11.5132 15.815 11.3127 15.7716 11.0945C15.7282 10.8762 15.7505 10.65 15.8356 10.4445C15.9208 10.2389 16.065 10.0632 16.25 9.9396C16.435 9.81598 16.6525 9.75 16.875 9.75C17.1734 9.75 17.4595 9.86853 17.6705 10.0795C17.8815 10.2905 18 10.5766 18 10.875ZM14.25 6H10.5C10.3011 6 10.1103 6.07902 9.96967 6.21967C9.82902 6.36032 9.75 6.55109 9.75 6.75C9.75 6.94891 9.82902 7.13968 9.96967 7.28033C10.1103 7.42098 10.3011 7.5 10.5 7.5H14.25C14.4489 7.5 14.6397 7.42098 14.7803 7.28033C14.921 7.13968 15 6.94891 15 6.75C15 6.55109 14.921 6.36032 14.7803 6.21967C14.6397 6.07902 14.4489 6 14.25 6ZM23.25 10.5V13.5C23.25 14.0967 23.0129 14.669 22.591 15.091C22.169 15.5129 21.5967 15.75 21 15.75H20.7788L19.2591 20.0044C19.155 20.2958 18.9634 20.5479 18.7105 20.7261C18.4575 20.9044 18.1557 21 17.8463 21H16.6538C16.3443 21 16.0425 20.9044 15.7895 20.7261C15.5366 20.5479 15.345 20.2958 15.2409 20.0044L15.0609 19.5H9.68906L9.50906 20.0044C9.40502 20.2958 9.2134 20.5479 8.96047 20.7261C8.70754 20.9044 8.40568 21 8.09625 21H6.90375C6.59433 21 6.29246 20.9044 6.03953 20.7261C5.7866 20.5479 5.59498 20.2958 5.49094 20.0044L4.3125 16.7081C3.19142 15.4393 2.48945 13.8553 2.3025 12.1725C2.06046 12.2996 1.85777 12.4905 1.71633 12.7245C1.57489 12.9584 1.50009 13.2266 1.5 13.5C1.5 13.6989 1.42098 13.8897 1.28033 14.0303C1.13968 14.171 0.948912 14.25 0.75 14.25C0.551088 14.25 0.360322 14.171 0.21967 14.0303C0.0790176 13.8897 0 13.6989 0 13.5C0.00114598 12.8312 0.225771 12.1819 0.638188 11.6553C1.05061 11.1287 1.62716 10.7551 2.27625 10.5938C2.4438 8.52687 3.38252 6.59859 4.90601 5.1918C6.42951 3.78502 8.42634 3.00263 10.5 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75C21 3.94891 20.921 4.13968 20.7803 4.28033C20.6397 4.42098 20.4489 4.5 20.25 4.5H18.2447C19.4894 5.37328 20.4683 6.57378 21.0731 7.96875C21.1134 8.0625 21.1528 8.15625 21.1903 8.25C21.7535 8.2978 22.278 8.5558 22.6596 8.97268C23.0413 9.38957 23.252 9.93482 23.25 10.5ZM21.75 10.5C21.75 10.3011 21.671 10.1103 21.5303 9.96967C21.3897 9.82902 21.1989 9.75 21 9.75H20.6569C20.4971 9.75017 20.3415 9.69934 20.2127 9.6049C20.0839 9.51047 19.9885 9.37738 19.9406 9.225C19.5109 7.85375 18.6542 6.65571 17.4956 5.8057C16.337 4.95569 14.937 4.49821 13.5 4.5H10.5C9.19005 4.49993 7.90838 4.88103 6.81128 5.59682C5.71419 6.31261 4.84907 7.33217 4.32143 8.53115C3.79379 9.73014 3.62643 11.0568 3.83975 12.3492C4.05308 13.6417 4.63787 14.8442 5.52281 15.81C5.59048 15.8836 5.64276 15.97 5.67656 16.0641L6.90375 19.5H8.09625L8.45438 18.4978C8.50637 18.3522 8.60211 18.2262 8.72848 18.1371C8.85485 18.048 9.00568 18.0001 9.16031 18H15.5897C15.7443 18.0001 15.8951 18.048 16.0215 18.1371C16.1479 18.2262 16.2436 18.3522 16.2956 18.4978L16.6538 19.5H17.8463L19.5441 14.7478C19.5961 14.6022 19.6918 14.4762 19.8182 14.3871C19.9445 14.298 20.0954 14.2501 20.25 14.25H21C21.1989 14.25 21.3897 14.171 21.5303 14.0303C21.671 13.8897 21.75 13.6989 21.75 13.5V10.5Z"
        fill="#3478F6"
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

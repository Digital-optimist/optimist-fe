"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import { formatPrice, type CartLine } from "@/lib/shopify";
import { useCart } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartLine;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart, isLoading } = useCart();
  const { merchandise, quantity } = item;
  const product = merchandise.product;
  const image = product.featuredImage;
  const variantTitle =
    merchandise.title !== "Default Title" ? merchandise.title : null;

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const totalPrice = (
    parseFloat(merchandise.price.amount) * quantity
  ).toString();

  return (
    <div className="flex gap-4 py-4 border-b border-[#E5E5E5] last:border-b-0">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#F5F5F5] border border-[#E5E5E5]">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#737373]">
            <Package className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href="/products"
          className="text-[14px] font-medium text-[#0A0A0A] hover:text-[#3478F6] transition-colors line-clamp-2"
        >
          {product.title}
        </Link>
        {variantTitle && (
          <p className="text-[12px] text-[#737373] mt-1">
            {variantTitle}
          </p>
        )}
        <p className="text-[14px] font-semibold text-[#0A0A0A] mt-2">
          {formatPrice(totalPrice, merchandise.price.currencyCode)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center border border-[#E5E5E5] rounded-lg">
          <button
            onClick={handleDecrement}
            disabled={isLoading}
            className="p-2 text-[#737373] hover:text-[#0A0A0A] transition-colors disabled:opacity-50"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center text-[13px] text-[#0A0A0A]">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isLoading}
            className="p-2 text-[#737373] hover:text-[#0A0A0A] transition-colors disabled:opacity-50"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <button
          onClick={handleRemove}
          disabled={isLoading}
          className="p-1 text-[#737373] hover:text-red-500 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

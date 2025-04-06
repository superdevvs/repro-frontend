
import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Pagination = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex w-full items-center justify-center", className)}
    {...props}
  />
);

const PaginationContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => (
  <ul
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
);

const PaginationItem = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) => (
  <li className={cn("", className)} {...props} />
);

const PaginationLink = ({
  className,
  isActive,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  isActive?: boolean;
}) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "flex h-9 min-w-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm transition-colors hover:text-foreground",
      isActive &&
        "border-primary bg-primary font-medium text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
      className
    )}
    {...props}
  />
);

const PaginationPrevious = ({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    aria-label="Go to previous page"
    className={cn("flex h-9 items-center justify-center gap-1 rounded-md border border-input bg-background px-3 text-sm transition-colors hover:text-foreground", className)}
    {...props}
  />
);

const PaginationNext = ({
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    aria-label="Go to next page"
    className={cn("flex h-9 items-center justify-center gap-1 rounded-md border border-input bg-background px-3 text-sm transition-colors hover:text-foreground", className)}
    {...props}
  />
);

const PaginationEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden
    className={cn("flex h-9 min-w-9 items-center justify-center text-sm text-muted-foreground", className)}
    {...props}
  >
    …
  </span>
);

// Enhanced mobile pagination dots component
const PaginationDots = ({
  className,
  currentPage,
  totalPages,
  onPageChange,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}) => (
  <div
    className={cn("pagination-indicator", className)}
    {...props}
  >
    {Array.from({ length: totalPages }).map((_, i) => (
      <motion.button
        key={i}
        className={cn(
          "pagination-dot",
          currentPage === i + 1 && "active"
        )}
        onClick={() => onPageChange?.(i + 1)}
        whileTap={{ scale: 0.9 }}
        aria-label={`Go to page ${i + 1}`}
      />
    ))}
  </div>
);

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationDots
};

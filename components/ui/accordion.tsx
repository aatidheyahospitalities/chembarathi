"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import gsap from "gsap"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

// helper to merge Radix ref + our local ref
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === "function") {
        ref(node)
      } else {
        // @ts-ignore
        ref.current = node
      }
    }
  }
}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const localRef = React.useRef<HTMLDivElement | null>(null)

  React.useLayoutEffect(() => {
    const el = localRef.current
    if (!el) return

    // set initial height based on state
    const isOpenInitial = el.dataset.state === "open"
    gsap.set(el, {
      height: isOpenInitial ? "auto" : 0,
      overflow: "hidden",
    })

    let tween: gsap.core.Tween | null = null

    const runAnimation = () => {
      const isOpen = el.dataset.state === "open"

      if (tween) {
        tween.kill()
        tween = null
      }

      if (isOpen) {
        // OPEN: 0 -> auto
        tween = gsap.to(el, {
          height: "auto",
          duration: 0.35,
          ease: "power2.out",
        })
      } else {
        // CLOSE: current -> 0
        tween = gsap.to(el, {
          height: 0,
          duration: 0.3,
          ease: "power2.inOut",
        })
      }
    }

    // watch only data-state changes
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "data-state") {
          runAnimation()
          break
        }
      }
    })

    observer.observe(el, { attributes: true, attributeFilter: ["data-state"] })

    return () => {
      observer.disconnect()
      if (tween) tween.kill()
    }
  }, [])

  return (
    <AccordionPrimitive.Content
      ref={mergeRefs(ref, localRef)}
      forceMount // 👈 keep node in DOM so close can animate
      className={cn(
        "overflow-hidden text-sm", // same style
        className
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0")}>{children}</div>
    </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

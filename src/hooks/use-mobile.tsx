
import * as React from "react"

const MOBILE_BREAKPOINT = 768
const XS_BREAKPOINT = 480

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Default to false on server (SSR) to prevent layout shifts
    if (typeof window === 'undefined') return false
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Create a debounced version of the resize handler
    let timeoutId: number | null = null
    const debouncedHandleResize = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(handleResize, 150)
    }
    
    // Set up event listener with debounced handler
    window.addEventListener('resize', debouncedHandleResize)
    
    // Call handler right away to set initial state
    handleResize()
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  return isMobile
}

export function useIsExtraSmall() {
  const [isXs, setIsXs] = React.useState<boolean>(() => {
    // Default to false on server (SSR) to prevent layout shifts
    if (typeof window === 'undefined') return false
    return window.innerWidth < XS_BREAKPOINT
  })

  React.useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setIsXs(window.innerWidth < XS_BREAKPOINT)
    }
    
    // Create a debounced version of the resize handler
    let timeoutId: number | null = null
    const debouncedHandleResize = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(handleResize, 150)
    }
    
    // Set up event listener with debounced handler
    window.addEventListener('resize', debouncedHandleResize)
    
    // Call handler right away to set initial state
    handleResize()
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', debouncedHandleResize)
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  return isXs
}

/**
 * Mobile-Responsive Utility Styles
 * Use these helper objects with React inline styles for easy responsive layouts
 */

import { useState, useEffect } from 'react'

export const responsiveStyles = {
  // Main containers
  mainContainer: {
    mobile: {
      padding: '16px 12px',
      paddingTop: '88px', // Account for navbar
    },
    tablet: {
      padding: '24px 20px',
      paddingTop: '88px',
    },
    desktop: {
      padding: '28px 5%',
      paddingTop: '88px',
    },
  },

  // Grid layouts
  gridResponsive: {
    mobile: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '12px',
    },
    tablet: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
    },
    desktop: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
    },
  },

  // Flex layouts
  flexResponsive: {
    mobile: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    tablet: {
      display: 'flex',
      flexDirection: 'row',
      gap: '16px',
      flexWrap: 'wrap',
    },
    desktop: {
      display: 'flex',
      flexDirection: 'row',
      gap: '20px',
    },
  },

  // Text sizes
  textResponsive: {
    h1Mobile: { fontSize: '24px', fontWeight: 700 },
    h1Tablet: { fontSize: '28px', fontWeight: 700 },
    h1Desktop: { fontSize: '32px', fontWeight: 700 },

    h2Mobile: { fontSize: '20px', fontWeight: 700 },
    h2Tablet: { fontSize: '22px', fontWeight: 700 },
    h2Desktop: { fontSize: '26px', fontWeight: 700 },

    h3Mobile: { fontSize: '16px', fontWeight: 600 },
    h3Tablet: { fontSize: '18px', fontWeight: 600 },
    h3Desktop: { fontSize: '20px', fontWeight: 600 },

    bodySizeMobile: { fontSize: '14px' },
    bodySizeTablet: { fontSize: '14px' },
    bodySizeDesktop: { fontSize: '16px' },
  },

  // Buttons
  buttonResponsive: {
    mobile: {
      padding: '12px 24px',
      fontSize: '13px',
      borderRadius: '20px',
      minHeight: '44px',
    },
    tablet: {
      padding: '12px 28px',
      fontSize: '14px',
      borderRadius: '20px',
    },
    desktop: {
      padding: '14px 32px',
      fontSize: '15px',
      borderRadius: '20px',
    },
  },

  // Cards
  cardResponsive: {
    mobile: {
      padding: '16px',
      borderRadius: '12px',
      gap: '12px',
    },
    tablet: {
      padding: '20px',
      borderRadius: '16px',
      gap: '16px',
    },
    desktop: {
      padding: '24px',
      borderRadius: '20px',
      gap: '20px',
    },
  },

  // Touch-friendly spacing for mobile
  touchTargetSize: {
    minHeight: '44px',
    minWidth: '44px',
    padding: '12px',
  },
}

/**
 * Hook to detect screen size
 * Usage: const { isMobile, isTablet, isDesktop } = useScreenSize()
 */
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 641) {
        setScreenSize('mobile')
      } else if (window.innerWidth < 1025) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return {
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    screenSize,
  }
}

/**
 * Helper to get responsive style object
 * Usage: const style = getResponsiveStyle(responsiveStyles.buttonResponsive, screenSize)
 */
export function getResponsiveStyle(
  styles: { mobile: Record<string, any>; tablet: Record<string, any>; desktop: Record<string, any> },
  screenSize: 'mobile' | 'tablet' | 'desktop'
) {
  return {
    ...styles.mobile,
    ...(screenSize === 'tablet' ? styles.tablet : {}),
    ...(screenSize === 'desktop' ? styles.desktop : {}),
  }
}

/**
 * Mobile navigation helper
 * Toggle menu visibility and handle body scroll
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return {
    isOpen,
    toggle: () => setIsOpen(!isOpen),
    close: () => setIsOpen(false),
    open: () => setIsOpen(true),
  }
}

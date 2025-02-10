import Vue from 'vue'

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$device: {
      userAgent: string;
      isMobile: boolean;
      isMobileOrTablet: boolean;
      isTablet: boolean;
      isDesktop: boolean;
      isIos: boolean;
      isAndroid: boolean;
      isWindows: boolean;
      isMacOS: boolean;
      isApple: boolean;
      isDesktopOrTablet: boolean;
      isSafari: boolean;
      isFirefox: boolean;
      isEdge: boolean;
      isChrome: boolean;
      isSamsung: boolean;
      isCrawler: boolean;
    };
	}
}

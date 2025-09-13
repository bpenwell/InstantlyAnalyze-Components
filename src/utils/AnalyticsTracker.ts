import React from 'react';

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

export class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  
  public static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  public track(event: string, properties?: Record<string, any>): void {
    // Basic analytics tracking - you can integrate with Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined') {
      console.log('Analytics Event:', { event, properties, timestamp: new Date().toISOString() });
      
      // Store in localStorage for debugging
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push({ event, properties, timestamp: new Date().toISOString() });
      localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100))); // Keep last 100 events
      
      // You can add Google Analytics tracking here:
      // if (window.gtag) {
      //   window.gtag('event', event, properties);
      // }
    }
  }

  public trackStartNowFlow(step: string, userType?: string, selectedPath?: string): void {
    this.track('start_now_flow', {
      step,
      user_type: userType,
      selected_path: selectedPath,
      page: 'start_now'
    });
  }

  public trackConversion(action: string, userType?: string): void {
    this.track('conversion', {
      action,
      user_type: userType,
      page: 'start_now'
    });
  }
}

// Hook for easy use in React components
export const useAnalytics = () => {
  const tracker = AnalyticsTracker.getInstance();
  
  return {
    track: tracker.track.bind(tracker),
    trackStartNowFlow: tracker.trackStartNowFlow.bind(tracker),
    trackConversion: tracker.trackConversion.bind(tracker)
  };
};

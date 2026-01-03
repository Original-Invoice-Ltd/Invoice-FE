"use client";

interface ActivityTrackerConfig {
  sessionTimeout: number; // 30 minutes in milliseconds
  extendedTimeout: number; // 1 hour in milliseconds
  refreshThreshold: number; // 5 minutes before expiry in milliseconds
  checkInterval: number; // Check every minute in milliseconds
}

class ActivityTracker {
  private config: ActivityTrackerConfig;
  private lastActivity: number;
  private sessionStart: number;
  private refreshTimer: NodeJS.Timeout | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private isActive: boolean = false;
  private hasExtended: boolean = false;

  constructor(config?: Partial<ActivityTrackerConfig>) {
    this.config = {
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      extendedTimeout: 60 * 60 * 1000, // 1 hour
      refreshThreshold: 5 * 60 * 1000, // 5 minutes
      checkInterval: 60 * 1000, // 1 minute
      ...config
    };
    
    this.lastActivity = Date.now();
    this.sessionStart = Date.now();
    this.setupActivityListeners();
    this.startActivityCheck();
  }

  private setupActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, this.updateActivity.bind(this), true);
    });
  }

  private updateActivity() {
    this.lastActivity = Date.now();
    this.isActive = true;
  }

  private startActivityCheck() {
    this.activityTimer = setInterval(() => {
      this.checkActivityAndRefresh();
    }, this.config.checkInterval);
  }

  private async checkActivityAndRefresh() {
    const now = Date.now();
    const timeSinceLastActivity = now - this.lastActivity;
    const timeSinceSessionStart = now - this.sessionStart;

    // Check if user has been active and we should extend session to 1 hour
    if (this.isActive && !this.hasExtended && timeSinceSessionStart > this.config.sessionTimeout - this.config.refreshThreshold) {
      console.log('User is active, extending session to 1 hour');
      await this.refreshToken();
      this.hasExtended = true;
      this.sessionStart = now; // Reset session start for extended period
    }
    // Check if we need to refresh token (5 minutes before expiry)
    else if (this.isActive && timeSinceLastActivity < this.config.refreshThreshold) {
      const timeUntilExpiry = this.hasExtended 
        ? this.config.extendedTimeout - timeSinceSessionStart
        : this.config.sessionTimeout - timeSinceSessionStart;

      if (timeUntilExpiry <= this.config.refreshThreshold && timeUntilExpiry > 0) {
        console.log('Refreshing token due to upcoming expiry');
        await this.refreshToken();
      }
    }

    // Reset activity flag
    this.isActive = false;

    // Check if session has expired
    const sessionTimeout = this.hasExtended ? this.config.extendedTimeout : this.config.sessionTimeout;
    if (timeSinceSessionStart > sessionTimeout) {
      console.log('Session expired, logging out user');
      this.handleSessionExpiry();
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089';
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Token refreshed successfully');
        return true;
      } else {
        console.error('Token refresh failed:', response.status);
        this.handleSessionExpiry();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.handleSessionExpiry();
      return false;
    }
  }

  private handleSessionExpiry() {
    this.cleanup();
    // Redirect to login page
    window.location.href = '/signIn';
  }

  public cleanup() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
    
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = null;
    }

    // Remove event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.removeEventListener(event, this.updateActivity.bind(this), true);
    });
  }

  public resetSession() {
    this.sessionStart = Date.now();
    this.lastActivity = Date.now();
    this.hasExtended = false;
  }
}

// Singleton instance
let activityTracker: ActivityTracker | null = null;

export const initializeActivityTracker = (config?: Partial<ActivityTrackerConfig>) => {
  if (typeof window !== 'undefined' && !activityTracker) {
    activityTracker = new ActivityTracker(config);
  }
  return activityTracker;
};

export const getActivityTracker = () => activityTracker;

export const cleanupActivityTracker = () => {
  if (activityTracker) {
    activityTracker.cleanup();
    activityTracker = null;
  }
};
// Simple toast utility
export interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

class ToastManager {
  private toasts: Map<string, HTMLElement> = new Map();

  show(options: ToastOptions) {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = options.duration || 3000;

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform translate-x-full`;
    
    // Set colors based on type
    switch (options.type) {
      case 'success':
        toast.className += ' bg-green-500 text-white';
        break;
      case 'error':
        toast.className += ' bg-red-500 text-white';
        break;
      case 'warning':
        toast.className += ' bg-yellow-500 text-white';
        break;
      case 'info':
        toast.className += ' bg-blue-500 text-white';
        break;
    }

    toast.innerHTML = `
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium">${options.message}</span>
        <button class="ml-3 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(toast);
    this.toasts.set(id, toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);

    // Auto remove
    setTimeout(() => {
      this.remove(id);
    }, duration);

    return id;
  }

  remove(id: string) {
    const toast = this.toasts.get(id);
    if (toast) {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        this.toasts.delete(id);
      }, 300);
    }
  }
}

export const toast = new ToastManager();
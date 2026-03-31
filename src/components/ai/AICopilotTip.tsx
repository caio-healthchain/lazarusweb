import { useState } from 'react';
import { Brain, X, ChevronRight, Sparkles, Lightbulb } from 'lucide-react';

interface AICopilotTipProps {
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
  variant?: 'info' | 'warning' | 'success' | 'insight';
  dismissible?: boolean;
}

const VARIANT_STYLES = {
  info: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    title: 'text-purple-800',
    text: 'text-purple-700',
    button: 'bg-purple-600 hover:bg-purple-700',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    title: 'text-amber-800',
    text: 'text-amber-700',
    button: 'bg-amber-600 hover:bg-amber-700',
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
    title: 'text-emerald-800',
    text: 'text-emerald-700',
    button: 'bg-emerald-600 hover:bg-emerald-700',
  },
  insight: {
    bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
    border: 'border-purple-200',
    icon: 'text-purple-600',
    title: 'text-purple-800',
    text: 'text-purple-700',
    button: 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600',
  },
};

const AICopilotTip = ({
  title,
  message,
  action,
  onAction,
  variant = 'info',
  dismissible = true,
}: AICopilotTipProps) => {
  const [dismissed, setDismissed] = useState(false);
  const styles = VARIANT_STYLES[variant];

  if (dismissed) return null;

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-3 relative`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${styles.icon}`}>
          {variant === 'insight' ? (
            <Lightbulb className="h-4 w-4" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-xs font-semibold ${styles.title}`}>{title}</p>
            <span className={`inline-flex items-center gap-0.5 text-xs ${styles.icon} opacity-60`}>
              <Sparkles className="h-2.5 w-2.5" />
              IA
            </span>
          </div>
          <p className={`text-xs ${styles.text} mt-0.5 leading-relaxed`}>{message}</p>
          {action && onAction && (
            <button
              onClick={onAction}
              className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-md text-white text-xs font-medium ${styles.button} transition-colors`}
            >
              {action}
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AICopilotTip;

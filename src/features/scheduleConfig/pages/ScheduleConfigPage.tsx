// In ScheduleConfigPage.tsx
import { useAuth } from '../../auth/hooks/useAuth';

import React, { useEffect, useState } from 'react';
import { useScheduleConfig } from '../hooks/useScheduleConfig';
import { FormField, ActionButton, LoadingSpinner, ErrorMessage } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';

/**
 * A page for viewing and managing the application's academic schedule configuration.
 *
 * This component displays the core settings for the timetable, such as periods per day and class times.
 * Its behavior is role-dependent:
 * - For users with an 'admin' role, it renders an editable form allowing them to update the settings.
 * - For all other users (e.g., 'program_head'), it renders the same information in a read-only (disabled) state.
 *
 * @returns The rendered schedule configuration page, tailored to the user's role.
 */
const ScheduleConfigPage: React.FC = () => {
  const { user } = useAuth();
  const { settings, updateSettings, isLoading, isUpdating, error } = useScheduleConfig();
  const [formData, setFormData] = useState({
    periods_per_day: 8,
    class_days_per_week: 5,
    start_time: '09:00',
    period_duration_mins: 90,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        periods_per_day: settings.periods_per_day,
        class_days_per_week: settings.class_days_per_week,
        start_time: settings.start_time,
        period_duration_mins: settings.period_duration_mins,
      });
    }
  }, [settings]);

  const isAdmin = user?.role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      showNotification('Settings saved successfully!');
    } catch {
      showNotification('Failed to save settings.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading schedule configuration..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load settings." />;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Academic Schedule Configuration</h1>
      <form onSubmit={handleSubmit}>
        {/* The fieldset will disable all inputs for non-admins */}
        <fieldset disabled={!isAdmin || isUpdating}>
          <FormField
            id="periods_per_day"
            label="Periods Per Day"
            type="text"
            value={String(formData.periods_per_day)}
            onChange={(val) =>
              setFormData((p) => ({ ...p, periods_per_day: parseInt(val, 10) || 0 }))
            }
            required
          />
          <FormField
            id="class_days_per_week"
            label="Class Days Per Week"
            type="text"
            value={String(formData.class_days_per_week)}
            onChange={(val) =>
              setFormData((p) => ({ ...p, class_days_per_week: parseInt(val, 10) || 0 }))
            }
            required
          />
          <FormField
            id="start_time"
            label="Start Time"
            type="time"
            value={formData.start_time}
            onChange={(val) => setFormData((p) => ({ ...p, start_time: val }))}
            required
          />
          <FormField
            id="period_duration_mins"
            label="Period Duration (minutes)"
            type="text"
            value={String(formData.period_duration_mins)}
            onChange={(val) =>
              setFormData((p) => ({ ...p, period_duration_mins: parseInt(val, 10) || 0 }))
            }
            required
          />
        </fieldset>

        {/* Conditionally render the submit button */}
        {isAdmin && (
          <div className="mt-6">
            <ActionButton type="submit" loading={isUpdating} className="w-full">
              Save Settings
            </ActionButton>
          </div>
        )}
      </form>
    </div>
  );
};

export default ScheduleConfigPage;

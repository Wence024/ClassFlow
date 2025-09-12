import React, { useEffect, useState } from 'react';
import { useScheduleConfig } from '../hooks/useScheduleConfig';
import { FormField, ActionButton, LoadingSpinner, ErrorMessage } from '../../../components/ui';
import { showNotification } from '../../../lib/notificationsService';

/**
 *
 */
const ScheduleConfigPage: React.FC = () => {
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
      <h1 className="text-2xl font-bold mb-6 text-center">Academic Setup</h1>
      <form onSubmit={handleSubmit}>
        <fieldset disabled={isUpdating}>
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
          <ActionButton type="submit" loading={isUpdating} className="w-full">
            Save Settings
          </ActionButton>
        </fieldset>
      </form>
    </div>
  );
};

export default ScheduleConfigPage;

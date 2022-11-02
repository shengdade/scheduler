import {
  Button,
  Card,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { useAddJobMutation } from '../services/scheduler';
import { getRecurringFlag, getScheduleInMinute } from '../utils';

function JobCreate() {
  const [schedule, setSchedule] = useState<string>('immediate');
  const [payload, setPayload] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date(Date.now() + 86400000));
  const [time, setTime] = useState<Date>(new Date());
  const [addJob, { isLoading: isAdding }] = useAddJobMutation();

  const onSubmit = async () => {
    const minute = getScheduleInMinute(schedule, date, time);
    const recurring = getRecurringFlag(schedule);
    await addJob({ payload, minute, recurring });
    setPayload('');
    showNotification({
      color: 'green',
      message: 'Job Created Successfully',
    });
  };

  return (
    <Card sx={{ minHeight: '90vh' }}>
      <Text weight={600} size="xl" pb="md">
        Create Job
      </Text>
      <Stack pt="sm" spacing="xl">
        <SegmentedControl
          value={schedule}
          onChange={setSchedule}
          data={[
            { label: 'Immediate', value: 'immediate' },
            { label: 'Future', value: 'future' },
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
          ]}
        />
        <Textarea
          label="Payload"
          withAsterisk
          placeholder="Payload"
          value={payload}
          onChange={(event) => setPayload(event.currentTarget.value)}
        />
        {schedule !== 'immediate' && (
          <>
            <DatePicker
              label="Pick date"
              withAsterisk
              clearable={false}
              value={date}
              onChange={(value) => setDate(value || new Date())}
            />
            <TimeInput
              label="Pick time"
              withAsterisk
              value={time}
              onChange={(value) => setTime(value || new Date())}
            />
          </>
        )}
        <Button
          onClick={onSubmit}
          loading={isAdding}
          disabled={!payload.trim()}
        >
          Submit
        </Button>
      </Stack>
    </Card>
  );
}

export default JobCreate;

import { Card, Loader, Stack, Text } from '@mantine/core';
import { useGetJobsQuery } from '../services/scheduler';
import JobItem from './JobItem';

function Schedules() {
  const { data, isLoading } = useGetJobsQuery();

  return (
    <Card sx={{ minHeight: '90vh' }}>
      <Text weight={600} size="xl" pb="md">
        Scheduled Jobs
      </Text>
      {isLoading && <Loader />}
      {data &&
        (data.length > 0 ? (
          <Stack p="lg">
            {data.map((job) => (
              <JobItem key={job.jobId} job={job} />
            ))}
          </Stack>
        ) : (
          <Text color="dimmed">No scheduled jobs.</Text>
        ))}
    </Card>
  );
}

export default Schedules;

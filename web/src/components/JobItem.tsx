import {
  ActionIcon,
  Badge,
  createStyles,
  Grid,
  Loader,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconClock, IconTrash } from '@tabler/icons';
import { useDeleteJobMutation } from '../services/scheduler';
import { Job } from '../types';
import { getMinuteDisplay } from '../utils';

const useStyles = createStyles((theme) => ({
  root: {
    borderTop: `1px solid ${theme.colors.gray[2]}`,
    padding: theme.spacing.xs,
  },
}));

interface JobItemProps {
  job: Job;
}

function JobItem({ job: { jobId, payload, minute, recurring } }: JobItemProps) {
  const { classes } = useStyles();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  return (
    <Grid align="center" className={classes.root}>
      <Grid.Col span={1}>
        <ThemeIcon color="teal" radius="xl">
          <IconClock size={16} />
        </ThemeIcon>
      </Grid.Col>
      <Grid.Col span={4}>
        <Text>{payload}</Text>
      </Grid.Col>
      <Grid.Col span={2}>
        {recurring !== 'none' && <Badge>{recurring}</Badge>}
      </Grid.Col>
      <Grid.Col span={4}>
        <Text>{getMinuteDisplay(minute)}</Text>
      </Grid.Col>
      <Grid.Col span={1}>
        {isDeleting ? (
          <Loader size="sm" variant="dots" />
        ) : (
          <ActionIcon
            variant="outline"
            color="orange"
            onClick={() => deleteJob(jobId)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </Grid.Col>
    </Grid>
  );
}

export default JobItem;

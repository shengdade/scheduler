import { AppShell, Container, Grid } from '@mantine/core';
import JobCreate from './components/JobCreate';
import Schedules from './components/Schedules';

function App() {
  return (
    <AppShell
      padding="md"
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[1],
        },
      })}
    >
      <Container size="lg">
        <Grid>
          <Grid.Col span={8}>
            <Schedules />
          </Grid.Col>
          <Grid.Col span={4}>
            <JobCreate />
          </Grid.Col>
        </Grid>
      </Container>
    </AppShell>
  );
}

export default App;

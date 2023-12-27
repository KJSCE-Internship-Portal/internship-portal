import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import {
  
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const theme = useTheme();

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly review completed" total={245} icon={'teenyicons:layers-intersect-solid'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Weekly review submitted" total={340} color="info" icon={'teenyicons:adjust-vertical-solid'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Internship Complted" total={45} color="success" icon={'teenyicons:job-alt-solid'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Review Completed" total={35} color="error" icon={'teenyicons:review-alt-solid'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Weekly"
              subheader="Summary"
              chartLabels={[
                '01/01/2022',
                '02/01/2022',
                '03/01/2022',
                '04/01/2022',
                '05/01/2022',
                '06/01/2022',
                '07/01/2022',
                '08/01/2022',
                '09/01/2022',
                '10/01/2022',
                '11/01/2022',
              ]}
              chartData={[
                {
                  name: 'Completed Feedback',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Review Left',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 76, 67, 22, 43, 21, 41, 56, 27, 43],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Total Students"
              chartData={[
                { label: 'Comps', value: 4344 },
                { label: 'IT', value: 5435 },
                { label: 'EXTC', value: 1443 },
                { label: 'ETRX', value: 4443 },
                { label: 'Mechanical', value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.red[0],
                theme.palette.chart.violet[0],
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Random Chart"
              subheader="abcdefgh"
              chartData={[
                { label: 'A', value: 400 },
                { label: 'A', value: 430 },
                { label: 'A', value: 448 },
                { label: 'A', value: 470 },
                { label: 'A', value: 540 },
                { label: 'A', value: 580 },
                { label: 'A ', value: 690 },
                { label: 'A', value: 1100 },
                { label: 'A ', value: 1200 },
                { label: 'A', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Random 2"
              chartLabels={['A', 'B', 'c', 'D', 'E', 'F']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 50, 40, 80, 70, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

         


          

          
        </Grid>
      </Container>
    </Page>
  );
}

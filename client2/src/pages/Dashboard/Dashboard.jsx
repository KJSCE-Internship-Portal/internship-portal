import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  theme,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack
} from '@chakra-ui/react';
import { Chart } from 'react-google-charts';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { getUserDetails } from '../../Global/authUtils';
import { url } from '../../Global/URL';
const Dashboard = () => {

  const [user, setUser] = useState(false);
  const [pieData, setPieData] = useState([['Company', 'Number of Students']]);
  const [barData, setBarData] = useState([['Department', 'Total Students']]);
  const { isError, isLoading, data } = useQuery({
    queryKey: ['/admin/statistics/all'],
    retryDelay: 1000 * 60 * 2,
    queryFn: async () => {
      if (!user) {
        var current_user = await getUserDetails();
        setUser(current_user);
      } else {
        var current_user = user;
      }

      const response = await axios.post(url + `/admin/statistics`);
      const temp = response.data.data;

      console.log(temp);
      setPieData([['Company', 'Number of Students']]);
      setBarData([['Department', 'Total Students']]);
      setPieData((x) => [...x, ...temp.topCompanies.map(company => [company._id, company.count])]);
      setBarData((x) => [...x, ...temp.departmentWiseDistribution.map(company => [company._id, company.count])]);


      return temp;
    },
  });


  // const barData = [
  //   ['Department', 'Total Students'],
  //   ['Comps', 50],
  //   ['IT', 45],
  //   ['EXTC', 60],
  //   ['ETRX', 70],
  //   ['Mechanical', 30],
  // ];

  const barOptions = {
    chart: {
      title: 'Department Wise Student Count',
    },
  };

  // Data and options for the pie chart


  const pieOptions = {
    title: 'Student Distribution',
    pieHole: 0.4,
  };

  const hbarData = [
    ['E', 'D', { role: 'style' }],
    ['C', 8.94, 'light blue'], // RGB value
    ['S', 10.49, 'red'], // English color name
    ['G', 19.3, 'black'],
    ['P', 21.45, 'color: #e5e4e2'], // CSS-style declaration
  ];

  const hbarOptions = {
    title: 'Random Chart',
    chartArea: { width: '50%' },
    hAxis: {
      title: 'r1',
      minValue: 0,
    },
    vAxis: {
      title: 'R2',
    },
    legend: { position: 'none' },
  };

  const lineData = [
    ['Month', 'Series 1', 'Series 2', 'Series 3'],
    ['Jan', 37.8, 80.8, 41.8],
    ['Feb', 30.9, 69.5, 32.4],
    ['Mar', 25.4, 57, 25.7],

    // ... (Add more data points if necessary)
  ];

  const lineOptions = {
    chart: {
      title: 'Random 2',
    },
    width: 550,

    series: {
      // Gives each series an axis name that matches the Y-axis below.
      0: { axis: 'Series1' },
      1: { axis: 'Series2' },
      2: { axis: 'Series3' },
    },
    axes: {
      // Adds labels to each axis; they don't have to match the axis names.
      y: {
        Series1: { label: 'Series 1' },
        Series2: { label: 'Series 2' },
        Series3: { label: 'Series 3' },
      },
    },
  };


  if (isLoading) {
    return (
      <Stack>
        <Skeleton height='20px' />
        <Skeleton height='20px' />
        <Skeleton height='20px' />
      </Stack>
    )
  }

  if (isError) {
    return <div>Something Went Wrong, Try Reloading if the problem persists</div>
  }


  return (
    <ChakraProvider theme={theme}>
      <Box maxW="1200px" mx="auto" py={5} px={2}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
          {/* Stat Cards */}
          <Stat bg="blue.100" p={4} borderRadius="md">
            <StatLabel>Total Students Interning</StatLabel>
            <StatNumber>{data.studentsInAllDepartments}</StatNumber>
            <StatHelpText>Combined count of all Departments</StatHelpText>
          </Stat>
          <Stat bg="green.100" p={4} borderRadius="md">
            <StatLabel>Average Internship Duration</StatLabel>
            <StatNumber>{Number(data.avgInternshipDuration[0].avgDuration).toFixed(2)}</StatNumber>
            <StatHelpText>Duration displayed is in weeks</StatHelpText>
          </Stat>
          <Stat bg="pink.100" p={4} borderRadius="md">
            <StatLabel>Total students having Mentors</StatLabel>
            <StatNumber>{data.assignedStudents}</StatNumber>
            <StatHelpText>Students being mentored currently</StatHelpText>
          </Stat>
          <Stat bg="orange.100" p={4} borderRadius="md">
            <StatLabel>Review Completed</StatLabel>
            <StatNumber>35</StatNumber>
            <StatHelpText>This is Static for now</StatHelpText>
          </Stat>
        </SimpleGrid>

        <Box mt={10}>
          <SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing={10}>
            {/* Charts */}
            <Box bg="white" p={5} shadow="md" borderRadius="md">
              <Chart
                chartType="Bar"
                width="100%"
                height="400px"
                data={barData}
                options={barOptions}
              />
            </Box>
            <Box bg="white" p={5} shadow="md" borderRadius="md">
              <Chart
                chartType="PieChart"
                width="100%"
                height="400px"
                data={pieData}
                options={pieOptions}
              />
            </Box>

            <Box bg="white" p={5} shadow="md" borderRadius="md">
              <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={hbarData}
                options={hbarOptions}
                chartPackages={['corechart', 'bar']}
              />
            </Box>
            <Box bg="white" p={5} shadow="md" borderRadius="md">
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={lineData}
                options={lineOptions}
                chartPackages={['corechart', 'line']}
              />
            </Box>



          </SimpleGrid>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Dashboard;

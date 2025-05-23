import React, { useState } from 'react';
import {
  Paper,
  Title,
  Grid,
  Select,
  Group,
  Text,
  Card,
  Stack,
  SegmentedControl,
} from '@mantine/core';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = ['#2ecc71', '#e74c3c', '#3498db', '#f1c40f', '#9b59b6'];

const dailyData = [
  { date: '2024-03-01', compliant: 85, nonCompliant: 15 },
  { date: '2024-03-02', compliant: 30, nonCompliant: 70 },
  { date: '2024-03-03', compliant: 88, nonCompliant: 12 },
  { date: '2024-03-04', compliant: 40, nonCompliant: 60 },
  { date: '2024-03-05', compliant: 87, nonCompliant: 13 },
];

const weeklyData = [
  { week: 'Week 1', compliant: 450, nonCompliant: 50 },
  { week: 'Week 2', compliant: 300, nonCompliant: 200 },
  { week: 'Week 3', compliant: 480, nonCompliant: 20 },
  { week: 'Week 4', compliant: 320, nonCompliant: 180 },
];

const monthlyData = [
  { month: 'Jan', compliant: 1800, nonCompliant: 200 },
  { month: 'Feb', compliant: 1300, nonCompliant: 700 },
  { month: 'Mar', compliant: 1900, nonCompliant: 100 },
];

const courseData = [
  { course: 'BSIT', value: 95, label: 'BSIT (95%)' },
  { course: 'BSCS', value: 88, label: 'BSCS (88%)' },
  { course: 'BSIS', value: 70, label: 'BSIS (70%)' },
  { course: 'BSCE', value: 60, label: 'BSCE (60%)' },
];

const yearData = [
  { year: '1st Year', compliant: 90, nonCompliant: 10 },
  { year: '2nd Year', compliant: 65, nonCompliant: 35 },
  { year: '3rd Year', compliant: 93, nonCompliant: 7 },
  { year: '4th Year', compliant: 60, nonCompliant: 40 },
];

function Analytics() {
  const [timeFilter, setTimeFilter] = useState('daily');
  const [courseFilter, setCourseFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const filterDataByCourse = (data) => {
    if (courseFilter === 'all') return data;
    return data.map(item => ({
      ...item,
      compliant: item.compliant * (courseData.find(c => c.course.toLowerCase() === courseFilter)?.value || 0) / 100,
      nonCompliant: item.nonCompliant * (courseData.find(c => c.course.toLowerCase() === courseFilter)?.value || 0) / 100
    }));
  };

  const filterDataByYear = (data) => {
    if (yearFilter === 'all') return data;
    const yearIndex = ['1st', '2nd', '3rd', '4th'].indexOf(yearFilter);
    if (yearIndex === -1) return data;
    const yearMultiplier = yearData[yearIndex].compliant / (yearData[yearIndex].compliant + yearData[yearIndex].nonCompliant);
    return data.map(item => ({
      ...item,
      compliant: item.compliant * yearMultiplier,
      nonCompliant: item.nonCompliant * (1 - yearMultiplier)
    }));
  };

  const getSelectedData = () => {
    let data;
    switch (timeFilter) {
      case 'weekly':
        data = weeklyData;
        break;
      case 'monthly':
        data = monthlyData;
        break;
      default:
        data = dailyData;
    }
    return filterDataByYear(filterDataByCourse(data));
  };

  const selectedData = getSelectedData();
  const totalCompliant = parseFloat(
    selectedData.reduce((sum, item) => sum + item.compliant, 0).toFixed(2) 
  );
  
  const totalNonCompliant = parseFloat(
    selectedData.reduce((sum, item) => sum + item.nonCompliant, 0).toFixed(2)
  );
  
  const totalStudents = totalCompliant + totalNonCompliant;

  const compliantPercentage = totalStudents
    ? ((totalCompliant / totalStudents) * 100).toFixed(2    )
    : 0;
  const nonCompliantPercentage = totalStudents
    ? ((totalNonCompliant / totalStudents) * 100).toFixed(1)
    : 0;
  const totalViolations = totalNonCompliant;

  return (
    <div style={{ padding: '24px' }}>
      <Stack spacing="xl">
        <Group position="apart" align="center">
          <Title order={2}>Uniform Compliance Analytics</Title>
          <Group spacing="md">
            <Select
              label="Course"
              placeholder="All Courses"
              value={courseFilter}
              onChange={setCourseFilter}
              data={[
                { value: 'all', label: 'All Courses' },
                { value: 'bsit', label: 'BSIT' },
                { value: 'bscs', label: 'BSCS' },
                { value: 'bsis', label: 'BSIS' },
                { value: 'bsce', label: 'BSCE' },
              ]}
              style={{ width: 200 }}
            />
            <Select
              label="Year Level"
              placeholder="All Years"
              value={yearFilter}
              onChange={setYearFilter}
              data={[
                { value: 'all', label: 'All Years' },
                { value: '1st', label: '1st Year' },
                { value: '2nd', label: '2nd Year' },
                { value: '3rd', label: '3rd Year' },
                { value: '4th', label: '4th Year' },
              ]}
              style={{ width: 200 }}
            />
          </Group>
        </Group>

        <Grid gutter="lg">
          <Grid.Col span={3}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Text size="lg" weight={500} color="dimmed">Total Students</Text>
              <Text size="xl" weight={700}>{totalStudents}</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Text size="lg" weight={500} color="dimmed">Compliant</Text>
              <Text size="xl" weight={700} color="teal">{compliantPercentage}%</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Text size="lg" weight={500} color="dimmed">Non-Compliant</Text>
              <Text size="xl" weight={700} color="red">{nonCompliantPercentage}%</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={3}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Text size="lg" weight={500} color="dimmed">Total Violations</Text>
              <Text size="xl" weight={700} color="orange">{totalViolations}</Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={12}>
            <Paper shadow="sm" p="xl" radius="md" withBorder>
              <Group position="apart" mb="md">
                <Title order={3}>Compliance Trend</Title>
                <SegmentedControl
                  value={timeFilter}
                  onChange={setTimeFilter}
                  data={[
                    { label: 'Daily', value: 'daily' },
                    { label: 'Weekly', value: 'weekly' },
                    { label: 'Monthly', value: 'monthly' },
                  ]}
                />
              </Group>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={selectedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeFilter === 'daily' ? 'date' : timeFilter === 'weekly' ? 'week' : 'month'} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="compliant" stroke="#2ecc71" strokeWidth={2} name="Compliant" />
                  <Line type="monotone" dataKey="nonCompliant" stroke="#e74c3c" strokeWidth={2} name="Non-Compliant" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid.Col>

          <Grid.Col span={6}>
            <Paper shadow="sm" p="xl" radius="md" withBorder>
              <Title order={3} mb="md">Course Distribution</Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={courseData}
                    dataKey="value"
                    nameKey="course"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ label }) => label}
                  >
                    {courseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid.Col>

          <Grid.Col span={6}>
            <Paper shadow="sm" p="xl" radius="md" withBorder>
              <Title order={3} mb="md">Year Level Compliance</Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="compliant" fill="#2ecc71" name="Compliant" />
                  <Bar dataKey="nonCompliant" fill="#e74c3c" name="Non-Compliant" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </div>
  );
}

export default Analytics;

import React, { useState } from "react";
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
} from "@mantine/core";
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
} from "recharts";

const COLORS = ["#2ecc71", "#e74c3c", "#3498db", "#f1c40f", "#9b59b6"];

const dailyData = [
  { date: "2024-03-01", compliant: 85, nonCompliant: 15 },
  { date: "2024-03-02", compliant: 30, nonCompliant: 70 },
  { date: "2024-03-03", compliant: 88, nonCompliant: 12 },
  { date: "2024-03-04", compliant: 40, nonCompliant: 60 },
  { date: "2024-03-05", compliant: 87, nonCompliant: 13 },
];

const weeklyData = [
  { week: "Week 1", compliant: 450, nonCompliant: 50 },
  { week: "Week 2", compliant: 300, nonCompliant: 200 },
  { week: "Week 3", compliant: 480, nonCompliant: 20 },
  { week: "Week 4", compliant: 320, nonCompliant: 180 },
];

const monthlyData = [
  { month: "Jan", compliant: 1800, nonCompliant: 200 },
  { month: "Feb", compliant: 1300, nonCompliant: 700 },
  { month: "Mar", compliant: 1900, nonCompliant: 100 },
];

const courseYearData = [
  {
    course: "BSIT",
    years: [
      { year: "1st Year", compliant: 25, nonCompliant: 5 },
      { year: "2nd Year", compliant: 20, nonCompliant: 10 },
      { year: "3rd Year", compliant: 30, nonCompliant: 0 },
      { year: "4th Year", compliant: 20, nonCompliant: 5 },
    ],
  },
  {
    course: "BSCS",
    years: [
      { year: "1st Year", compliant: 22, nonCompliant: 3 },
      { year: "2nd Year", compliant: 18, nonCompliant: 7 },
      { year: "3rd Year", compliant: 30, nonCompliant: 2 },
      { year: "4th Year", compliant: 18, nonCompliant: 8 },
    ],
  },
  {
    course: "BSIS",
    years: [
      { year: "1st Year", compliant: 15, nonCompliant: 5 },
      { year: "2nd Year", compliant: 18, nonCompliant: 7 },
      { year: "3rd Year", compliant: 22, nonCompliant: 3 },
      { year: "4th Year", compliant: 15, nonCompliant: 10 },
    ],
  },
  {
    course: "BSCE",
    years: [
      { year: "1st Year", compliant: 12, nonCompliant: 3 },
      { year: "2nd Year", compliant: 15, nonCompliant: 5 },
      { year: "3rd Year", compliant: 20, nonCompliant: 2 },
      { year: "4th Year", compliant: 13, nonCompliant: 10 },
    ],
  },
];

function Analytics() {
  const [timeFilter, setTimeFilter] = useState("daily");
  const [courseFilter, setCourseFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Data for trend graph by time only
  const getSelectedData = () => {
    switch (timeFilter) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };
  const selectedData = getSelectedData();

  // Filter courseYearData by course and year filters
  const filteredCourseYearData = courseYearData
    .filter(
      (course) =>
        courseFilter === "all" ||
        course.course.toLowerCase() === courseFilter.toLowerCase()
    )
    .map((course) => ({
      ...course,
      years: course.years.filter(
        (yearData) =>
          yearFilter === "all" ||
          yearData.year.toLowerCase().startsWith(yearFilter.toLowerCase())
      ),
    }))
    .filter((course) => course.years.length > 0);

  // Compute summary counts from filteredCourseYearData (ignore timeFilter since no time info in courseYearData)
  const totalCompliant = filteredCourseYearData.reduce(
    (courseSum, course) =>
      courseSum +
      course.years.reduce((yearSum, year) => yearSum + year.compliant, 0),
    0
  );
  const totalNonCompliant = filteredCourseYearData.reduce(
    (courseSum, course) =>
      courseSum +
      course.years.reduce((yearSum, year) => yearSum + year.nonCompliant, 0),
    0
  );
  const totalStudents = totalCompliant + totalNonCompliant;

  // Pie chart data (courseDistribution) from filteredCourseYearData
  const courseDistribution = filteredCourseYearData.map((course) => {
    const total = course.years.reduce(
      (sum, y) => sum + y.compliant + y.nonCompliant,
      0
    );
    return {
      course: course.course,
      value: total,
      label: `${course.course} (${total} students)`,
    };
  });

  // Year level compliance bar chart data
  const yearLabels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const yearLevelCompliance = yearLabels
    .map((year) => {
      let compliant = 0;
      let nonCompliant = 0;
      filteredCourseYearData.forEach((course) => {
        const y = course.years.find((yr) => yr.year === year);
        if (y) {
          compliant += y.compliant;
          nonCompliant += y.nonCompliant;
        }
      });
      return { year, compliant, nonCompliant };
    })
    .filter((item) => item.compliant + item.nonCompliant > 0);

  return (
    <div style={{ padding: "24px" }}>
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
                { value: "all", label: "All Courses" },
                { value: "bsit", label: "BSIT" },
                { value: "bscs", label: "BSCS" },
                { value: "bsis", label: "BSIS" },
                { value: "bsce", label: "BSCE" },
              ]}
              style={{ width: 200 }}
            />
            <Select
              label="Year Level"
              placeholder="All Years"
              value={yearFilter}
              onChange={setYearFilter}
              data={[
                { value: "all", label: "All Years" },
                { value: "1st", label: "1st Year" },
                { value: "2nd", label: "2nd Year" },
                { value: "3rd", label: "3rd Year" },
                { value: "4th", label: "4th Year" },
              ]}
              style={{ width: 200 }}
            />
          </Group>
        </Group>

        <Grid gutter="lg">
          <Grid.Col span={4}>
            <Card shadow="sm" padding="md">
              <Text>Total Students</Text>
              <Text>{totalStudents}</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="sm" padding="md">
              <Text>Compliant</Text>
              <Text color="teal">{totalCompliant}</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="sm" padding="md">
              <Text>Non-Compliant</Text>
              <Text color="red">{totalNonCompliant}</Text>
            </Card>
          </Grid.Col>

          {/* Compliance Trend Chart */}
          <Grid.Col span={12}>
            <Paper>
              <Group position="apart">
                <Title order={3}>Compliance Trend</Title>
                <SegmentedControl
                  value={timeFilter}
                  onChange={setTimeFilter}
                  data={[
                    { label: "Daily", value: "daily" },
                    { label: "Weekly", value: "weekly" },
                    { label: "Monthly", value: "monthly" },
                  ]}
                />
              </Group>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={selectedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={
                      timeFilter === "daily"
                        ? "date"
                        : timeFilter === "weekly"
                        ? "week"
                        : "month"
                    }
                    tickFormatter={(tick) => {
                      if (timeFilter === "daily") {
                        // parse date string and format
                        const date = new Date(tick);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        }); // e.g. "Mar 01, 2024"
                      }
                      // For weekly and monthly just return the tick as is
                      return tick;
                    }}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label) => {
                      if (timeFilter === "daily") {
                        const date = new Date(label);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        });
                      }
                      return label;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="compliant"
                    stroke="#2ecc71"
                    strokeWidth={2}
                    name="Compliant"
                  />
                  <Line
                    type="monotone"
                    dataKey="nonCompliant"
                    stroke="#e74c3c"
                    strokeWidth={2}
                    name="Non-Compliant"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid.Col>
          <Grid.Col span={6}>
            <Paper shadow="sm" p="xl" radius="md" withBorder>
              <Title order={3} mb="md">
                Course Distribution
              </Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={courseDistribution}
                    dataKey="value"
                    nameKey="course"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ label }) => label}
                  >
                    {courseDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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
              <Title order={3} mb="md">
                Year Level Compliance
              </Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearLevelCompliance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="compliant" fill="#2ecc71" name="Compliant" />
                  <Bar
                    dataKey="nonCompliant"
                    fill="#e74c3c"
                    name="Non-Compliant"
                  />
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
import React, { useState, useEffect } from 'react';
import { Paper, Title, Text, Stack, Group, Badge, Collapse, ActionIcon } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import classes from '../css/UniformStatus.module.css';

function UniformStatusPage() {
  const [statusList, setStatusList] = useState([]);

  const dummyData = [
    {
      studentName: 'John Doe',
      studentId: '2023-001',
      timestamp: new Date().toISOString(),
      isProper: true,
      course: 'BSIT',
      yearLevel: '3rd Year',
      violations: [],
      lastViolation: null
    },
    {
      studentName: 'Jane Smith',
      studentId: '2023-002',
      timestamp: new Date().toISOString(),
      isProper: false,
      course: 'BSCS',
      yearLevel: '2nd Year',
      violations: ['Improper Shoes', 'Missing ID'],
      lastViolation: '2024-03-10'
    },
    {
      studentName: 'Mark Johnson',
      studentId: '2023-003',
      timestamp: new Date().toISOString(),
      isProper: true,
      course: 'BSIS',
      yearLevel: '4th Year',
      violations: ['Untucked Shirt'],
      lastViolation: '2024-02-28'
    },
  ];

  useEffect(() => {
    fetchStatusList();
    const interval = setInterval(fetchStatusList, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatusList = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/uniform-status/');
      if (!response.ok) {
        throw new Error('Failed to fetch status list');
      }
      const data = await response.json();
      setStatusList(data);
    } catch (error) {
      console.error('Error fetching uniform status, using dummy data:', error);
      setStatusList(dummyData); // fallback to dummy data
    }
  };

  const [expandedCards, setExpandedCards] = useState(new Set());

  const toggleCard = (index) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <div className={classes.container}>
      <Title order={2} className={classes.title}>Student Uniform Status</Title>
      <Stack spacing="md">
        {statusList.map((status, index) => (
          <Paper
            key={index}
            shadow="sm"
            radius="md"
            p="md"
            withBorder
            className={classes.statusCard}
          >
            <Group position="apart" mb={expandedCards.has(index) ? 'md' : 0}>
              <div>
                <Group spacing="xs">
                  <Text size="lg" weight={500}>{status.studentName}</Text>
                  <Badge size="sm" variant="dot" color={status.isProper ? 'green' : 'red'}>
                    {status.course}
                  </Badge>
                </Group>
                <Text size="sm" color="dimmed">{status.studentId}</Text>
                <Text size="sm">{new Date(status.timestamp).toLocaleString()}</Text>
              </div>
              <Group spacing="sm">
                <Badge
                  size="lg"
                  color={status.isProper ? 'green' : 'red'}
                  variant="filled"
                >
                  {status.isProper ? 'Proper Uniform' : 'Improper Uniform'}
                </Badge>
                <ActionIcon
                  variant="subtle"
                  onClick={() => toggleCard(index)}
                  aria-label="Toggle details"
                >
                  {expandedCards.has(index) ? (
                    <IconChevronUp size={16} />
                  ) : (
                    <IconChevronDown size={16} />
                  )}
                </ActionIcon>
              </Group>
            </Group>
            <Collapse in={expandedCards.has(index)}>
              <Stack spacing="xs" mt="xs">
                <Group spacing="xl">
                  <div>
                    <Text size="sm" weight={500}>Year Level</Text>
                    <Text size="sm">{status.yearLevel}</Text>
                  </div>
                  <div>
                    <Text size="sm" weight={500}>Last Violation</Text>
                    <Text size="sm">{status.lastViolation || 'No violations'}</Text>
                  </div>
                </Group>
                {status.violations && status.violations.length > 0 && (
                  <div>
                    <Text size="sm" weight={500}>Recent Violations</Text>
                    <Group spacing="xs" mt="xs">
                      {status.violations.map((violation, vIndex) => (
                        <Badge key={vIndex} variant="light" color="red">
                          {violation}
                        </Badge>
                      ))}
                    </Group>
                  </div>
                )}
              </Stack>
            </Collapse>
          </Paper>
        ))}
        {statusList.length === 0 && (
          <Text align="center" color="dimmed">
            No uniform status records found
          </Text>
        )}
      </Stack>
    </div>
  );
}

export default UniformStatusPage;

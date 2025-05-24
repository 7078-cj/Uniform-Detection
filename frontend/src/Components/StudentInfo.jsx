import React, { useState, useEffect, useContext } from 'react';
import {
  Paper,
  Title,
  Text,
  Group,
  Badge,
  ActionIcon,
  Table,
  Modal,
  Button,
  Collapse,
  TextInput,
  Divider,
  Stack,
  Box,
  ScrollArea,
  LoadingOverlay,
  Notification
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp, IconEdit, IconTrash, IconSearch, IconSchool, IconUser } from '@tabler/icons-react';
import classes from '../css/StudentInfo.module.css';
import AuthContext from '../Context/AuthContext';

function StudentInfo() {
  const [students, setStudents] = useState([]);
  const [courseGroups, setCourseGroups] = useState({});
  const [expandedCourses, setExpandedCourses] = useState(new Set());
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  const { authTok } = useContext(AuthContext);

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/students/', {
          headers: {
            'Authorization': `Bearer ${authTok?.access}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        
        const data = await response.json();
        setStudents(data);
        
        // Group students by course
        const groupedByCourse = data.reduce((acc, student) => {
          const course = student.course;
          if (!acc[course]) {
            acc[course] = [];
          }
          acc[course].push(student);
          return acc;
        }, {});
        
        setCourseGroups(groupedByCourse);
      } catch (error) {
        console.error('Error fetching students:', error);
        // Use dummy data for development/testing
        const dummyData = [
          { id: 1, firstName: 'John', middleInitial: 'A', lastName: 'Doe', studentCode: '2023001', course: 'BSIT', year_level: '3', email: 'john.doe@example.com' },
          { id: 2, firstName: 'Jane', middleInitial: 'B', lastName: 'Smith', studentCode: '2023002', course: 'BSIT', year_level: '2', email: 'jane.smith@example.com' },
          { id: 3, firstName: 'Michael', middleInitial: 'C', lastName: 'Johnson', studentCode: '2023003', course: 'BSCS', year_level: '4', email: 'michael.j@example.com' },
          { id: 4, firstName: 'Emily', middleInitial: 'D', lastName: 'Brown', studentCode: '2023004', course: 'BSCS', year_level: '1', email: 'emily.b@example.com' },
          { id: 5, firstName: 'David', middleInitial: 'E', lastName: 'Wilson', studentCode: '2023005', course: 'BSIS', year_level: '3', email: 'david.w@example.com' },
        ];
        
        setStudents(dummyData);
        
        // Group dummy data by course
        const groupedByCourse = dummyData.reduce((acc, student) => {
          const course = student.course;
          if (!acc[course]) {
            acc[course] = [];
          }
          acc[course].push(student);
          return acc;
        }, {});
        
        setCourseGroups(groupedByCourse);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [authTok]);

  // Toggle course expansion
  const toggleCourse = (course) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(course)) {
      newExpanded.delete(course);
    } else {
      newExpanded.add(course);
    }
    setExpandedCourses(newExpanded);
  };

  // View student details
  const viewStudentDetails = (student) => {
    setSelectedStudent(student);
    open();
  };

  // Delete student
  const deleteStudent = async () => {
    if (!selectedStudent) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/students/${selectedStudent.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authTok?.access}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      
      // Update local state
      const updatedStudents = students.filter(s => s.id !== selectedStudent.id);
      setStudents(updatedStudents);
      
      // Update course groups
      const updatedGroups = { ...courseGroups };
      updatedGroups[selectedStudent.course] = updatedGroups[selectedStudent.course].filter(
        s => s.id !== selectedStudent.id
      );
      
      if (updatedGroups[selectedStudent.course].length === 0) {
        delete updatedGroups[selectedStudent.course];
      }
      
      setCourseGroups(updatedGroups);
      setDeleteModalOpened(false);
      close();
      
      // Show success notification
      setNotification({
        message: `Student ${selectedStudent.firstName} ${selectedStudent.lastName} has been deleted.`,
        color: 'teal'
      });
      
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error deleting student:', error);
      setNotification({
        message: 'Failed to delete student. Please try again.',
        color: 'red'
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Filter students based on search query
  const filteredCourseGroups = Object.entries(courseGroups).reduce((acc, [course, students]) => {
    const filteredStudents = students.filter(student => {
      const fullName = `${student.firstName} ${student.middleInitial} ${student.lastName}`.toLowerCase();
      const studentCode = student.studentCode.toLowerCase();
      const searchLower = searchQuery.toLowerCase();
      
      return fullName.includes(searchLower) || studentCode.includes(searchLower);
    });
    
    if (filteredStudents.length > 0) {
      acc[course] = filteredStudents;
    }
    
    return acc;
  }, {});

  return (
    <div className={classes.container}>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      
      {notification && (
        <Notification
          color={notification.color}
          onClose={() => setNotification(null)}
          style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}
        >
          {notification.message}
        </Notification>
      )}
      
      <Title order={2} className={classes.title}>Student Information</Title>
      
      <div className={classes.searchContainer}>
        <TextInput
          icon={<IconSearch size={16} />}
          placeholder="Search by name or student code"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          radius="md"
          size="md"
        />
      </div>
      
      {Object.keys(filteredCourseGroups).length === 0 ? (
        <Text className={classes.emptyState}>
          {loading ? 'Loading students...' : 'No students found matching your search criteria.'}
        </Text>
      ) : (
        Object.entries(filteredCourseGroups).map(([course, students]) => (
          <Paper key={course} className={classes.courseCard} shadow="sm" radius="md" withBorder>
            <div 
              className={classes.courseHeader}
              onClick={() => toggleCourse(course)}
            >
              <div className={classes.courseTitle}>
                <IconSchool size={20} />
                {course}
              </div>
              <Group spacing="md">
                <Badge className={classes.studentCount}>
                  {students.length} {students.length === 1 ? 'Student' : 'Students'}
                </Badge>
                {expandedCourses.has(course) ? (
                  <IconChevronUp size={20} />
                ) : (
                  <IconChevronDown size={20} />
                )}
              </Group>
            </div>
            
            <Collapse in={expandedCourses.has(course)}>
              <div className={classes.tableContainer}>
                <ScrollArea>
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Student Code</Table.Th>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Year Level</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {students.map((student) => (
                        <Table.Tr 
                          key={student.id} 
                          className={classes.studentRow}
                          onClick={() => viewStudentDetails(student)}
                        >
                          <Table.Td>{student.studentCode}</Table.Td>
                          <Table.Td>
                            {student.firstName} {student.middleInitial} {student.lastName}
                          </Table.Td>
                          <Table.Td>{student.year_level}</Table.Td>
                          <Table.Td>{student.email}</Table.Td>
                          <Table.Td>
                            <Group spacing="xs" onClick={(e) => e.stopPropagation()}>
                              <ActionIcon 
                                className={`${classes.actionButton} ${classes.editButton}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewStudentDetails(student);
                                }}
                              >
                                <IconEdit size={16} />
                              </ActionIcon>
                              <ActionIcon 
                                className={`${classes.actionButton} ${classes.deleteButton}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudent(student);
                                  setDeleteModalOpened(true);
                                }}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </div>
            </Collapse>
          </Paper>
        ))
      )}
      
      {/* Student Details Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={<Text className={classes.modalTitle}>Student Details</Text>}
        size="lg"
        centered
      >
        {selectedStudent && (
          <Box>
            <Group position="apart" mb="md">
              <Group>
                <IconUser size={24} />
                <Title order={3}>
                  {selectedStudent.firstName} {selectedStudent.middleInitial} {selectedStudent.lastName}
                </Title>
              </Group>
              <Badge size="lg" color="teal">{selectedStudent.course}</Badge>
            </Group>
            
            <Divider my="md" />
            
            <Stack spacing="md">
              <div className={classes.modalSection}>
                <Text className={classes.modalLabel}>Student Code</Text>
                <Text className={classes.modalValue}>{selectedStudent.studentCode}</Text>
              </div>
              
              <div className={classes.modalSection}>
                <Text className={classes.modalLabel}>Year Level</Text>
                <Text className={classes.modalValue}>{selectedStudent.year_level}</Text>
              </div>
              
              <div className={classes.modalSection}>
                <Text className={classes.modalLabel}>Email</Text>
                <Text className={classes.modalValue}>{selectedStudent.email}</Text>
              </div>
            </Stack>
            
            <Group position="right" mt="xl">
              <Button 
                variant="outline" 
                color="red"
                onClick={() => {
                  close();
                  setDeleteModalOpened(true);
                }}
              >
                Delete Student
              </Button>
              <Button color="teal" onClick={close}>Close</Button>
            </Group>
          </Box>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title={<Text className={classes.modalTitle} color="red">Delete Student</Text>}
        centered
      >
        {selectedStudent && (
          <>
            <Text size="md">
              Are you sure you want to delete {selectedStudent.firstName} {selectedStudent.lastName}? This action cannot be undone.
            </Text>
            
            <Group position="right" mt="xl">
              <Button variant="outline" onClick={() => setDeleteModalOpened(false)}>Cancel</Button>
              <Button color="red" onClick={deleteStudent}>Delete</Button>
            </Group>
          </>
        )}
      </Modal>
    </div>
  );
}

export default StudentInfo;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCompetitions, searchCompetitions } from '../Redux/Competition/Action';
import { Container, Typography, Button, ButtonGroup, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import HomeAppBar from './HomeAppBar';
import CompetitionCard from './CompetitionCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const competitions = useSelector(state => state.competitions.competitions);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchCompetitions(searchTerm, pageNumber, pageSize));
    } else {
      dispatch(getAllCompetitions(pageNumber, pageSize));
    }
  }, [dispatch, pageNumber, searchTerm]);

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH;

  const filteredCompetitions = competitions.filter(comp =>
    comp.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter ? comp.status === statusFilter : true)
  );

  return (
    <>
      <HomeAppBar />
      <img src={`${imageLink}/background.jpg`} alt="logo" style={{ width: '100%', height: '500px' }} />
      <Container style={{ marginTop: '3rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <TextField
            label="Search Competitions"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <FormControl variant="outlined" size="small" style={{ maxWidth: '120px', width: '100%' }}>
            <InputLabel style={{ color: 'white' }}>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Upcoming">Upcoming</MenuItem>
              <MenuItem value="Close">Close</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {filteredCompetitions && filteredCompetitions.length > 0 ? (
            filteredCompetitions.map(comp => (
              <div key={comp.competitionId}>
                <CompetitionCard
                  competitionId={comp.competitionId}
                  title={comp.title}
                  description={comp.description}
                  status={comp.status}
                  startDate={comp.startDate}
                  endDate={comp.endDate}
                  rules={comp.rules}
                  awardsDescription={comp.awardsDescription}
                  imageUrl={`${imageLink}/${comp.image}`}
                />
              </div>
            ))
          ) : (
            <Typography variant="h6" component="div">
              No competitions available
            </Typography>
          )}
        </div>
        <ButtonGroup style={{ marginTop: '2rem' }}>
          <Button
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 1}
          >
            Previous
          </Button>
          <Button onClick={() => handlePageChange(pageNumber + 1)}>
            Next
          </Button>
        </ButtonGroup>
      </Container>
    </>
  );
}

export default HomePage;
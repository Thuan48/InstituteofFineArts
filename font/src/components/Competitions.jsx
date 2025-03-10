import { Button, ButtonGroup, Container, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCompetitions } from '../Redux/Competition/Action';
import CompetitionCard from './CompetitionCard';
import HomeAppBar from './HomeAppBar';

const Competitions = () => {
  const dispatch = useDispatch();
  const competitions = useSelector(state => state.competitions.competitions);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    dispatch(getAllCompetitions(pageNumber, pageSize));
  }, [dispatch, pageNumber]);

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH;

  return (
    <>
      <HomeAppBar />
      <Container style={{ marginTop: '5rem' }}>
        <Typography variant="h4" gutterBottom>
          Competitions
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
          {competitions && competitions.length > 0 ? (
            competitions.map(comp => (
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
};

export default Competitions;

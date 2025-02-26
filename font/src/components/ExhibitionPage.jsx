import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllExhibitionSubmissions } from '../Redux/ExhibitionSubmission/Action';
import { Grid, Card, CardContent, Typography, Pagination as MuiPagination } from '@mui/material';
import HomeAppBar from './HomeAppBar';

const ExhibitionPage = () => {
  const dispatch = useDispatch();
  const { exhibitionSubmissions, totalRecords } = useSelector(state => state.exhibitionSubmissions);
  const [page, setPage] = useState(1);
  const pageSize = 20; // total items per page

  useEffect(() => {
    dispatch(getAllExhibitionSubmissions(page, pageSize));
  }, [dispatch, page]);

  const grouped = (exhibitionSubmissions || []).reduce((acc, cur) => {
    const exhId = cur.exhibition.exhibitionId;
    if (!acc[exhId]) {
      acc[exhId] = {
        exhibition: cur.exhibition,
        submissions: []
      };
    }
    acc[exhId].submissions.push(cur);
    return acc;
  }, {});

  const imageLink = import.meta.env.VITE_API_IMAGE_PATH;
  const totalPages = totalRecords ? Math.ceil(totalRecords / pageSize) : 1;

  return (
    <>
      <HomeAppBar />
      <div style={{ padding: '2rem', marginTop: '3rem', width: '100%' }}>
        <Grid container spacing={2}>
          {Object.values(grouped).length === 0 ? (
            <Typography>No submissions available.</Typography>
          ) : (
            Object.values(grouped).map(group => (
              <Grid item xs={12} sm={6} key={group.exhibition.exhibitionId}>
                <div style={{ marginBottom: '2rem' }}>
                  <Typography variant="h5" gutterBottom>
                    {group.exhibition.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Date: {new Date(group.exhibition.date).toLocaleDateString()}
                  </Typography>
                  {group.exhibition.image && (
                    <img
                      src={`${imageLink}/${group.exhibition.image}`}
                      alt="Exhibition"
                      style={{ width: '150px', height: 'auto', marginBottom: '1rem' }}
                    />
                  )}
                  <Grid container spacing={2}>
                    {group.submissions.map(item => (
                      <Grid item xs={12} key={item.exhibitionSubmissionId}>
                        <Card>
                          <CardContent>
                            {item.submission.filePath && (
                              <img
                                src={`${imageLink}/${item.submission.filePath}`}
                                alt="Submission"
                                style={{ width: '100%', height: '150px', objectFit: 'cover', marginTop: '0.5rem' }}
                              />
                            )}
                            <Typography variant="subtitle1" color='blue' fontSize={20}>
                              Price: {item.price}
                            </Typography>
                            <Typography variant="h6">
                              {item.submission.title || 'Submission Title'}
                            </Typography>
                            <Typography variant="body2">
                              Status: {item.submission.status || 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                              User: {item.submission.user ? item.submission.user.name : `User ID: ${item.submission.userId}`}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </Grid>
            ))
          )}
        </Grid>
        <MuiPagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}
        />
      </div>
    </>
  );
};

export default ExhibitionPage;
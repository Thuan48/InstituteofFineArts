import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales, deleteSale, searchSales, updateSale } from '../../Redux/Sale/action';
import DashboardLayout from './DashboardLayout';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const ListSale = () => {
  const dispatch = useDispatch();
  const { sales } = useSelector(state => state);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [showUpdateSaleDialog, setShowUpdateSaleDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    handleSearch(page, pageSize);
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(page, pageSize);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, page, pageSize]);

  const handleSearch = async (newPage = page, newPageSize = pageSize) => {
    let result;
    if (searchTerm.trim()) {
      result = await dispatch(searchSales(searchTerm, newPage, newPageSize));
    } else {
      result = await dispatch(fetchSales());
    }
    if (result && result.payload) {
      setTotalRows(result.payload.totalCount || 0);
    }
  };

  const handleDeleteSale = async (id) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      await dispatch(deleteSale(id));
      handleSearch(page, pageSize);
    }
  };

  const handleUpdateSale = async () => {
    if (selectedSale) {
      const updatedSale = {
        ...selectedSale,
        soldDate: new Date(selectedSale.soldDate).toISOString()
      };
      const result = await dispatch(updateSale(selectedSale.id, updatedSale));
      if (result && result.payload) {
        setShowUpdateSaleDialog(false);
        handleSearch(page, pageSize);
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'exhibitionSubmissionId', headerName: 'Exhibition Submission ID', width: 150 },
    { field: 'buyer', headerName: 'Buyer', width: 150 },
    { field: 'soldPrice', headerName: 'Sold Price', width: 150 },
    { field: 'soldDate', headerName: 'Sold Date', width: 150 },
    { field: 'paymentStatus', headerName: 'Payment Status', width: 150 },
    { field: 'transactionRef', headerName: 'Transaction Ref', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '5px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSelectedSale(params.row);
              setShowUpdateSaleDialog(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteSale(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const rows = sales.sales?.map((sale) => ({
    id: sale.saleId,
    exhibitionSubmissionId: sale.exhibitionSubmissionId,
    buyer: sale.buyer,
    soldPrice: sale.soldPrice,
    soldDate: sale.soldDate ? new Date(sale.soldDate).toLocaleDateString() : 'Invalid Date',
    paymentStatus: sale.paymentStatus,
    transactionRef: sale.transactionRef, // New field
  })) || [];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4">Sales</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={() => handleSearch()}>
            Search
          </Button>
        </div>
      </div>
      <Box sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          paginationMode="server"
          rowCount={totalRows}
          onPageChange={(newPage) => {
            setPage(newPage + 1);
            handleSearch(newPage + 1, pageSize);
          }}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            handleSearch(page, newPageSize);
          }}
        />
      </Box>

      <Dialog open={showUpdateSaleDialog} onClose={() => setShowUpdateSaleDialog(false)}>
        <DialogTitle>Update Sale</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Exhibition Submission ID"
            name="exhibitionSubmissionId"
            value={selectedSale?.exhibitionSubmissionId || ''}
            onChange={(e) => setSelectedSale({ ...selectedSale, exhibitionSubmissionId: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Buyer"
            name="buyer"
            value={selectedSale?.buyer || ''}
            onChange={(e) => setSelectedSale({ ...selectedSale, buyer: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Sold Price"
            name="soldPrice"
            value={selectedSale?.soldPrice || ''}
            onChange={(e) => setSelectedSale({ ...selectedSale, soldPrice: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Sold Date"
            name="soldDate"
            type="date"
            value={selectedSale?.soldDate ? new Date(selectedSale.soldDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setSelectedSale({ ...selectedSale, soldDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateSale} color="primary">
            Update Sale
          </Button>
          <Button onClick={() => setShowUpdateSaleDialog(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ListSale;

'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Box, Stack, Modal, Typography, TextField, Button, Grid } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    updateInventory();
  }, []);

  // Filtered inventory based on search query
  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box 
      width="100vw" 
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      p={2}
    >
      <Modal open={open} onClose={handleClose}>  
        <Box 
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%,-50%)' }}
        >
          <Typography variant='h5' textAlign='center'>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant='outlined'
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box >
      </Modal>
      <Typography variant="h2" textAlign="center" mb={2}>Inventory Items</Typography>
      
      <TextField
        variant="outlined"
        placeholder="Search items"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
      />
  
  <Box 
  border="1px solid #333" 
  width="100%" 
  p={2} 
  bgcolor={'#f0f0f0'}
  sx={{ 
    maxHeight: '500px', 
    overflowY: 'auto' 
  }}
>
  <Stack spacing={2} direction={"column"}>
    <Button
      variant="contained"
      onClick={() => handleOpen()}
    >
      Add New Item
    </Button>
      <Box padding={2} sx={{ width: '100%' }}>
        <Grid container spacing={3}>
          {filteredInventory.map(({ name, quantity }) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
              <Box
                border="1px solid #ccc"
                borderRadius="8px"
                overflow="hidden"
                display="flex"
                flexDirection="column"
                alignItems="center"
                bgcolor="white"
                p={2}
                sx={{ height: '100%' }} // Ensure stretch to fill the grid cell
              >
                <Typography variant='h4'>{quantity}</Typography>
                <Typography variant='h6' mt={1}>{name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                <Stack direction="row" spacing={2} mt={2}>
                  <Button variant="contained" onClick={() => addItem(name)}>Add</Button>
                  <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
  </Stack>
</Box>

    </Box>
  );
}

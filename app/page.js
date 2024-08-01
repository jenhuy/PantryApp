'use client'
import Image from 'next/image'
import { useState, useEffect} from 'react'
import {Box, Stack, Modal, Typography, TextField, Button} from '@mui/material'
import {firestore} from '@/firebase'
import {collection, deleteDoc, doc, getDocs, query, setDoc,getDoc} from 'firebase/firestore'



export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open,setOpen] = useState (false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),

      })
    })
    setInventory(inventoryList)
  }
  
  const removeItem = async(item) =>{
    const docRef = doc(collection(firestore, 'inventory'),item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity ===1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity -1})
      }
    }
    await updateInventory()
  }

  const addItem = async(item) =>{
    const docRef = doc(collection(firestore, 'inventory'),item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
       await setDoc(docRef, {quantity: quantity +1})
      }
      else{
        await setDoc(docRef, {quantity: 1})
      }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useEffect(()=>{
    updateInventory()
  },[])

  return(
    <Box 
      width="100vw" 
      height = "100vh"
      display = {'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
      gap={2}
      bgcolor={'white'}
      >
        <Modal open = {open} onClose={handleClose}>  
          <Box 
          position = "absolute"  //modal creates a container for displaying content in a modal (popup) window
          top = "50%"  // ^ absolute positions the box absolutely within its containing element (the modal ??)
          left = "50%"   // positions box in center of screen
          width = {400}
          bgcolor="white"
          border = "2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"} 
          gap = {3}
          sx = {{
            transform: 'translate(-50%,-50%)',
          }}
          >
            <Typography variant='h5' textAlign={'center'}>Add Item</Typography>
            <Stack width ="100%" direction={"row"} spacing={2}>
              <TextField
              variant='outlined'   // Textfield is a material-ui component for input fields
              fullWidth //  Makes the input field take up the full width of its container.
              value = {itemName}
              onChange={(e) =>{
                setItemName(e.target.value)
              }}
              />
             <Button
             variant='outlined'
             onClick={()=>{
              addItem(itemName) 
              setItemName('') 
              handleClose()}}
             >
              Add
             </Button>
            </Stack>
          </Box>
        </Modal>
        <Button
        variant = "contained"
        onClick={()=> {
          handleOpen()
        }}
        >
          Add New Item
        </Button>
        <Box border="1px solid #333">
          <Box
          width="800px"
          height = "100px"
          bgcolor={"#C2DAB8"}  //inventory items header
          display = "flex"
          alignItems = "center"
          justifyContent = "center"
          >
            <Typography variant ="h2" color="333"> Inventory Items</Typography>
          </Box>
        <Stack width = "800px" height = "300px" spacing={2} overflow = "auto">
          {inventory.map(({name, quantity})=>(
              <Box 
              key={name} 
              width = "100%" 
              minHeight="150px" 
              display = "flex" 
              alignItems = "center"
              justifyContent="space-between" 
              bgcolor={"f0f0f0"} 
              padding ={5}
              >
                <Typography variant = 'h3' color = '#333' textAlign={'center'}> {name.charAt(0).toUpperCase() + name.slice(1)}</Typography>
                <Typography variant = 'h3' color = '#333' textAlign={'center'}> {quantity}</Typography>
                <Stack direction = "row" spacing={3}> 
                  <Button variant = "contained" onClick={()=> { addItem(name)}}> Add </Button>
                  <Button variant = "contained" onClick={()=> {removeItem(name)}}> Remove </Button>  
                </Stack>
              </Box>
            ))}
        </Stack>
      </Box>
      </Box>
  )
}
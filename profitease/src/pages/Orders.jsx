import React from 'react'
import Sidebar from '../components/Sidebar'
import { Box,Typography } from '@mui/material'


function Orders() {
  return (
    <>
    <Box sx={{display:'flex'}}>
    <Sidebar/>

    <Box component="main" sx={{ flexGrow:1, p:3, marginTop:"65px"}}>

    <Typography>Orders King</Typography>

      </Box>

  </Box>
  </>
  )
}

export default Orders
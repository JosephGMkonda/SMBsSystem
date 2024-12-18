import React from 'react'
import Sidebar from '../components/Sidebar'
import { Box,Typography } from '@mui/material'

const Home = () => {
  return (
    <Box sx={{display:'flex'}}>
      <Sidebar/>
     <Box component="main" sx={{ flexGrow:1, p:3, marginTop:"65px"}}>
  
     </Box>

    </Box>
  )
}

export default Home
import { Select, Box, FormControl, MenuItem } from '@mui/material'
import React from 'react'

const ViewOptions = () => {
    return (
        <Box>
            <FormControl>
                <Select>
                    <MenuItem>Group by list</MenuItem>
                    <MenuItem>Group by due date</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}

export default ViewOptions
import React, {useState} from 'react'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import ListIcon from '@mui/icons-material/List'
import TaskIcon from '@mui/icons-material/Task'
import TextField from '@mui/material/TextField'
import InputAdornment from "@mui/material/InputAdornment"
import SearchIcon from "@mui/icons-material/Search"


const Search = ({tasks, lists}) => {
    const [searchResults, setSearchResults] = useState({})
    const [focus, setFocus] = useState(false)

    const handleFilter = e => {
        const filter = e.target.value
        if (filter == '') {
            setSearchResults({})
            return;
        }
        const filteredTasks = tasks.filter(task => task.attributes.name.toLowerCase().includes(filter.toLowerCase()))
        const filteredLists = lists.filter(list => list.attributes.name.toLowerCase().includes(filter.toLowerCase()))
        setSearchResults({tasks: filteredTasks, 
                          lists: filteredLists})
    }

    return (
        <Box sx={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', margin:'25px', position:'relative'}}>
            <TextField type="text" id="outlined-basic" variant="filled" label='Search'
                onChange={handleFilter} 
                onFocus={()=>setFocus(true)}
                onBlur={()=>setFocus(false)}
                InputProps={{ 
                    endAdornment: (
                        <InputAdornment position='end'>
                            <SearchIcon />
                        </InputAdornment>
                      ),
                    style: {backgroundColor:'white'}
                    }}
            />
            <div className="results" style={{position:'absolute', top:60, zIndex:999}}>
                { searchResults.tasks !== undefined && focus &&
                <Stack>
                    {searchResults.tasks.map(task => 
                        <Paper onClick={() => alert('hi')}
                               key={"t" + task.id}>
                            <TaskIcon/>{task.attributes.name}
                        </Paper>)}
                </Stack> }
                { searchResults.lists !== undefined && focus &&
                <Stack>
                    {searchResults.lists.map(list => 
                        <Paper key={"l" + list.id}>
                            <ListIcon/>{list.attributes.name}
                        </Paper>)}
                </Stack> }
            </div>
        </Box>
    )
}

export default Search
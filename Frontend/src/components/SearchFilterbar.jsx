import React, { useState } from 'react'

const SearchFilterbar = ( {isProject, data} ) => {
    const[searchTerm, setSearchTerm]=useState("");

    const handleSearch=(e)=>{
        setSearchTerm(e.target.value.toLowerCase())
    }

    const filteredProjects=data.filter((project)=>{
        return data.projectName.toLowerCase().includes(searchTerm)
    })
    
    
  return (
    <div>
        <input type="text" placeholder='Search by project name' onChange={handleSearch}/>
        
    </div>
  )
}

export default SearchFilterbar
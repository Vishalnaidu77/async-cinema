import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'

export const themeContextData = createContext()

const ThemeContext = ({ children }) => {

    const [theme, setTheme] = useState("dark")
    
  return (
    <themeContextData.Provider value={{ theme, setTheme }}>
        {children}
    </themeContextData.Provider>
  )
}

export default ThemeContext

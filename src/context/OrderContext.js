import { View, Text } from 'react-native'
import React, { useContext, createContext, useState } from 'react'

const OrderContext = createContext()

export const useOrder = () => {
  return useContext(OrderContext)
}

export const OrderProvider = ({ children }) => {
  const [Globalorders, setGlobalOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  return (
    <OrderContext.Provider value={{ Globalorders, setGlobalOrders, isLoading, setIsLoading, error, setError }}>
      {children}
    </OrderContext.Provider>
  )
}

export default OrderProvider
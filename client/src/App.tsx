import './App.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './utils/trpc'
import { Route, BrowserRouter, Routes } from 'react-router'
import { Home } from './pages/Home'
import { SignUp } from './pages/SignUp'
import { SignIn } from './pages/SignIn'
function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <BrowserRouter>
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/signup" element={<SignUp />} />
               <Route path="/signin" element={<SignIn />} />
            </Routes>
         </BrowserRouter>
      </QueryClientProvider>
   )
}

export default App

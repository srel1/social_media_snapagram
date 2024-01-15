
import { QueryClient, QueryClientProvider } from 'react-query'
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export const QueryProvider = ({children}: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
        {children}
        
    </QueryClientProvider>
  )
}

export default QueryProvider
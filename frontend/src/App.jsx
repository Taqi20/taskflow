import './App.css'
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider, useLoading } from './contexts/LoadingContext'
import Layout from './Layout';
// import TopLoader from "react-top-loader"

// function TopLoaderComponent() {
//   const { loading } = useLoading();

//   return <TopLoader show={loading} color="magenta" />
// }

function App() {
  return (
    <LoadingProvider>
      {/* <TopLoaderComponent /> */}
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </LoadingProvider>
  )
}

export default App

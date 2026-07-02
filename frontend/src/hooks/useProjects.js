import { useEffect, useState } from 'react'
import { getFeaturedProjects } from '../services/projectService'

function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getFeaturedProjects()
        setProjects(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
  }
}

export default useProjects
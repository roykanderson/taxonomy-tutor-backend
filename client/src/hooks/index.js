import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'

import observationsService from '../services/observations'
import wikiService from '../services/wikiService'
import userService from '../services/userService'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

// Accepts a search argument. Returns search results and status of async request.
export const useResults = (search, page = 1) => {
  const fetchResults = async ({ queryKey }) => {
    // The server first matches the search to a taxon
    const taxon = await observationsService.searchForTaxon(queryKey[1])

    // Then retrieves all descendants
    const descendants = await observationsService.searchForDescendants(taxon.id, queryKey[2])
    return descendants
  }

  return useQuery({
    queryKey: ['results', search, page],
    queryFn: fetchResults,
    staleTime: Infinity,
    keepPreviousData: true
  })
}

export const useWikiSummary = (url) => {
  return useQuery({
    queryKey: ['wikiSummary', url],
    queryFn: async ({ queryKey }) => await wikiService.getWikiSummary(queryKey[1]),
    staleTime: Infinity
  })
}

export const useSignup = (credentials) => {
  const signUp = async (credentials) => {
    const response = await userService.signUp(credentials)
    return response.data
  }

  return useQuery(['user'], signUp)
}

export const useSets = () => {
  const getSets = async () => {
    const response = await userService.getSets()
    return response
  }

  return useQuery(['sets'], getSets)
}

export const useTaxa = (ids) => {
  const getTaxa = async ({ queryKey }) => {
    const taxa = queryKey[1].map(async id => {
      const taxon = await observationsService.fetchTaxaById(id)
      taxon.wikiSummary = await wikiService.getWikiSummary(taxon.wikipedia_url)
      return taxon
    })
    return await Promise.all(taxa)
  }

  return useQuery({
    queryKey: ['taxa', ids],
    queryFn: getTaxa,
    staleTime: Infinity
  })
}

export const useUpdateSet = (setShowModal, setError) => {
  return useMutation({
    mutationFn: async ({ taxon, set }) => {
      await userService.updateSet(set.id, set.name, set.taxonIds.concat(String(taxon.id)))
    },
    onError: () => {
      setError(true)
    },
    onSuccess: () => {
      setShowModal(false)
    }
  })
}

export const useCreateSet = (setShowModal) => {
  return useMutation({
    mutationFn: async ({ taxon, title }) => {
      await userService.createSet(title, [String(taxon.id)])
    },
    onSuccess: () => {
      setShowModal(false)
    }
  })
}

export const useDeleteSet = (navigateAfterDeletion) => {
  return useMutation({
    mutationFn: async (id) => {
      await userService.deleteSet(id)
    },
    onSuccess: () => {
      navigateAfterDeletion()
    }
  })
}

export const useOutsideAlerter = (ref, sideEffectFn) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        sideEffectFn()
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    };
  }, [ref, sideEffectFn]);
}
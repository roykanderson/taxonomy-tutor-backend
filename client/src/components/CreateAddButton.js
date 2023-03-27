import { useState } from "react"
import observationsService from "../services/observations"
import taxaService from "../services/taxaService"

const CreateAddButton = ({ taxa, setTaxa }) => {
  const [active, setActive] = useState(false)
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  console.log(suggestions)

  const handleInputChange = async ({ target }) => {
    setInput(target.value)
    if (target.value) {
      const results = await taxaService.fetchTaxaSuggestions(target.value)
      setSuggestions(results.filter(result => result.rank === 'species'))
    } else {
      setSuggestions(null)
    }
  }

  const handleSuggestionClick = async ({ target }) => {
    // Prevent user from adding duplicate taxa
    if (taxa.some(taxon => String(taxon.id) === target.getAttribute('data-id'))) {
      setErrorMessage('Oops! That species is already in the set.')
      setTimeout(() => setErrorMessage(''), 2000)
    }
    else {
      setTaxa(taxa.concat(suggestions[target.getAttribute('index')]))
    }
    
    setSuggestions(null)
    setInput('')
    setActive(false)
  }

  return (
    <>
      {active
        ? <>
            <input autoFocus={true} onBlur={() => setActive(false)}
              className="create-add active"
              type="text"
              placeholder="Search for a species..."
              value={input}
              onChange={handleInputChange}
            />
            <ul className='create-suggestions'>
              {suggestions && suggestions.map((suggestion, index) =>
                <li key={suggestion.id} className='create-suggestion' onMouseDown={handleSuggestionClick} data-id={suggestion.id} index={index}>
                  {suggestion.default_photo &&
                    <img src={suggestion.default_photo.url} alt={suggestion.preferred_common_name} data-id={suggestion.id} index={index} />
                  }
                  <div className="create-suggestion-common" data-id={suggestion.id} index={index}>
                    {suggestion.preferred_common_name}
                  </div>
                  <div className="create-suggestion-sci" data-id={suggestion.id} index={index}>
                    {suggestion.name}
                  </div>
                </li>
              )}
            </ul>
          </>
        : <button className={errorMessage ? 'create-add error' : 'create-add'} onClick={() => setActive(true)}>
            {errorMessage
              ? <>
                  {errorMessage}
                </>
              : <>
                  + Add species
                </>
            }
          </button>
      }
    </>
  )
}

export default CreateAddButton
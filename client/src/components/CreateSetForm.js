import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useCreateSet } from "../hooks"

import CreateAddButton from "./CreateAddButton"
import CreateTaxon from "./CreateTaxon"
import CreateTitle from "./CreateTitle"

const CreateSetForm = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [taxa, setTaxa] = useState([])

  const createSet = useCreateSet(navigate)

  const handleCreate = () => {
    createSet.mutate({ title, taxonIds: taxa.map(taxa => taxa.id) })
  }

  return (
    <div className="create-container">
      <CreateTitle title={title} setTitle={setTitle} />
      {taxa.map((taxon, index) =>
        <CreateTaxon key={taxon.id} taxa={taxa} setTaxa={setTaxa} index={index} />
      )}
      <CreateAddButton
        taxa={taxa}
        setTaxa={setTaxa}
      />
      <button className={title ? 'create-submit' : 'create-submit inactive'} onClick={handleCreate} disabled={!title}>
        Create
      </button>
    </div>
  )
}

export default CreateSetForm
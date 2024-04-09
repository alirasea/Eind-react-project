import React from "react";
import { useEffect,useState } from "react"
import axios from'axios'

export default function Search() {
  const[input,setInput]=useState([])
  const[product,setProduct]=useState([])
  const[results,setResults]=useState([])
  const[error,setError] = useState(false)
  const[worning,setWorning] = useState('Search')

  useEffect(()=>{
    axios.get('https://api.serpwow.com/search?api_key=8F154D3B5D63472CB239344F2A9DDC60&q=Sunglass+&engine=google')
    .then(product=>{console.log(product.data);setProduct(product.data)})
    .catch(err => setError("someting went wrong pleace try again"))
  },[])
  const handelSubmit=(e)=>{
    e.preventDefault()
    if (input==="") {
      return setWorning("please enter a product name")
    }else{
      const searchTermSubmit=input.toLowerCase()
      const specificProduct=product.filter((item)=> item.name.toLowerCase()===searchTermSubmit)
      if(!specificProduct){const relatedProduct=product.data.filter((item)=> item.name.toLowerCase().include(searchTermSubmit));setResults(relatedProduct)
      }else{setResults(specificProduct)}
      setInput('')
    }
  }
  const handelChang=(e)=>{
    const searchTerm =e.target.value.toLowerCase();
    setInput(searchTerm)
    if (product && product.data) {
    const ProductsRelated=product.shopping_graphs.filter((item)=> item.title.toLowerCase().starteWith(searchTerm))
    setResults(ProductsRelated)
  }}
  const handelClick=(ProuductId)=>{
    const findProduct = product.find(product => product.id === ProuductId);
    if (findProduct) {
      setResults([findProduct]);
  }
  }
  return (
    <div>
    <div class="search-container">
        <form class="search-form"  onSubmit={handelSubmit}>
            <input
             className="search-input"
                type="text"
                onChange={handelChang}
                value={input}
                placeholder={worning}
            />
             <button class="search-button" type='submit'>Search</button>
             </form>
            <ul className="search-results" id="searchResults">
            {input && results && results.map(product =><li key={product.id} 
            onClick={() => handelClick(product.position)}>{product.title}</li>)}
             </ul>
             </div>
        {error&& <p>{error}</p>}
  
</div>
)};



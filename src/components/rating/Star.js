import { StarIcon } from "@heroicons/react/outline";

const Star = ({selected=false, onSelect = f => f})=>(
    <StarIcon  
        height={20}
        className={selected ?"fill-red-500":"fill-gray-100"}
        color={selected ?"red":"gray"}
        onClick={onSelect}/>
)
export default Star
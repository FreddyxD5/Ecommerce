import { useState } from "react";

import Star from "./Star"

const createArray = length => [...Array(length)]

export default function StarRating({    
    totalStars=5,
    selectedStars=0,
    
}){

    // const rateColor = (id, rating) => 
    //     setColors([
    //         colors.map(color=>(color.id ===id ? {...color, rating}:color))
    //     ])

    const onRate = () => {

    }
    return (
        <>
        <div style={{display:"flex"}}>
            {createArray(totalStars).map((n,i)=>(
                <Star 
                key={i}
                selected={selectedStars>i}
                onSelect = {()=>onRate(i+1)}
                />

            ))}
        </div>
        </>
    )
}
'use client';

import { useEffect, useState } from "react";
import PropertyListItem from "./PropertyListItem";
import { get } from "http";

export type PropertyType = {
    id: string;
    title: string;
    image_url: string;
    price_per_night: number;
}


const PropertyList = () => {
    const [properties, setProperties] = useState<PropertyType[]>([]);

    const getProperties = async () => {
        const url = 'http://localhost:8000/api/properties/';

        await fetch(url, {
            method: 'GET',
        })    

        .then((response) => response.json())
        .then((json) => {
            console.log('json', json);

            setProperties(json.data);
        })
        .catch((error) => {
            console.error('error', error);
        });
    };  

        useEffect(() => {
                getProperties();
            }, []);

    return (
            <>
            {properties.map((property: any) => {
                return (
                <PropertyListItem
                    key={property.id}
                    property={property}
                    
                />
                );
            })}
            </>
    );
};  

export default PropertyList;
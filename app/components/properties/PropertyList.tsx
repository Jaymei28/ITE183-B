'use client';

import { useEffect, useState } from "react";
import PropertyListItem from "./PropertyListItem";
import apiService from "@/app/services/apiService";

export type PropertyType = {
    id: string;
    title: string;
    image_url: string;
    price_per_night: number;
}


interface PropertyListProps {
    landlord_id?: string;
}

const PropertyList = ({ landlord_id }: PropertyListProps) => {
    const [properties, setProperties] = useState<PropertyType[]>([]);

    const getProperties = async () => {
        const url = landlord_id 
            ? `/api/properties/?landlord_id=${landlord_id}`
            : '/api/properties/';
        const json = await apiService.get(url);
        console.log('json', json);
        setProperties(json.data);
    };  

        useEffect(() => {
            getProperties();
            }, [landlord_id]); 

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

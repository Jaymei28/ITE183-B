'use client';

import { useEffect, useState } from "react";
import PropertyListItem from "./PropertyListItem";
import apiService from "@/app/services/apiService";

export type PropertyType = {
    id: string;
    title: string;
    image_url: string;
    price_per_night: number;
    is_favorite: boolean;
}


interface PropertyListProps {
    landlord_id?: string;
}

const PropertyList = ({ landlord_id }: PropertyListProps) => {
    const [properties, setProperties] = useState<PropertyType[]>([]);

    const markFavorite = (id: string, is_favorite: boolean) => {
        const tmpProperties = properties.map((property: PropertyType) => {
            if (property.id === id) {
                property.is_favorite = is_favorite

                if (is_favorite) {
                    console.log('property added to favorites', property.id)
                } else {
                    console.log('removed from list', property.id)
                }
            }

            return property; 
        });

        setProperties(tmpProperties);
    }

    const getProperties = async () => {
        const url = landlord_id 
            ? `/api/properties/?landlord_id=${landlord_id}`
            : '/api/properties/';
        const json = await apiService.get(url);
        console.log('json', json);
        
        // Map favorites array to set is_favorite on each property
        const favorites = json.favorites || [];
        const propertiesWithFavorites = json.data.map((property: PropertyType) => ({
            ...property,
            is_favorite: favorites.includes(property.id)
        }));
        
        setProperties(propertiesWithFavorites);
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
                    markFavorite={(is_favorite: any) => markFavorite(property.id, is_favorite)}
                />
                );
            })}
            </>
    );
};  

export default PropertyList;

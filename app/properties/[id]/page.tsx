import Image from "next/image";
import Link from "next/link";
import ReservationSidebar from '@/app/components/properties/ReservationSideBar';

import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";

const PropertyDetailPage = async ({params}: { params: Promise<{id: string }> }) => {
    const { id } = await params;
    
    let response;
    try {
        response = await apiService.get(`/api/properties/${id}`);
    } catch (error) {
        return (
            <main className="max-w-[1500px] mx-auto px-6 pb-6">
                <div className="py-6">
                    <h1 className="text-2xl mb-4">Error Loading Property</h1>
                    <p className="text-gray-600">Unable to load the property. Please try again later.</p>
                </div>
            </main>
        );
    }

    if (response.error) {
        return (
            <main className="max-w-[1500px] mx-auto px-6 pb-6">
                <div className="py-6">
                    <h1 className="text-2xl mb-4">Property Not Found</h1>
                    <p className="text-gray-600">{response.error}</p>
                </div>
            </main>
        );
    }

    const property = response.data;
    const userId = await getUserId();

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <div className="w-full h-[64vh] mb-4 overflow-hidden rounded-xl relative">
                <Image
                    fill
                    src={property.image_url}
                    className="object-cover w-full h-full"
                    alt="Beach house"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="py-6 pr-6 col-span-3">
                    <h1 className="mb-4 text-4xl">{property.title}</h1>

                    <span className="mb-6 block text-lg text-gray-600">
                        {property.guests} guests - {property.bedrooms} bedrooms - {property.bathrooms} bathrooms
                    </span>

                    <hr />

                    <Link 
                        href={`/landlords/${property.landlord.id}`}
                        className="py-6 flex items-center space-x-4"
                    >
                        {property.landlord.avatar_url && (
                            <Image
                                src={property.landlord.avatar_url}
                                width={50}
                                height={50}
                                className="rounded-full"
                                alt="The user name"
                            />
                        )}

                        <p><strong>{property.landlord.name}</strong> is your host</p>
                    </Link>

                    <hr />

                    <p className="mt-6 text-lg">
                        {property.description}
                    </p>
                </div>

                <ReservationSidebar 
                    property={property}
                    userId={userId}
                />
            </div>
        </main>
    )
}

export default PropertyDetailPage;
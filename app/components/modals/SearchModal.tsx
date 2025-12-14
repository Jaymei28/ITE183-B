'use client';

import Modal from "./Modal";
import { useState } from "react";
import { Range } from "react-date-range";
import DatePicker from "../forms/Calendar";
import CustomButton from "../forms/CustomButton";
import useSearchModal, { SearchQuery } from "../../hooks/useSearchModal";
import SelectCountry, { SelectCountryValue } from "../forms/SelectCountry";

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

const SearchModal = () => {
    let content = (<></>);
    const searchModal = useSearchModal();
    const [numGuests, setNumGuests] = useState<string>('1');
    const [numBedrooms, setNumBedrooms] = useState<string>('0');
    const [country, setCountry] = useState<SelectCountryValue>();
    const [numBathrooms, setNumBathrooms] = useState<string>('0');
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);

    //
    //

    const closeAndSearch = () => {
        const newSearchQuery: SearchQuery = {
            country: country?.label,
            checkIn: dateRange.startDate,
            checkOut: dateRange.endDate,
            guests: parseInt(numGuests),
            bedrooms: parseInt(numBedrooms),
            bathrooms: parseInt(numBathrooms),
            category: ''
        }

        searchModal.setQuery(newSearchQuery);
        searchModal.close();
    }

    //
    // Set date range

    const _setDateRange = (selection: Range) => {
        if (searchModal.step === 'checkin') {
            searchModal.open('checkout');
        } else if (searchModal.step === 'checkout') {
            searchModal.open('details');
        }

        setDateRange(selection);
    }

    //
    // Contents

    const contentLocation = (
        <>
            <h2 className="mb-6 text-2xl">Where do you want to go?</h2>

            <SelectCountry
                value={country}
                onChange={(value) => setCountry(value as SelectCountryValue)}
            />

            <div className="mt-6 flex flex-row gap-4">
                <CustomButton
                    label="Check in date ->"
                    onClick={() => searchModal.open('checkin')}
                />
            </div>
        </>
    )

    const contentCheckin = (
        <>
            <h2 className="mb-6 text-2xl">When do you want to check in?</h2>

            <DatePicker
                value={dateRange}
                onChange={(value) => _setDateRange(value.selection)}
            />

            <div className="mt-6 flex flex-row gap-4">
                <CustomButton
                    label="<- Location"
                    onClick={() => searchModal.open('location')}
                />

                <CustomButton
                    label="Check out date ->"
                    onClick={() => searchModal.open('checkout')}
                />
            </div>
        </>
    )

    const contentCheckout = (
        <>
            <h2 className="mb-6 text-2xl">When do you want to check out?</h2>

            <DatePicker
                value={dateRange}
                onChange={(value) => _setDateRange(value.selection)}
            />

            <div className="mt-6 flex flex-row gap-4">
                <CustomButton
                    label="<- Check in date"
                    onClick={() => searchModal.open('checkin')}
                />

                <CustomButton
                    label="Details ->"
                    onClick={() => searchModal.open('details')}
                />
            </div>
        </>
    )


    return (
        <Modal
            label="Search"
            content={content}
            close={searchModal.close}
            isOpen={searchModal.isOpen}
        />
    )
}

export default SearchModal;
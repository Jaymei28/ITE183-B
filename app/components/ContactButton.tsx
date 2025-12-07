'use client';

interface ContactButtonProps {
    userId: string | null;
    landlordId: string;
}

const ContactButton: React.FC<ContactButtonProps> = ({ userId, landlordId }) => {
    return (
        <div className="mt-6 py-4 px-6 bg-airbnb cursor-pointer text-white rounded-xl hover:bg-airbnb-dark transition">
            Contact
        </div>
    )
}

export default ContactButton;
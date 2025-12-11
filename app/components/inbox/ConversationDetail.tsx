'use client';
import { useEffect, useState, useRef } from "react";
import CustomButton from "../forms/CustomButton";
import { ConversationDetailType } from "@/app/inbox/[id]/page";
import { UserType } from "@/app/inbox/page";
import apiService from "@/app/services/apiService";

interface ConversationDetailProps {
    conversation: ConversationDetailType;
    userId: string;
    token: string;
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation, userId, token }) => {
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [messages, setMessages] = useState(conversation.messages);
    const [newMessage, setNewMessage] = useState('');
    const myUser = conversation.users?.find((user) => user.id == userId)
    const otherUser = conversation.users?.find((user) => user.id != userId)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage) return;

        console.log('sendMessage');

        const formData = new FormData();
        formData.append('body', newMessage);
        if (userId) {
            formData.append('created_by', userId);
        }
        if (otherUser) {
            formData.append('sent_to', otherUser.id);
        }

        const response = await apiService.post(`/api/chat/${conversation.id}/send_message/`, formData);

        if (response.success) {
            setNewMessage('');

            setMessages((prev) => [...prev, response.data]);
        } else {
            console.error('Failed to send message:', response.error);
        }
    }

    console.log('Messages:', messages);
    console.log('Conversation:', conversation);

    return (
        <>
            <div className="max-h-[400px] overflow-auto flex flex-col space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`w-[80%] py-4 px-6 rounded-xl ${message.created_by.id == userId ? 'ml-[20%] bg-blue-200' : 'bg-gray-200'}`}
                    >
                        <p className="font-bold text-gray-500">{message.created_by?.name || message.created_by?.email || 'Unknown'}</p>
                        <p>{message.body}</p>
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            <div className="mt-4 py-4 px-6 flex border border-gray-300 space-x-4 rounded-xl">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-2 bg-gray-200 rounded-xl"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />

                <CustomButton
                    label='Send'
                    onClick={sendMessage}
                    className="w-[100px]"
                />
            </div>
        </>
    )
}

export default ConversationDetail;
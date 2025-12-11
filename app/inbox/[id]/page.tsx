import ConversationDetail from "@/app/components/inbox/ConversationDetail";
import { getUserId, getAccessToken } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";
import { UserType } from "../page";

export type MessageType = {
    id: string;
    body: string;
    sent_to: UserType;
    created_by: UserType;
    created_at_formatted: string;
}

export type ConversationDetailType = {
    id: string;
    users: UserType[];
    messages: MessageType[];
    modified_at: string;
}

const ConversationPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userId = await getUserId();
    const token = await getAccessToken();

    if (!userId || !token) {
        return (
            <main className="max-w-[1500px] max-auto px-6 py-12">
                <p>You need to be authenticated...</p>
            </main>
        )
    }

    const conversation = await apiService.get(`/api/chat/${id}/`);

    return (
        <main className="max-w-[1500px] mx-auto px-6 pb-6">
            <ConversationDetail
                conversation={conversation}
                userId={userId}
                token={token}
            />
        </main>
    )
}

export default ConversationPage;
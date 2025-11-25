import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  receiver: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    fullName: string;
    avatar?: string;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  itemId?: string;
  itemTitle?: string;
  updatedAt: string;
}

interface MessageState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  totalUnread: number;
}

const initialState: MessageState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  loading: false,
  totalUnread: 0,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.totalUnread = action.payload.reduce(
        (sum, conv) => sum + conv.unreadCount,
        0
      );
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      
      // Update conversation's last message
      const conv = state.conversations.find(
        (c) => c._id === action.payload.conversationId
      );
      if (conv) {
        conv.lastMessage = action.payload;
        conv.updatedAt = action.payload.createdAt;
      }
    },
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conv = state.conversations.find((c) => c._id === action.payload);
      if (conv) {
        state.totalUnread -= conv.unreadCount;
        conv.unreadCount = 0;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setConversations,
  setCurrentConversation,
  setMessages,
  addMessage,
  markConversationAsRead,
  setLoading,
} = messageSlice.actions;

export default messageSlice.reducer;

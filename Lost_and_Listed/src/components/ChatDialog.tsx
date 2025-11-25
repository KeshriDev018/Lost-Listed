import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, addMessage } from "@/redux/messageSlice";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { toast } from "sonner";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  otherUser: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  itemId?: string;
  itemTitle?: string;
}

const ChatDialog = ({
  open,
  onOpenChange,
  otherUser,
  itemId,
  itemTitle,
}: ChatDialogProps) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store: any) => store.auth);
  const { messages } = useSelector((store: any) => store.message);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && otherUser._id) {
      loadMessages();
    }
  }, [open, otherUser._id]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/messages/conversation/${otherUser._id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(setMessages(response.data.data));
      }
    } catch (error: any) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await axios.post(
        `/api/v1/messages/send`,
        {
          receiverId: otherUser._id,
          content: newMessage,
          itemId,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(addMessage(response.data.data));
        setNewMessage("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherUser.avatar} />
              <AvatarFallback>{otherUser.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-base">{otherUser.fullName}</DialogTitle>
              {itemTitle && (
                <p className="text-xs text-muted-foreground">
                  About: {itemTitle}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message: any) => {
                const isOwnMessage = message.sender === user._id;
                return (
                  <div
                    key={message._id}
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        isOwnMessage
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      } rounded-lg p-3`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              size="icon"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;

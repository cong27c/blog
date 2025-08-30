import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import FallbackImage from "../../components/FallbackImage/FallbackImage";
import styles from "./DirectMessages.module.scss";
import { getUserConversations } from "@/services/conversationServices";
import {
  getMessages,
  markAsReadApi,
  sendMessage,
} from "@/services/messageService";
import { useSelector } from "react-redux";
import socketClient from "@/utils/socketClient";

const DirectMessages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUserId = useSelector((state) => state.auth.user.id);
  const [conversationId, setConversationId] = useState(null);

  // Mock data - in real app this would come from API
  const [conversations, setConversations] = useState([]);

  const [messages, setMessages] = useState([]);
  //       {
  //         id: 1,
  //         text: "Hi! I really enjoyed your latest post about TypeScript best practices.",
  //         senderId: 2,
  //         timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  //       },
  //       {
  //         id: 2,
  //         text: "Thank you! I'm glad you found it helpful. Are you using TypeScript in your projects?",
  //         senderId: 1,
  //         timestamp: new Date(Date.now() - 90 * 60 * 1000),
  //       },
  //       {
  //         id: 3,
  //         text: "Yes, we just migrated our entire React app to TypeScript. The type safety is amazing!",
  //         senderId: 2,
  //         timestamp: new Date(Date.now() - 60 * 60 * 1000),
  //       },
  //       {
  //         id: 4,
  //         text: "Hey! Did you see the latest blog post about React hooks?",
  //         senderId: 2,
  //         timestamp: new Date(Date.now() - 30 * 60 * 1000),
  //       },
  //     ],
  //     2: [
  //       {
  //         id: 5,
  //         text: "Thanks for the feedback on my article!",
  //         senderId: 1,
  //         timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  //       },
  //     ],
  //     3: [
  //       {
  //         id: 6,
  //         text: "Would love to collaborate on a project!",
  //         senderId: 4,
  //         timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  //       },
  //     ],
  // Get conversation ID from URL params
  useEffect(() => {
    const fetchConversation = async () => {
      const conversationId = searchParams.get("conversation");
      const conversations = await getUserConversations();
      setConversations(conversations);
      if (conversationId) {
        const conversation = conversations.find(
          (c) => c.id === parseInt(conversationId)
        );
        if (conversation) {
          setSelectedConversation(conversation);
          setConversationId(conversation.id);
          const msgs = await getMessages(conversation.id);

          setMessages(msgs);
          markAsRead(conversation.id);
        }
      }
    };
    fetchConversation();
  }, [searchParams]);
  console.log(messages);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markAsRead = async (conversationId) => {
    try {
      const lastMsg = messages.slice(-1)[0];
      if (!lastMsg) return;

      await markAsReadApi(conversationId, lastMsg.id);

      // reset unreadCount local
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  };
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setSearchParams({ conversation: conversation.id.toString() });
    markAsRead(conversation.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const newMsg = await sendMessage({
        recipientId: selectedConversation.participant.id,
        conversationId: selectedConversation.id,
        type: "text",
        content: newMessage.trim(),
      });

      // Cập nhật lastMessage của conversation
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: {
                  text: newMsg.content, // chỗ này dùng "content" nếu API trả về vậy
                  timestamp: newMsg.timestamp,
                  senderId: newMsg.senderId,
                },
              }
            : conv
        )
      );

      // Clear input
      setNewMessage("");
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    const channel = socketClient.subscribe(`conversation-${conversationId}`);
    channel.bind("new-message", (data) => {
      const newMsg = data.message;

      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socketClient.unsubscribe(`conversation-${conversationId}`);
    };
  }, [conversationId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    const d = new Date(date); // ✅ đảm bảo luôn là Date object
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return d.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participant.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Conversations Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h1 className={styles.title}>Messages</h1>
            <Button
              variant="ghost"
              size="sm"
              className={styles.newMessageButton}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </Button>
          </div>

          <div className={styles.searchSection}>
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.conversationsList}>
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`${styles.conversationItem} ${
                  selectedConversation?.id === conversation.id
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className={styles.avatarContainer}>
                  <FallbackImage
                    src={conversation.participant.avatar}
                    alt={conversation.participant.name}
                    className={styles.avatar}
                  />
                  {conversation.participant.isOnline && (
                    <div className={styles.onlineIndicator} />
                  )}
                </div>

                <div className={styles.conversationContent}>
                  <div className={styles.conversationHeader}>
                    <span className={styles.participantName}>
                      {conversation.participant.name}
                    </span>
                    <span className={styles.timestamp}>
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  <div className={styles.lastMessage}>
                    <span className={styles.messageText}>
                      {conversation.lastMessage.text}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className={styles.messagesArea}>
          {selectedConversation ? (
            <>
              {/* Messages Header */}
              <div className={styles.messagesHeader}>
                <div className={styles.participantInfo}>
                  <FallbackImage
                    src={selectedConversation.participant.avatar}
                    alt={selectedConversation.participant.name}
                    className={styles.headerAvatar}
                  />
                  <div>
                    <h2 className={styles.participantName}>
                      {selectedConversation.participant.name}
                    </h2>
                    <span className={styles.participantStatus}>
                      {selectedConversation.participant.isOnline
                        ? "Online"
                        : "Offline"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Thread */}
              <div className={styles.messagesThread}>
                {messages?.map((message) => {
                  return (
                    <div
                      key={message.id}
                      className={`${styles.message} ${
                        message.senderId === currentUserId
                          ? styles.sent
                          : styles.received
                      }`}
                    >
                      <div className={styles.messageContent}>
                        <span className={styles.messageText}>
                          {message.text}
                        </span>
                        <span className={styles.messageTime}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className={styles.messageInputContainer}>
                <div className={styles.messageInputWrapper}>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${selectedConversation.participant.name}...`}
                    className={styles.messageInput}
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={styles.sendButton}
                    size="sm"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateContent}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={styles.emptyIcon}
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <h3 className={styles.emptyTitle}>Select a conversation</h3>
                <p className={styles.emptyDescription}>
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectMessages;

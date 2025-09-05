"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ChatbotWidget.module.scss";
import {
  chatMessage,
  createConversation,
} from "@/services/conversationServices";
import { useSelector } from "react-redux";
import socketClient from "@/utils/socketClient";

export default function ChatbotWidget() {
  const [conversationId, setConversationId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào 👋, tôi có thể giúp gì cho bạn?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const user = useSelector((state) => state.auth.user);

  const messagesEndRef = useRef(null); // 👈 Tham chiếu phần tử cuối cùng

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); // mỗi khi messages thay đổi → scroll

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      // Khi mở widget → kiểm tra localStorage
      const savedConvId = localStorage.getItem("conversationId");
      if (savedConvId) {
        setConversationId(savedConvId);
      }
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    let convId = conversationId;
    if (!convId) {
      const res = await createConversation();
      convId = res.id;
      setConversationId(res.id);
      localStorage.setItem("conversationId", convId);
    }

    // User message
    const userMessage = {
      id: Date.now(),
      text: message,
      isBot: false, // 👈 User
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    // Gửi lên server
    try {
      const res = await chatMessage(convId, message);
      console.log(res);
      if (res?.message) {
        const botMessage = {
          id: res.message.id || Date.now() + 1,
          text: res.message.content,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
    }
  };

  // Custom SVG icons to replace lucide-react icons
  const MessageCircleIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );

  const XIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );

  const SendIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
  if (!user) return null;

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={toggleChat}
        className={styles.chatButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <XIcon />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircleIcon />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={styles.chatWindow}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.avatar}>
                  <MessageCircleIcon />
                </div>
                <div>
                  <h3 className={styles.title}>Chatbot</h3>
                  <p className={styles.subtitle}>
                    Chúng tôi luôn sẵn sàng hỗ trợ
                  </p>
                </div>
              </div>
              <button onClick={toggleChat} className={styles.closeButton}>
                <XIcon />
              </button>
            </div>

            {/* Messages Area */}
            <div className={styles.messagesArea}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${styles.messageContainer} ${
                    msg.isBot ? styles.botMessage : styles.userMessage
                  }`}
                >
                  <div
                    className={`${styles.messageBubble} ${
                      msg.isBot ? styles.botBubble : styles.userBubble
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
              <form onSubmit={handleSendMessage} className={styles.inputForm}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className={styles.messageInput}
                />
                <button type="submit" className={styles.sendButton}>
                  <SendIcon />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
